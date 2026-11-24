# 8. CI/CD Architecture

## Monorepo & Pipeline Strategy
- **Repository Structure**: Turborepo + pnpm workspaces (`apps/web`, `apps/api`, `apps/payment-service`, `packages/shared-types`, `packages/ui`).
- **Branching Model**: Trunk-based development (`main` + short-lived `feat/*` PRs + `release/*` tags).

```mermaid
flowchart LR
    PR["Pull Request"] --> Lint["Lint & Typecheck\n(ESLint, tsc, Prettier)"]
    Lint --> Test["Unit & Integration Tests\n(Vitest / Jest + Testcontainers PG/Redis)"]
    Test --> Sec["Security Scans\n(Gitleaks, Semgrep SAST, npm audit)"]
    Sec --> Build["Docker Multi-Stage Build\n+ Trivy Image Scan"]
    Build --> Registry["Push to GHCR / ECR\n(Cosign Signed Image)"]
    Registry --> Stage["Deploy Staging\n+ Run DB Migrations + E2E (Playwright)"]
    Stage --> Prod{"Manual / Canary Gate"}
    Prod -->|Phase 1| VPS["SSH / Watchtower / Compose Rollout"]
    Prod -->|Phase 2/3| Argo["ArgoCD GitOps Canary\n(5% -> 25% -> 100%)"]
```

---

## Database Migration Safety
1. **Expand-and-Contract Pattern**: Never run breaking `DROP COLUMN` or `ALTER TYPE` in the same release as code changes.
2. **Pre-Deploy Gate**: Migrations run as an init-container / CI pre-step (`prisma migrate deploy` or `typeorm migration:run`) with a lock timeout (`SET lock_timeout = '5s'`) so a slow lock never queues production traffic.
3. **Zero-Downtime Rollouts**:
   - **Phase 1**: Blue-green container swap behind Caddy (`docker compose up -d --no-deps --scale api=2` → healthcheck pass → drain old container).
   - **Phase 2/3**: Argo Rollouts with automated Prometheus error-rate/p99 rollback triggers.
