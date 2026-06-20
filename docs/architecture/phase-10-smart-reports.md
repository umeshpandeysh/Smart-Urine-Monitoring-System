# UroSense Smart Health Report & PDF Architecture
*Version 1.0.0 — Series A Clinical Document Specification*

## Executive Summary
This document defines the visual layout, generation pipelines, cryptographic verification, and security standards for **UroSense Smart Health Reports** (PDF and digital web views). 

Designed to look clinical, professional, and government-ready, these reports draw inspiration from Apple Health Reports, WHO Digital Health Records, premium preventive health assessments, and modern laboratory diagnostics. They translate multi-spectral reagent strip telemetry and physical urine parameters into structured documents that can be verified via cryptographic QR codes.

---

# Smart Health Report Architecture

## 1. Report Purpose
The UroSense Smart Health Report is the primary user-facing document. It serves to:
- Translate raw sensor data into clear, physiological health indices.
- Provide users with structured documents to share with primary care physicians.
- Provide smart cities, corporate campuses, and hospital networks with clinical-grade, verifiable health records.

---

## 2. Report Types
- **Single Screening Report**: Generated immediately after a diagnostic scan at a UroSense public node.
- **Longitudinal Trend Report**: A weekly, monthly, or quarterly report summarizing wellness scores, baseline changes, and AI-powered recommendations.
- **Enterprise Cohort Report**: An anonymized report for smart city planners, airports, or corporations to monitor health trends in large populations.

---

## 3. Report Lifecycle
```
[Scan Initiated] ---> [Data Ingestion] ---> [Scoring & AI Engine] ---> [PDF Generation & Signing] ---> [Encrypted Storage] ---> [User Retreval] ---> [Verification / Expiry]
```

---

## 4. Report Generation Workflow
1. **Trigger**: The ESP32 node uploads raw telemetry (TDS, pH, turbidity, temperature, and RGBC color values) to the server.
2. **Analysis**: The classifier matches color pads, corrects for calibration offsets, and calculates wellness metrics.
3. **Drafting**: The PDF engine pulls localized templates and compiles the document layout.
4. **Signing**: The security module signs the document hash using a private cryptographic key, generating a verification QR code.
5. **Distribution**: The final PDF is saved in secure cloud storage, and a notification link is sent to the user.

---

## 5. Report Storage Architecture
- **Storage Tier**: Reports are stored as encrypted PDF blobs in secure cloud storage buckets (e.g., AWS S3 with KMS encryption).
- **Metadata Database**: Report IDs, anonymized user hashes, dates, and verification signatures are stored in a secure time-series database.
- **Data Lifecycle**: Reports are archived after 1 year, and user accounts can configure automated self-destruct options.

---

## 6. Report Retrieval Architecture
- **Cryptographic QR Retrieval**: Scanning the QR code on a printed report queries the UroSense verification server (`https://verify.urosense.com/v1/report/{hash}`) to confirm the document's authenticity.
- **API Access**: Verified users can pull reports via the secure mobile portal.
- **Local Cache**: Deployed client applications cache recent reports locally to support offline access.

---

# Report Section Specifications

## 1. Cover Section
- **Purpose**: Establishes report identity, security verification, and administrative details.
- **Components**: Document title, Report ID (UUIDv4), cryptographic verification QR code, timestamp, location type (e.g., Transit Hub, Clinic), and an anonymized User Reference ID.
- **Data Sources**: `/api/v1/reports/{id}/metadata`
- **Visualization Strategy**: Clean, minimalist layout using Outfit bold typography. The QR code is placed in the top-right corner, aligned with a 1px geometric border.

---

## 2. Executive Summary
- **Purpose**: Provides a high-level summary of the user's health scores and urgent insights.
- **Components**: Overall Wellness Score circle, Hydration Index gauge, Clinical Risk alert boxes, and a bulleted summary of AI-generated insights.
- **Data Sources**: `/api/v1/reports/{id}/summary`
- **Visualization Strategy**: 2-column layout. The left column displays the Wellness Score (emerald green, amber, or red circular progress ring); the right displays the AI insights in structured boxes.

---

## 3. Sensor Analysis Section
- **Purpose**: Displays raw physical and chemical readings from UroSense hardware sensors.
- **Components**: Parameter table (pH, TDS/Specific Gravity, Turbidity, Temperature, Volatile Gases, Reagent Strip match results) showing measured values next to normal reference ranges.
- **Data Sources**: `/api/v1/reports/{id}/raw-sensors`
- **Visualization Strategy**: A structured grid where each parameter features a horizontal range bar. A vertical indicator line shows where the user's score falls within normal, warning, or critical zones.

---

## 4. Health Indicators Section
- **Purpose**: Translates raw sensor values into specific wellness and risk indicators.
- **Components**: Hydration Status card, UTI Risk indicator, Glucose indicator, Protein marker status, and Kidney Stress index.
- **Data Sources**: `/api/v1/reports/{id}/indicators`
- **Visualization Strategy**: Status cards featuring clear icons and Physiological Badges (e.g., a green "Optimal" badge for negative glucose, or a red "Pathological" badge for high ketones).

---

## 5. Trend Comparison Section
- **Purpose**: Displays changes in the user's health metrics compared to their historical baselines.
- **Components**: Sparkline graphs tracking pH and Specific Gravity changes over time, along with monthly average comparison tables.
- **Data Sources**: `/api/v1/reports/{id}/trends`
- **Visualization Strategy**: Clean line graphs with shaded area fills under the lines. Horizontal dotted lines indicate personal and regional population baselines.

