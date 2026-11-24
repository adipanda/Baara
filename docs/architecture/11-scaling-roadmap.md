# 11. Scaling Roadmap

## Quantitative Triggers & Migration Playbook

| Metric / Trigger | Phase 1 → Phase 2 Migration | Phase 2 → Phase 3 Migration |
|---|---|---|
| **Total Registered Users** | > 50,000 (or > 5,000 DAU) | > 1,000,000 (or > 150,000 DAU) |
| **Peak API RPS** | Sustained > 500 RPS | Sustained > 10,000 RPS |
| **PostgreSQL CPU / Connections** | > 70% CPU or > 80% max connections | Single primary write saturation (> 5,000 TPS) |
| **Concurrent WebSockets** | > 10,000 concurrent sockets | > 200,000 concurrent sockets |
| **Geographic Footprint** | Expanding from 1–2 launch countries to 5+ | Pan-African (15+ countries) + Global Diaspora |

---

## Step-by-Step Transition Playbooks

### Phase 1 → Phase 2 (Hostinger VPS → Managed Kubernetes)
1. **Database First**: Enable logical replication / `pg_dump` cutover to Managed PostgreSQL (Multi-AZ + Read Replica) with PgBouncer connection pooling.
2. **Extract Stateful Bottlenecks**: Move BullMQ → RabbitMQ Cluster; single Redis → Redis Cluster; local/single Meilisearch → HA Meilisearch/OpenSearch.
3. **Lift Containers to K8s**: Deploy `core-monolith`, `payment-service`, `comms-service` (extracted for WebSockets), and `ai-service` as Helm charts with HPA.
4. **DNS Cutover**: Lower Cloudflare DNS TTL to 60s, switch origin from Hostinger VPS IP to Cloud Load Balancer. Zero downtime.

### Phase 2 → Phase 3 (Single-Region K8s → Multi-Region Mesh + Kafka + Sharding)
1. **Introduce Kafka + Outbox CDC (Debezium)**: Mirror domain events to Kafka alongside RabbitMQ, then migrate consumers service-by-service.
2. **Adopt CQRS**: Build dedicated read-model consumers (OpenSearch for discovery, ClickHouse for analytics/dashboards) to remove heavy `JOIN` queries from transactional PostgreSQL.
3. **Database Sharding**: Partition `marketplace` and `local_services` tables by `country_region_shard` (Citus or application-level shard router).
4. **Service Mesh (Istio)**: Enable automatic mTLS, distributed tracing, circuit breaking, and canary traffic splitting across `eu-west` and `af-south-1`.
