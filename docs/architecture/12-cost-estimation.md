# 12. Cost Estimation (10K, 100K, 1M Users)

> **Assumptions**: Monthly active users (MAU) ≈ 25–35% of registered users. Includes Infrastructure, Object Storage/CDN, Managed Data, Monitoring, and variable SaaS (SMS/WhatsApp OTP, KYC, LLM APIs). Excludes payment gateway % fees (passed through or covered by platform commission).

---

## Monthly Cost Breakdown (USD / Month)

### Tier 1: 10,000 Registered Users (~3,000 MAU) — Phase 1 (Hostinger VPS)
| Category | Specification | Monthly Cost |
|---|---|---|
| **Compute** | Hostinger KVM 8 (8 vCPU, 32 GB RAM, 400 GB NVMe) + KVM 2 staging | \$45 |
| **Object Storage & CDN** | Cloudflare Free/Pro + Cloudflare R2 (100 GB, zero egress) | \$25 |
| **Transactional Email/SMS** | Resend + Africa's Talking / Twilio (~5K OTP SMS/mo) | \$60 |
| **KYC Verifications** | ~300 new ID checks/mo @ \$0.80–\$1.20 (Smile ID / Youverify) | \$300 |
| **Generative AI APIs** | GPT-4o-mini / Claude Haiku + embeddings (cached) | \$80 |
| **Monitoring & Backups** | Self-hosted Prometheus/Grafana/Loki + R2 encrypted backups | \$15 |
| **Total Monthly Cost** | | **~\$525 / mo** (~$\$6,300$ / yr) |

---

### Tier 2: 100,000 Registered Users (~30,000 MAU) — Phase 2 (Managed Kubernetes)
| Category | Specification | Monthly Cost |
|---|---|---|
| **Kubernetes Compute** | EKS/GKE Control Plane + 6–10 worker nodes (Spot + On-Demand) | \$1,100 |
| **Managed PostgreSQL** | Multi-AZ Primary + 1 Read Replica (8 vCPU, 32 GB RAM) | \$850 |
| **Redis & RabbitMQ** | Managed Redis Cluster + RabbitMQ HA | \$400 |
| **Search & Storage** | Meilisearch HA / OpenSearch + R2/S3 (1 TB) + Cloudflare Business | \$550 |
| **Video Calls (WebRTC)** | LiveKit Cloud / Agora (~25,000 mins/mo) | \$150 |
| **Comms (SMS/WhatsApp)** | ~40,000 OTP/alert messages/mo | \$450 |
| **KYC & AML Screening** | ~2,500 verifications/mo (volume tier) | \$1,800 |
| **Generative AI APIs** | Hybrid (Llama 3 / Mistral self-hosted GPU + frontier LLM fallback) | \$600 |
| **Observability** | Grafana Cloud / Datadog + Sentry | \$300 |
| **Total Monthly Cost** | | **~\$6,200 / mo** (~$\$74,400$ / yr) |

---

### Tier 3: 1,000,000 Registered Users (~300,000 MAU) — Phase 3 (Multi-Region Mesh + Kafka)
| Category | Specification | Monthly Cost |
|---|---|---|
| **Multi-Region K8s + Istio** | `eu-west` + `af-south-1` clusters (40–70 nodes autoscaled) | \$9,500 |
| **Sharded PostgreSQL + ClickHouse** | 3–4 Regional Shards (Multi-AZ + Replicas) + ClickHouse Analytics | \$6,800 |
| **Kafka + Redis Geo-Cluster** | Managed Kafka (MSK/Confluent) + Distributed Redis | \$3,500 |
| **Search, CDN & Media** | OpenSearch Multi-AZ + Cloudflare Enterprise + Multi-region S3 | \$3,200 |
| **Video & Voice (WebRTC)** | Self-hosted LiveKit SFU cluster + TURN servers | \$1,200 |
| **Comms (SMS/WhatsApp)** | ~300,000 messages/mo (direct telco aggregator rates) | \$2,800 |
| **KYC, AML & Fraud** | ~15,000 verifications/mo + FingerprintJS Pro | \$8,500 |
| **Generative AI Inference** | Dedicated GPU inference cluster (vLLM) + frontier APIs | \$3,500 |
| **Observability & SecOps** | SIEM, WAF logs, APM, PagerDuty | \$2,000 |
| **Total Monthly Cost** | | **~\$41,000 / mo** (~$\$492,000$ / yr) |

---

## Unit Economics Sanity Check
- At **1M users (300K MAU)**, if just 10% (30K users) transact monthly at an average order value (AOV) of \$60 with a 12% blended take-rate (commission + escrow + featured/subscriptions):
  - **Monthly GMV**: $\$1,800,000$
  - **Monthly Net Revenue**: $\$216,000$ vs. **\$41,000** infra/SaaS cost → **~81% Gross Infrastructure Margin**.
