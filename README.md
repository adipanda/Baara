# AFRIWORK (Project Baara)

> **Production-Grade Pan-African Freelance & Local Service Marketplace Architecture**

**Baara** (working product name: **AFRIWORK**) is a unified, dual-sided marketplace platform combining the strengths of **Upwork, Fiverr, TaskRabbit, Malt, and ComeUp**, engineered from the ground up for African digital talent, local service providers, SMEs, and enterprise clients.

---

## Platform Scope

### Dual Supply Verticals
1. **Digital Freelancers**: Software Developers, AI Engineers, Data Analysts, UI/UX & Graphic/Motion Designers, Video Editors, Content Writers, Translators, SEO Experts, Digital Marketers, Community Managers, Virtual Assistants, Accountants, Legal Consultants.
2. **Local Service Providers**: Electricians, Plumbers, Solar & Electronic Repair Technicians, AC Technicians, Car & Motorbike Mechanics, Welders, Carpenters, Masons, Painters, House Cleaners, Security Guards, Tailors, Hairdressers, Makeup Artists, Photographers/Videographers, Event Organizers, Caterers, Delivery Drivers, Motorcycle Couriers, Home Nurses, Tutors, Agriculture & Livestock Specialists.

### Marketplace Modes
- **Gig Catalog** (Fiverr / ComeUp style): Fixed-price packaged services with tiers and add-ons.
- **Job & Proposal Bidding** (Upwork / Malt style): Custom scopes, hourly or milestone contracts, enterprise RFPs.
- **On-Demand & Scheduled Local Dispatch** (TaskRabbit style): Geolocation search, real-time availability, booking windows, and on-site completion verification.

### African-First Payment & Trust Fabric
- **Native Payment Rails**: Orange Money, Wave, Moov Money, MTN Mobile Money, Airtel Money, SasPay, Stripe, Visa, Mastercard.
- **Financial Engine**: Double-entry ledger, automated escrow, split payments, delayed release, milestone payouts, automatic commission & tax deduction, refunds/chargebacks, and multi-currency withdrawal wallets.
- **Generative AI Suite**: AI Job Description, Proposal, and Contract Generators; AI Talent Matching; Category Classification; Fraud Detection & Trust Scoring; Resume/Portfolio Analysis; Pricing Recommendations; Multilingual AI Support.

---

## Architecture Deliverables Index

| # | Deliverable | Document |
|---|---|---|
| 1 | System Architecture Diagram (Phase 1, 2, 3) | [01-system-architecture.md](docs/architecture/01-system-architecture.md) |
| 2 | Database Architecture (PostgreSQL + PostGIS + Ledger + Sharding) | [02-database-architecture.md](docs/architecture/02-database-architecture.md) |
| 3 | Microservices Architecture (Modular Monolith → Services → Mesh) | [03-microservices-architecture.md](docs/architecture/03-microservices-architecture.md) |
| 4 | API Structure (REST, WebSockets, WebRTC, Payment Webhooks) | [04-api-structure.md](docs/architecture/04-api-structure.md) |
| 5 | Domain-Driven Design (Bounded Contexts, Aggregates, Events) | [05-domain-driven-design.md](docs/architecture/05-domain-driven-design.md) |
| 6 | Event Architecture (Outbox, Redis Streams → RabbitMQ → Kafka) | [06-event-architecture.md](docs/architecture/06-event-architecture.md) |
| 7 | Infrastructure Architecture (Hostinger VPS → K8s → Multi-Region) | [07-infrastructure-architecture.md](docs/architecture/07-infrastructure-architecture.md) |
| 8 | CI/CD Architecture (GitHub Actions, Security Gates, ArgoCD) | [08-cicd-architecture.md](docs/architecture/08-cicd-architecture.md) |
| 9 | Security Architecture (OWASP, RBAC, KYC/AML, Encryption, DR) | [09-security-architecture.md](docs/architecture/09-security-architecture.md) |
| 10 | Multi-Tenant Strategy (Countries, Currencies, Enterprises, Agencies) | [10-multi-tenant-strategy.md](docs/architecture/10-multi-tenant-strategy.md) |
| 11 | Scaling Roadmap (0–50K → 50K–1M → 1M+ Users) | [11-scaling-roadmap.md](docs/architecture/11-scaling-roadmap.md) |
| 12 | Cost Estimation (10K, 100K, 1M Users + Unit Economics) | [12-cost-estimation.md](docs/architecture/12-cost-estimation.md) |
| 13 | Risks and Mitigation (Fraud, Mobile Money, Safety, Compliance) | [13-risks-and-mitigation.md](docs/architecture/13-risks-and-mitigation.md) |
| 14 | Recommended Tech Stack & Trade-offs | [14-tech-stack.md](docs/architecture/14-tech-stack.md) |
| 15–17 | Product Roadmaps (MVP, Version 2, Version 3) | [15-product-roadmap.md](docs/architecture/15-product-roadmap.md) |

---

## Starter Infrastructure Blueprint
- **Phase 1 Hostinger VPS Stack**: [infra/phase1-vps/docker-compose.yml](infra/phase1-vps/docker-compose.yml) and [infra/phase1-vps/.env.example](infra/phase1-vps/.env.example)

---

## Architectural Philosophy
1. **Pragmatic Evolution**: Start with a **Modular Monolith (NestJS)** + **Dedicated Payment Microservice** on a single Hostinger VPS to maximize velocity and minimize operational overhead at 0–50K users, while enforcing strict DDD module boundaries so services can be extracted cleanly in Phase 2 and Phase 3.
2. **Financial Correctness First**: Payments, escrow, and mobile money webhooks live in an isolated, idempotent, double-entry ledger service from Day 1.
3. **Low-Bandwidth & Mobile-First**: PWA with offline-first queuing, compressed media, Edge CDN caching, and asynchronous voice notes—built for variable 3G/4G networks across African cities and secondary towns.