---

## 6. AI Insights Section
- **Purpose**: Provides personalized wellness, hydration, and nutritional suggestions based on the report's metrics.
- **Components**: Daily hydration goals, dietary suggestions, and clinical recommendations (e.g., suggesting a doctor consultation if indicators point to an active infection).
- **Data Sources**: `/api/v1/reports/{id}/ai-insights`
- **Visualization Strategy**: Bulleted lists inside clean, white or slate cards, featuring high-contrast typography and clear indicator icons.

---

## 7. Verification Section
- **Purpose**: Confirms the document's authenticity and provides verification guidelines for healthcare professionals.
- **Components**: Digital signature certificate hash, validation status indicator, and instructions to scan the QR code to verify.
- **Data Sources**: `/api/v1/reports/{id}/signatures`
- **Visualization Strategy**: A security footer at the bottom of the document featuring a subtle grey background, a lock icon, and a cryptographic verification stamp.

---

# System Architecture & Compliance

## PDF Generation System
- **Templates**: Generated using server-side rendering (e.g., Puppeteer with HTML/CSS templates or a React PDF generator).
- **Branding Standards**: Fixed A4 paper size, `24px` margins, Outfit (headings) and Inter (body) typography, and a cohesive dark gray and cyan color palette.
- **Export Workflow**: The document is compiled to a PDF stream, signed, compressed, and uploaded to S3 storage buckets.
- **Versioning Strategy**: Reports include template and API version codes in their metadata (e.g., `Template: v1.0.4; Core API: v1.1.0`) to track changes in scoring algorithms.

---

## Report Retrieval System
- **QR Verification**: Scanning the verification QR code opens a secure web page showing verified laboratory parameters, confirming the document's authenticity.
- **Mobile & Portal Integration**: Verified users can view, share, or download PDFs from their portal.
- **Offline Access**: Portal applications cache recent PDF files locally, encrypted using the user's local biometric credentials.

---

## Security Architecture
- **Encryption**: PDF files are encrypted at rest using AES-256 keys, and in transit using TLS 1.3.
- **Access Controls**: Accessing a report requires authentication via OAuth 2.0. Exported public links expire automatically after 24 hours.
- **Verification Signature**: Reports are signed using an asymmetric key pair:
  $$\text{Signature} = \text{Encrypt}_{\text{Private Key}}(\text{Hash}(\text{Report Content} + \text{Salt}))$$
- **Audit Trails**: Access requests, downloads, and shares are logged in a secure, write-once audit trail database.

---

## Compliance Architecture
- **Data Retention**: By default, reports are retained for 12 months. Users can configure custom data retention and deletion policies.
- **Consent Verification**: Generating a report requires active consent from the user, verified via OAuth and logged in database consent records.
- **User Privacy**: Reports do not contain clear-text names, phone numbers, or social security details, matching HIPAA Safe Harbor requirements.

---

# Strategic Scoring & Design Frameworks

## Wellness Scoring Framework
The Wellness Score is calculated using weighted metrics:
$$\text{Wellness Score} = \sum (\text{Parameter Score}_i \times \text{Weight}_i)$$
Where:
- Specific Gravity / Hydration is weighted at $40\%$.
- pH balance is weighted at $30\%$.
- Chemical indicators (Proteins, Glucose, Ketones, Leukocytes) are weighted at $30\%$.

---

## Risk Scoring Framework
The Risk Score identifies potential issues by evaluating biometric parameters:
$$\text{Risk Score} = \text{Base Risk} + \sum (\text{Anomalous Parameter}_i \times \text{Severity Weight}_i)$$
- **Mild Risk (Score 10-39)**: Dehydration warning or slight pH deviation. Suggests increased fluid intake.
- **Moderate Risk (Score 40-69)**: Elevated glucose or ketones detected. Suggests tracking dietary intake.
- **Severe Risk (Score 70+)**: Leukocytes, proteins, and nitrites detected, indicating potential infections or kidney stress. Recommends contacting a primary care physician.

---

## PDF Design Standards
- **Grid Layout**: Built on a strict 2-column or 3-column A4 grid system.
- **Colors**:
  - Primary text: Off-black (`#111827`) in Light Mode, Off-white (`#F9FAFB`) in Dark Mode.
  - Borders: Thin, light gray lines (`#E5E7EB`).
  - Brand accents: Deep cyan (`#0EA5E9`).
- **Page Breaks**: Implements CSS `page-break-inside: avoid` rules to prevent charts and data grids from splitting across pages.

---

## Accessibility Standards
- **PDF/UA Compliance**: Exported documents include structural tags to support screen readers.
- **Alt Text**: Charts and maps include alt text summaries.
- **Contrast**: Text elements maintain contrast ratios of at least 4.5:1.

---

## Mobile Report Viewing Strategy
- **Reflowable Layouts**: The digital viewer reflows content dynamically into a single scroll column on mobile, while the raw A4 PDF remains available via a download button.
- **Quick Previews**: Bottom-sheet modules display brief parameter explanations to help users understand complex medical terms quickly.
- **Biometric Locks**: Accessing reports on mobile devices requires verification via FaceID or TouchID.
