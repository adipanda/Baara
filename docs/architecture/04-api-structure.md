# 4. API Structure

## API Style & Gateway Strategy
- **Public & Mobile/PWA Clients**: RESTful JSON over HTTPS (`/api/v1/...`) with OpenAPI 3.1 auto-generated TypeScript SDKs for the Next.js frontend.
- **Real-Time**: Socket.IO (WebSockets with HTTP long-polling fallback for restrictive mobile networks) for chat, typing indicators, live dispatch tracking, and WebRTC signaling.
- **Internal Service-to-Service (Phase 2/3)**: gRPC with Protocol Buffers for low-latency internal calls (`Contracts <-> Payment`, `Gateway <-> Identity`).
- **Trade-off (REST + OpenAPI vs. GraphQL)**: REST with HTTP caching (`ETag`, `Cache-Control`) is far easier to cache at Cloudflare Edge for African mobile users and avoids GraphQL N+1 / query-complexity attack surfaces.

---

## Resource Endpoints (`/api/v1`)

| Domain | Key Endpoints | Notes |
|---|---|---|
| **Auth & KYC** | `POST /auth/register`, `POST /auth/login`, `POST /auth/otp/verify`, `POST /auth/mfa/totp`, `POST /kyc/submissions`, `GET /kyc/status` | Short-lived JWT (15m) + rotating HttpOnly Refresh Token (30d) |
| **Profiles & Search** | `GET /providers/search?q=&category=&lat=&lng=&radius_km=&currency=`, `GET /providers/:id`, `PATCH /providers/me`, `POST /providers/me/portfolio` | Backed by Meilisearch + PostGIS |
| **Gigs (Fiverr/ComeUp)** | `GET /gigs`, `POST /gigs`, `GET /gigs/:slug`, `POST /gigs/:id/orders` | Supports tiered packages & add-ons |
| **Jobs & Proposals (Upwork/Malt)** | `POST /jobs`, `GET /jobs`, `POST /jobs/:id/proposals`, `POST /proposals/:id/accept` | Cursor-based pagination |
| **Local Bookings (TaskRabbit)** | `GET /local/availability`, `POST /bookings`, `POST /bookings/:id/checkin`, `POST /bookings/:id/complete` | Check-in/complete requires 6-digit OTP or QR scan |
| **Contracts & Disputes** | `GET /contracts/:id`, `POST /contracts/:id/milestones/:mId/approve`, `POST /contracts/:id/disputes` | State-machine validated transitions |
| **Payments & Wallets** | `POST /payments/intents`, `POST /wallets/withdraw`, `GET /wallets/ledger`, `GET /invoices/:id/pdf` | Requires `Idempotency-Key` header |
| **Payment Webhooks** | `POST /webhooks/payments/orange-money`, `/wave`, `/moov`, `/mtn-momo`, `/airtel`, `/saspay`, `/stripe` | HMAC signature + IP allowlist + async queue |
| **Generative AI** | `POST /ai/jobs/generate`, `POST /ai/proposals/draft`, `POST /ai/contracts/draft`, `POST /ai/match`, `POST /ai/support/chat` | Streaming SSE for text generation |
| **Admin & Audit** | `GET /admin/disputes`, `POST /admin/users/:id/suspend`, `GET /audit/ledger-export` | Strict RBAC + MFA required |

---

## Standard Request / Response & Error Contract

### Idempotency (Mandatory for Mutations & Payments)
Clients send `Idempotency-Key: <uuid-v4>`. The server stores `(idempotency_key, user_id, request_hash, response_body, status_code)` in Redis (24h) + PostgreSQL (`ledger_transactions`) to prevent double charges on flaky 3G retries.

### RFC 7807 Problem Details Error Format
```json
{
  "type": "https://api.afriwork.com/errors/insufficient-escrow",
  "title": "Insufficient Wallet Balance",
  "status": 422,
  "detail": "Escrow funding requires 50000 XOF; available balance is 35000 XOF.",
  "instance": "/api/v1/contracts/cnt_01J9X/fund",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

### Rate Limiting Tiers (Cloudflare + Redis Sliding Window)
- **Anonymous / Search**: 60 req/min per IP
- **Authenticated Standard**: 300 req/min per User
- **AI Endpoints**: 20 req/min per User (token-budgeted by subscription tier)
- **Auth / OTP Endpoints**: 5 req/min per IP + phone/email (anti-brute-force)
