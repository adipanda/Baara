# 14. Recommended Tech Stack & Trade-offs

| Layer | Choice | Alternatives Considered | Why This Choice (Trade-offs) |
|---|---|---|---|
| **Frontend** | **Next.js 15 (App Router), TypeScript, Tailwind CSS, Serwist/Workbox PWA** | React SPA (Vite), Flutter Web | SSR/ISR gives SEO for Gig/Provider pages (critical for organic acquisition) + PWA offline support on Android without forcing a 50MB app store download on Day 1. |
| **Backend** | **NestJS (TypeScript), Fastify adapter** | Go (Gin/Fiber), Django/FastAPI | Shared TypeScript types with Next.js (`packages/shared-types`), strong DI/module system for DDD Modular Monolith → Microservices extraction. Fastify adapter gives ~2x throughput over Express. |
| **Primary DB** | **PostgreSQL 16 + PostGIS + `pgvector`** | MySQL, MongoDB | Unmatched ACID guarantees for double-entry ledger, PostGIS for local service radius queries, and `pgvector` for AI talent matching—all in one engine in Phase 1. |
| **ORM / Query** | **Prisma (App) + Kysely / Raw SQL (Ledger & Geo)** | TypeORM | Prisma gives rapid schema iteration; raw SQL/Kysely for complex PostGIS queries and strict `SERIALIZABLE` / row-locked ledger transactions. |
| **Search** | **Meilisearch** (Ph1–2) → **OpenSearch** (Ph3) | Elasticsearch | Meilisearch runs in <512MB RAM on a VPS with instant typo-tolerant + geo-radius search. Migrate to OpenSearch at 1M+ listings. |
| **Cache & Queue** | **Redis 7 + BullMQ** (Ph1) → **RabbitMQ** (Ph2) → **Kafka** (Ph3) | SQS, NATS | Redis + BullMQ is zero-ops in Phase 1 and handles caching, sessions, rate limiting, and queues simultaneously. |
| **Storage & CDN** | **Cloudflare R2 + Cloudflare CDN/WAF** | AWS S3 + CloudFront | R2 has **zero egress fees**, drastically reducing bandwidth bills for portfolio images/videos and voice notes across Africa. |
| **Real-Time & Video** | **Socket.IO + LiveKit (WebRTC)** | Agora, Twilio Video | Socket.IO handles 3G disconnects with automatic reconnection/long-polling; LiveKit is open-source, self-hostable at scale, and cost-effective. |
| **KYC / AML** | **Smile ID / Youverify** | Onfido, Sumsub | Purpose-built for African National IDs (NIN, BVN, CNI, Huduma Namba, Ghana Card) with high OCR accuracy. |
| **AI Stack** | **OpenAI / Anthropic + Langfuse (Observability) + `pgvector`** | Self-hosted GPUs from Day 1 | Managed LLMs avoid GPU ops in Phase 1; abstract behind an `AIOrchestrator` interface to route simple classification/translation to self-hosted Llama/Mistral in Phase 2/3. |
| **Observability** | **Prometheus, Grafana, Loki, OpenTelemetry, Sentry** | Datadog, New Relic | Self-hosted PLG stack costs \$0 in licensing in Phase 1 and scales cleanly to Grafana Cloud/Mimir in Phase 2/3 without vendor lock-in. |
