# 1. System Architecture

## Architectural Principles for African Markets
1. **Low-Bandwidth Resilience**: Next.js PWA with Workbox offline caching, WebP/AVIF adaptive media, and lightweight JSON payloads for 3G/4G mobile networks.
2. **Financial Isolation from Day 1**: Even in Phase 1, the **Payment & Escrow Service** runs as a separate process/container with its own database schema and strict idempotency guarantees.
3. **Evolutionary Topology**: Avoid premature distributed-systems tax at 0–50K users while keeping strict interface boundaries (REST/gRPC + Outbox events) for seamless extraction at 50K+ and 1M+ users.

---

## Phase 1: Launch & Growth (0 – 50,000 Users)
**Topology**: Single-node or dual-node Hostinger VPS running Docker Compose behind Caddy/Traefik TLS reverse proxy, fronted by Cloudflare CDN/WAF.

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        Web["Next.js 15 PWA (Desktop & Mobile)"]
        Admin["Admin / Ops Console"]
    end

    subgraph Edge["Edge & Security"]
        CF["Cloudflare CDN + WAF + DDoS"]
        Caddy["Caddy Reverse Proxy (Auto-TLS)"]
    end

    subgraph VPS["Hostinger VPS (Docker Compose)"]
        API["NestJS Modular Monolith\n(Auth, Profiles, Gigs, Jobs,\nLocal Geo, Chat, AI Orchestrator)"]
        PaySvc["Payment & Escrow Service\n(NestJS Dedicated Container)"]
        Worker["Background Workers\n(BullMQ: Notifications, AI, KYC, Webhooks)"]

        PG[("PostgreSQL 16 + PostGIS\n(Logical Schemas: core, ledger, audit)")]
        Redis[("Redis 7\n(Cache, Sessions, BullMQ, Pub/Sub)")]
        Meili[("Meilisearch\n(Full-Text + Geo-Radius Search)")]
        Prom["Prometheus + Grafana + Loki"]
    end

    subgraph External["External Providers"]
        S3["S3-Compatible Object Storage\n(Cloudflare R2 / Scaleway / Wasabi)"]
        MoMo["Mobile Money Aggregators\n(Orange, Wave, Moov, MTN, Airtel, SasPay)"]
        Cards["Stripe / Visa / Mastercard"]
        LLM["AI Providers (OpenAI / Anthropic / Llama)"]
        KYC["KYC / AML Provider (Smile ID / Youverify)"]
    end

    Web --> CF
    Admin --> CF
    CF --> Caddy
    Caddy --> API
    Caddy --> PaySvc

    API --> PG
    API --> Redis
    API --> Meili
    API --> S3
    API --> LLM
    API --> KYC
    API --> Worker

    PaySvc --> PG
    PaySvc --> Redis
    PaySvc --> MoMo
    PaySvc --> Cards

    Worker --> PG
    Worker --> Redis
    Worker --> Meili
    Prom --> API
    Prom --> PaySvc
```

### Phase 1 Trade-offs
- **Modular Monolith vs. Full Microservices**: Eliminates network hops, distributed tracing complexity, and DevOps overhead while a small team ships MVP features. *Trade-off*: Single deployment unit for core domain; mitigated by strict NestJS module boundaries and separate Payment container.
- **Meilisearch vs. Elasticsearch**: Meilisearch uses ~10x less RAM than Elasticsearch on a VPS while delivering sub-50ms typo-tolerant and geo-filtered search.

---

## Phase 2: Scale-Up (50,000 – 1,000,000 Users)
**Topology**: Managed Kubernetes (EKS / GKE / AKS in `eu-west` + `af-south-1` Cape Town) with Horizontal Pod Autoscaling (HPA), RabbitMQ event bus, managed PostgreSQL with read replicas, and Redis Cluster.

```mermaid
flowchart TB
    Users["Users across Africa & Diaspora"] --> CF["Cloudflare Global Edge\n(WAF, R2 Media CDN, Rate Limiting)"]
    CF --> LB["Cloud Load Balancer + Ingress Controller"]

    subgraph K8s["Kubernetes Cluster (HPA)"]
        GW["API Gateway / BFF"]
        CoreSvc["Core Marketplace Service"]
        IdentitySvc["Identity & KYC Service"]
        PaySvc["Payment & Escrow Service"]
        GeoSvc["Local Dispatch & Geo Service"]
        CommsSvc["Real-Time Messaging & WebRTC"]
        AISvc["AI & Matching Service"]
    end

    subgraph Messaging["Event Bus"]
        RMQ["RabbitMQ Cluster\n(Topic Exchanges + DLQ)"]
    end

    subgraph Data["Managed Data Layer"]
        PGPrimary[("PostgreSQL Primary\n(Multi-AZ)")]
        PGReplica[("PostgreSQL Read Replicas")]
        RedisCluster[("Redis Cluster\n(Distributed Cache + Socket.IO Adapter)")]
        Search["Meilisearch Cluster / OpenSearch"]
        MultiS3["Multi-Region S3 + CloudFront/R2"]
    end

    LB --> GW
    GW --> CoreSvc & IdentitySvc & PaySvc & GeoSvc & CommsSvc & AISvc
    CoreSvc & IdentitySvc & PaySvc & GeoSvc & CommsSvc & AISvc --> RMQ
    CoreSvc & IdentitySvc & PaySvc --> PGPrimary
    CoreSvc & GeoSvc --> PGReplica
    GW & CommsSvc & AISvc --> RedisCluster
    CoreSvc & GeoSvc --> Search
    AISvc & CommsSvc --> MultiS3
```

---

## Phase 3: Pan-African Hyperscale (1,000,000+ Users)
**Topology**: Multi-region active-active deployment (`af-south-1`, `eu-west-1`, `eu-south-1` / local edge PoPs), Istio Service Mesh (mTLS, circuit breaking, canary routing), Apache Kafka event streaming, and CQRS with sharded PostgreSQL.

```mermaid
flowchart LR
    subgraph Edge["Global Edge"]
        Anycast["GeoDNS + Cloudflare Anycast"]
    end

    subgraph Mesh["Service Mesh (Istio mTLS)"]
        WriteAPI["Command Services\n(Orders, Escrow, Bookings)"]
        ReadAPI["Query Services (CQRS)\n(Feeds, Search, Analytics)"]
        FraudAI["Real-Time Fraud & Trust Engine"]
    end

    subgraph Streaming["Event Streaming"]
        Kafka["Apache Kafka + Schema Registry"]
        Flink["Stream Processing (Fraud, SLA, Metrics)"]
    end

    subgraph Storage["Sharded & Replicated Storage"]
        Shards[("Sharded PostgreSQL\n(Citus / Vitess-style by Country/Tenant)")]
        ReadStore[("Read Projections\n(OpenSearch + ClickHouse Analytics)")]
        RedisGeo[("Geo-Distributed Redis")]
    end

    Anycast --> WriteAPI & ReadAPI
    WriteAPI --> Shards
    WriteAPI --> Kafka
    Kafka --> Flink
    Flink --> FraudAI
    Kafka --> ReadStore
    ReadAPI --> ReadStore & RedisGeo
```
