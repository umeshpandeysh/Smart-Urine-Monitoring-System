# UroSense Architecture Reconciliation Report
*Version 1.0.0 — Unified Platform Review & Architectural Alignment*

## Executive Summary
This reconciliation report provides a comprehensive review of the entire **UroSense** platform architecture, bridging the specifications from Phase 1 through Phase 13, including the Phase 3.5 Enhancements and the Final Architecture Review. 

UroSense is a multi-tenant public health infrastructure platform that analyzes physical and chemical urine parameters at scale in airports, transit networks, hospitals, and smart cities.

This report establishes a master architecture map, identifies missing specifications, highlights conflicts between design phases, flags naming and database schema inconsistencies, and evaluates remaining security, scalability, and implementation risks.

---

# 1. Master Architecture Map
This map shows the end-to-end flow of data and control across the UroSense platform, illustrating how edge hardware, event streaming pipelines, database layers, and multi-tenant applications connect.

```
+---------------------------------------------------------------------------------------------------------------+
|                                                CLIENT TIER                                                    |
|                                                                                                               |
|   +-----------------------+   +-----------------------+   +-------------------+   +-----------------------+   |
|   |   User Portal (PWA)   |   |   Public Dashboard    |   |    Admin Console  |   |   Local Ops Dashboard |   |
|   |  - Daily Wellness     |   |  - Regional Heatmaps  |   |  - Model Registry |   |  - Incident Queue     |   |
|   |  - Hydration Trends   |   |  - Anonymized Stats   |   |  - Audit Log Ledger|  |  - Cartridge Logs     |   |
|   +-----------+-----------+   +-----------+-----------+   +---------+---------+   +-----------+-----------+   |
+---------------|---------------------------|-------------------------|-------------------------|---------------+
                |                           |                         |                         |
                +---------------------------+------------+------------+-------------------------+
                                                         |
                                                         v (HTTPS / WebSockets / JSON API)
+---------------------------------------------------------------------------------------------------------------+
|                                         EDGE GATEWAY & SECURITY TIER                                          |
|                                                                                                               |
|    +-----------------------------+   +------------------------------+   +--------------------------------+    |
|    |   Cloudflare CDN WAF        |   |   Envoy API Gateway          |   |   Supabase Auth / OTP / NextAuth|    |
|    |   - DDoS Mitigation         |   |   - Rate Limiting            |   |   - Session Token Validation   |    |
|    |   - Edge SSL Termination    |   |   - Node mTLS Verification   |   |   - RBAC Claims Processing     |    |
|    +-----------------------------+   +------------------------------+   +--------------------------------+    |
+--------------------------------------------------------|------------------------------------------------------+
                                                         |
                                                         v
+---------------------------------------------------------------------------------------------------------------+
|                                      INGESTION & EVENT STREAMING TIER                                         |
|                                                                                                               |
|             +-------------------------------+   +---------------------------------------+                     |
|             |   EMQX MQTT Broker Cluster    |   |   Apache Kafka / Redpanda Cluster     |                     |
|             |   - Persistent TLS Node Links |-->|   - Partitioning by Device UUID       |                     |
|             |   - Sub-second Telemetry      |   |   - Schema Registry (Avro Validation) |                     |
|             +-------------------------------+   +-------------------|-------------------+                     |
+---------------------------------------------------------------------|-----------------------------------------+
                                                                      |
                                                                      v
+---------------------------------------------------------------------------------------------------------------+
|                                         PROCESSING & AI INFERENCE TIER                                        |
|                                                                                                               |
|             +-------------------------------+   +---------------------------------------+                     |
|             |   Triton Inference Server     |   |   Apache Flink Analytics Engine       |                     |
|             |   - Colorimetric Calibration  |   |   - Hourly/Daily Sliding Windows      |                     |
|             |   - Anomaly Detection (Forest)|   |   - Regional Health Aggregation       |                     |
|             +-------------------------------+   +-------------------|-------------------+                     |
+---------------------------------------------------------------------|-----------------------------------------+
                                                                      |
                                                                      v
+---------------------------------------------------------------------------------------------------------------+
|                                           DATA & STORAGE TIER                                                 |
|                                                                                                               |
|      +--------------------------+   +--------------------------+   +-----------------------------------+      |
|      |  PostgreSQL Database     |   |   TimescaleDB            |   |   Amazon S3 Bucket                |      |
|      |  - Transactional Schema  |   |  - Telemetry Time-Series |   |  - Signed PDF Clinical Reports    |      |
|      |  - Row Level Security    |   |  - Spatial Coordinates   |   |  - Immutable Research Datasets    |      |
|      +--------------------------+   +--------------------------+   +-----------------------------------+      |
+---------------------------------------------------------------------------------------------------------------+
                                                                      ^
                                                                      | (mTLS / MQTT over TLS)
+---------------------------------------------------------------------|-----------------------------------------+
|                                           HARDWARE & EDGE TIER                                                |
|                                                                                                               |
|             +-------------------------------+   +---------------------------------------+                     |
|             |   UroSense Public IoT Node    |   |   ESP32 Edge Processing               |                     |
|             |   - Multi-spectral Colorimeter|-->|   - TensorFlow Lite Micro Classifier  |                     |
|             |   - Fluid Flow & TDS Sensors  |   |   - Edge Buffer & mTLS Key Store      |                     |
|             +-------------------------------+   +---------------------------------------+                     |
+---------------------------------------------------------------------------------------------------------------+
```

---

# 2. Identified Inconsistencies & Gaps

