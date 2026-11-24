# 13. Risks and Mitigation

| Risk Category | Specific Risk | Severity | Concrete Mitigation |
|---|---|---|---|
| **Payments & Mobile Money** | Mobile Money API downtime, delayed callbacks, or duplicate webhooks (Orange/MTN/Wave/Moov) | **Critical** | Strict `Idempotency-Key`, async webhook queue with exponential backoff, scheduled **reconciliation cron** querying provider status APIs every 5 mins for `PENDING` intents. |
| **Platform Circumvention** | Clients and local/digital providers exchange phone numbers in chat to bypass commission | **High** | AI/Regex PII redaction in pre-escrow chat, loyalty incentives (escrow protection, verified badges, insurance/warranty, credit-building) that make on-platform payment more valuable than the fee. |
| **Fraud & Collusion** | Fake accounts, stolen cards (chargebacks), self-dealing to farm referral bonuses | **High** | Device fingerprinting, velocity limits, delayed payout holding window (24–72h for new accounts), AI anomaly detection, tiered KYC before withdrawal. |
| **Local Service Safety & Liability** | Physical injury, property damage, or no-show during on-site local services (electrician, cleaner, courier) | **High** |Mandatory `TIER_1` ID + liveness check for all local providers, OTP/QR on-site check-in/out, emergency SOS button in PWA, partner micro-insurance per booking. |
| **Regulatory & Cross-Border FX** | Central bank licensing (BCEAO/BEAC/CBN/CBK) for holding escrow funds; FX volatility | **Critical** | Partner with licensed Payment Service Providers (PSPs) / EMI custodians for actual fund custody (AFRIWORK runs the ledger, PSP holds regulated float); price/settle in local currency where possible. |
| **Low Connectivity / UX** | High bounce rates on 3G networks or low-end Android devices | **Medium** | Next.js PWA with aggressive code-splitting, <150KB initial JS budget, offline draft saving, WhatsApp/SMS fallback notifications. |
