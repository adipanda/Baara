# 15–17. Product Roadmaps (MVP, Version 2, Version 3)

## 15. MVP Roadmap (Months 1–4 | Phase 1: 0–50K Users)
**Target Launch**: 2 anchor markets (e.g., **Senegal `SN` / Côte d'Ivoire `CI`** for WAEMU `XOF` + **Nigeria `NG`** or **Kenya `KE`**), French + English.

### Core Scope
- **User Types**: Client, Digital Freelancer, Local Service Provider, Platform Admin, Moderator.
- **Marketplace Modes**:
  - Gig Catalog (Fiverr/ComeUp style with 3 packages).
  - Job Posting & Proposals (Upwork style).
  - Local Service Search & Booking (TaskRabbit style with PostGIS radius + OTP check-in).
- **Payments & Escrow**:
  - 1–2 Mobile Money aggregators (covering Wave, Orange Money, MTN MoMo, Moov) + Stripe/Cards for diaspora clients.
  - Double-entry Escrow, automatic commission deduction, withdrawal wallet, PDF invoices.
- **Trust & Comms**:
  - `TIER_0` & `TIER_1` KYC (Smile ID/Youverify), 2-way ratings/reviews, 1:1 Chat + File Sharing + Voice Notes (critical for local artisans).
- **AI MVP**:
  - AI Job Description Generator, AI Proposal Assistant, AI Category Classification, basic Pre-Escrow PII/Circumvention Guard.
- **KPIs**: Time-to-first-proposal < 2h, Escrow completion rate > 85%, Mobile Money webhook success > 99.5%.

---

## 16. Version 2 Roadmap (Months 5–12 | Phase 2: 50K–1M Users)
**Target Expansion**: 6–8 African countries (`XOF`, `XAF`, `NGN`, `KES`, `GHS`, `MAD`) + Diaspora.

### Core Scope
- **New User Types**: **Agency** (team management & revenue splits), **Enterprise Client** (SSO, multi-seat approvals, consolidated billing), **Financial Auditor** (read-only ledger & tax export portal).
- **Marketplace & Monetization**:
  - Featured Profiles, Sponsored Listings (CPC/CPM auction), Premium Subscriptions (lower commission + higher AI quota).
  - Multi-milestone contracts, Split Payments, Automated Withholding Tax / VAT engine per country.
  - Native WebRTC Video Calls (LiveKit) + Calendar Scheduling sync.
- **Growth & Engagement**:
  - Referral System & Affiliate Program with fraud-ring protection.
  - Multilingual UI (FR, EN, AR, PT, SW).
- **AI V2**:
  - AI Contract Generator, AI Talent Matching (`pgvector` semantic + trust score), AI Resume & Portfolio Analysis, AI Pricing Recommendations, AI Fraud & Trust Scoring v2.

---

## 17. Version 3 Roadmap (Months 13–24+ | Phase 3: 1M+ Users)
**Target Expansion**: Pan-African (15+ countries) + Global Enterprise Outsourcing & Recruitment.

### Core Scope
- **Enterprise & Recruitment**:
  - **AFRIWORK Talent Cloud / Recruitment-as-a-Service**: Vetted top-3% African engineering/design/AI cohorts, EOR (Employer of Record) & payroll compliance integration.
- **Financial Ecosystem**:
  - Instant payouts, micro-credit / invoice factoring for high-Trust-Score freelancers & artisans, embedded micro-insurance for local service bookings.
- **Platform & Channels**:
  - Dedicated Native Mobile Apps (React Native / Flutter) sharing the same REST/WebSocket APIs alongside the PWA.
  - WhatsApp Business Bot for local artisans to accept bookings and check wallet balances without opening the app.
- **AI V3**:
  - 24/7 Multilingual AI Customer Support & Dispute Triage Agent (including African French/English/Swahili/Pidgin voice-to-text).
  - Real-time Kafka + Flink streaming fraud prevention.