### 2.1 Missing Documents
1. **Clinical EHR Mapping Blueprint (FHIR standard)**: While Phase 1 and 8 mention Epic and Redox integrations, there is no mapping document detailing how UroSense JSON outputs map to standard FHIR resources like `Observation` or `DiagnosticReport`.
2. **Technician Operations App Spec**: Phase 9 details maintenance and calibration workflows, but lacks page and component specifications for the technician's mobile application.
3. **Edge Cryptographic Provisioning Protocol**: There is no detailed protocol for provisioning private client certificates onto the ESP32 hardware secure elements at the factory.
4. **Waste and Reagent Management Protocol**: The platform lacks operational specifications for logging, tracking, and alerting on chemical cartridge replacements and environmental disposal compliance.

### 2.2 Phase-to-Phase Conflicts
- **Database Access ORM Conflict**:
  - *Phase 1, 3, and 12* rely on **Prisma ORM** (referencing `schema.prisma` and `lib/db.ts` for database operations).
  - *Phase 2, 13, and 3.5* rely on **Supabase client-side / server-side SDKs** (generating types directly from the Postgres schema and executing queries via PostgREST).
  - *Impact*: Running both Prisma client and the Supabase JavaScript SDK duplicates data access paths, increasing dependency sizes and development overhead.
- **Authentication Engine Conflict**:
  - *Phase 1 and 3* specify **NextAuth.js (Auth.js)** as the primary authentication and session provider.
  - *Phase 2, 7, and 13* use **Supabase Auth** (SMS OTP for patients, JWT token claims for RLS).
  - *Impact*: Managing two session stores (NextAuth sessions + Supabase Auth sessions) creates token verification issues and complicates authorization logic.
- **Multi-Tenancy Terms**:
  - *Phase 1* defines the primary tenant as a `Clinic`, mapping patients directly to clinics and providers.
  - *Phase 5, 8, and 9* position the system as a public health platform, mapping deployments to `Organizations` (e.g., airports, smart cities), `Locations`, `Smart Restrooms`, and `Deployment Sites`.

### 2.3 Naming Inconsistencies
- **Biomedical vs. Operational Table Names**:
  - *Phase 1* defines manual diary tables: `BladderDiaryEntry`, `IntakeDetail`, `VoidDetail`, and `LeakDetail`.
  - *Phase 2* specifies table names in snake_case (e.g., `users`, `profiles`, `devices`, `sensor_readings`, `device_telemetry`), but **completely omits** the detailed manual bladder diary tables (`bladder_diary_entry`, `intake_detail`, etc.).
  - *Phase 13* uses `telemetry` routes and auto-generated database schemas without clarifying how manual logs map to raw sensor readings.
- **File Name Discrepancies**:
  - The real-time stream engine is named `UroSense Phase 11 Real-Time Analytics Pipeline.md` in the workspace, but references in Phase 12 call it `UroSense Phase 11 Real-Time Analytics Architecture.md`.
  - The codebase setup document is named `UroSense Phase 13 Implementation Foundation.md`, but Phase 12 references refer to it as `Phase 13 Implementation Foundation.md`.

### 2.4 Database Inconsistencies
- **Primary Key Types**: Phase 1 uses String parameters for database IDs, while Phase 2 and 13 enforce cryptographically secure `UUID v4` values.
- **Biomarker Payload Structures**: Phase 3.5 defines `sensor_readings.biomarker_payload` as encrypted ciphertext (using per-user envelope encryption), while Phase 2 splits these columns into raw numeric fields (`total_volume_ml`, `peak_flow_rate`, `avg_flow_rate`).
- **Anonymization Cohorts**: Phase 6 requires a minimum cohort floor of 50 active screenings to display heatmap coordinates, while Phase 2 specifies a cohort floor of 10 in `aggregated_health_metrics.active_patients`.

---

# 3. Risk Assessment

## 3.1 Implementation Risks
- **Dual Database Layers**: Using both Prisma and Supabase clients creates double the maintenance work and can lead to synchronization errors between Prisma migrations and native Supabase triggers.
- **Edge Calibration Failures**: The accuracy of the colorimetric classification model relies on sensor calibration. If the automated cleaning systems fail, the AI model could output incorrect health metrics.

## 3.2 Security Risks
- **Physical Key Extraction**: Deployed in public restrooms, the IoT hardware nodes are vulnerable to theft. If the ESP32’s flash storage is not encrypted, attackers could extract private API keys and client certificates.
- **URL Spoofing**: Sharing reports via public verification links allows attackers to redirect users to fake verification sites and generate fraudulent health reports.

## 3.3 Scalability Risks
- **Write Saturation**: Deployed at scale across multiple smart cities, millions of raw sensor readings (sent at $200\text{ms}$ intervals) will saturate PostgreSQL write connections, even when using connection poolers like PgBouncer.
- **AI Processing Costs**: Running PyTorch/Triton servers on GPU instances is expensive. Without autoscale rules to scale down resources during off-peak night hours, the platform will incur high operational costs.

---

# 4. Reconciliation Recommendations

To align all phases and prepare the platform for development:

1. **Unify the Database Access Layer**:
   - Standardize on **Supabase Client and server-side SDKs** for client-facing and server action integrations.
   - Remove Prisma ORM to simplify the database abstraction layer.
2. **Standardize Naming Conventions**:
   - Convert all database entity definitions to `snake_case` (e.g., `bladder_diary_entries`, `intake_details`).
   - Merge the `Clinic` entity into the `organizations` and `locations` structure.
3. **Consolidate Authentication**:
   - Use **Supabase Auth** as the single source of truth for sessions and role management.
   - Inject user roles directly into JWT claims, allowing Supabase Row-Level Security (RLS) to enforce authorization boundaries.
4. **Implement Telemetry Buffering**:
   - Stream raw $200\text{ms}$ sensor readings to Kafka first. Flink should process the stream and write only aggregated summaries to Postgres, keeping database write operations to a minimum.
