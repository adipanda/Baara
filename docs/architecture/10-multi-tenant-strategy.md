# 10. Multi-Tenant Strategy

## Three Dimensions of Tenancy in AFRIWORK

AFRIWORK operates a **hybrid multi-tenant model** across three dimensions:
1. **Country / Regulatory Tenants** (e.g., Senegal `SN`, Côte d'Ivoire `CI`, Nigeria `NG`, Kenya `KE`, Ghana `GH`, Morocco `MA`, South Africa `ZA`, Cameroon `CM`):
   - Drives **Currency** (`XOF`, `XAF`, `NGN`, `KES`, `GHS`, `MAD`, `ZAR`, `USD`, `EUR`), **Payment Rails** (Wave/Orange in WAEMU vs. M-Pesa/Airtel in East Africa), **Tax Rules** (VAT / Withholding Tax rates), **KYC Document Types**, and **Data Residency**.
2. **Enterprise Client Workspaces**:
   - Dedicated organization accounts with SSO (SAML/OIDC), team seats, department cost centers, approval workflows, and consolidated monthly invoicing.
3. **Agency Tenants**:
   - An Agency owner manages multiple sub-freelancers, assigns contracts internally, and configures revenue-split rules.

---

## Isolation Model & Trade-offs

| Layer | Strategy | Rationale |
|---|---|---|
| **Database** | **Shared Database, Shared Schema + `tenant_id` / `country_code` + PostgreSQL RLS** | Best balance for 10K–1M users; avoids managing 50+ separate DBs while enforcing strict isolation at the DB engine level (`SET LOCAL app.current_org_id = ...`). |
| **Phase 3 Geo-Sharding** | **Country-Group Shards** (e.g., West Africa `XOF/NGN`, East Africa `KES/TZS`, North Africa `MAD/EGP`) | Satisfies emerging African data-localization laws (Nigeria NDPR, Kenya DPA, South Africa POPIA) while keeping cross-border diaspora hiring fast. |
| **Cache (Redis)** | **Prefixed Namespaces**: `tenant:{country}:{orgId}:...` | Prevents cache key collisions and enables per-country feature flags & pricing rules. |
| **Search (Meilisearch)** | **Tenant-Filtered Index + Country Boost** | Local service providers are strictly filtered by `country_code` + geo-radius; digital freelancers can opt into global/cross-border visibility. |
| **Object Storage (S3)** | **Bucket Prefixing + Signed URLs**: `s3://afriwork-media/{country}/{org_or_user_id}/...` | Clean lifecycle policies and regional bucket replication in Phase 2/3. |
