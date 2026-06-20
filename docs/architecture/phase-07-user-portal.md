# UroSense User Portal Architecture
*Version 1.0.0 — Series A Consumer Platform Specification*

## Executive Summary
This document defines the complete UI Architecture, Layouts, Navigation, Data Requirements, and User Retention Strategies for the **UroSense User Portal**. 

Drawing design inspiration from Apple Health, Oura, WHOOP, Headspace, and the Stripe Customer Portal, the User Portal is designed for mobile-first web environments. It is accessed by citizens scanning a secure QR code on a public UroSense hardware node, verifying their identity via a mobile number (OTP), and viewing their personal biomonitoring results, longitudinal health trends, and AI-driven preventive suggestions.

---

# User Portal Architecture

## 1. Portal Purpose
The User Portal gives users access to their personal diagnostic results. It translates complex physiological telemetry (pH, specific gravity, protein levels, and ketones) into simple, actionable hydration and wellness indices. It helps users track their wellness trends over time while maintaining privacy and data security.

---

## 2. User Personas
- **Sarah Jenkins (Active Urban Professional)**: Uses UroSense at her corporate office to track hydration levels and physical stress indicators, syncing the data with her WHOOP dashboard.
- **Marcus Vance (Pre-Diabetic Patient)**: Uses UroSense in public transit hubs to monitor metabolic trends, exporting monthly reports to share with his primary care physician.
- **Dr. Clara Oswald (Primary Care Physician)**: Receives UroSense PDF reports from patients, relying on the QR-code cryptographic signature to verify the validity of the lab metrics.

---

## 3. Information Architecture
The User Portal is organized into four main sections:
1. **Daily Analytics (Personal Dashboard)**: Real-time hydration scores, wellness indices, and today's biometric summary.
2. **Historical Log (Health Reports)**: Access to all past urinalysis records with search and filter options.
3. **Longitudinal Trends (Trend Analytics)**: Graphs displaying changes in metrics over 7, 30, and 90 days.
4. **Behavioral Action (AI Insights Center)**: Personalized lifestyle, dietary, and clinical suggestions based on current trends.

---

## 4. Navigation Architecture
- **Mobile Navigation Bar**: A fixed bottom tab bar featuring four primary icons (Dashboard, Reports, Trends, Insights). Icons use a 24x24px touch target, shifting to a solid brand-cyan color when active.
- **Header Action Bar**: A sticky top navigation bar featuring the global profile selector (left) and the Alert Bell (right).
- **Sub-Page Navigation**: Inner pages use slide-in sheets and swipe-to-dismiss gestures (inspired by Apple Health) to prevent navigation nesting.

---

## 5. Mobile-First Strategy
- **PWA (Progressive Web App) Framework**: The portal is built as a PWA, allowing installation on iOS and Android home screens, supporting offline access to cached reports, and sending notifications via Web Push APIs.
- **Touch Interaction Design**: Bottom-sheets slide up for filters, data entry, and PDF exports to keep key controls within thumb reach. 
- **Gestures**: Supports pull-to-refresh to sync new reports, and swipe gestures to toggle between historical records.

---

## 6. Accessibility Strategy
- **Contrast Compliance**: Employs a dark mode background (`#090d16`) with high-contrast emerald green, amber, and red color bands. Text layers maintain a minimum contrast ratio of 4.5:1.
- **Screen Reader Support**: All visual charts use SVG elements with matching `aria-label` tags (e.g., `aria-label="Hydration chart shows steady improvement over 7 days"`).
- **Focus Rings**: Interactive elements render a 3px glowing brand-cyan ring when selected via keyboard tab navigation.

---

# Page Specifications

## Page 1: Personal Dashboard

### Purpose
Displays a quick summary of the user's daily health metrics, wellness scores, and active insights.

### Components
- **Wellness Score Ring**: A central circular gauge showing the user's overall health score (0–100), color-coded by performance level.
- **Hydration Score Card**: An area card displaying hydration metrics (Optimal, Normal, Dehydrated) with a recovery indicator.
- **Recent Reports Preview**: A card listing the last 3 test results, displaying date, location type, and status flags.
- **Key Insights Carousel**: A swipeable deck of cards showing AI-driven suggestions.

### Layout
A single-column vertical stack optimized for mobile screens. The Wellness Score Ring is centered at the top, followed by the Hydration Card, the Insights Carousel, and the Recent Reports List.

```
+-----------------------------------+
|  [Profile Icon]     [Notification]|
+-----------------------------------+
|          (  Score 84  )           |
|         Overall Wellness          |
+-----------------------------------+
|  Hydration Status: Optimal (92%)  |
+-----------------------------------+
|  Insights Carousel (Swipe < >)    |
+-----------------------------------+
|  Recent Reports (List)            |
+-----------------------------------+
```

### Data Requirements
- Endpoint: `/api/v1/user/dashboard`
- Payload: User profile info, today's average wellness metrics, hydration state, list of recent reports, and top 3 insights.

### User Interactions
- Tap the Wellness Score Ring to open the health score breakdown drawer.
- Swipe left/right on the Insights Carousel.
- Tap a report row to open the Smart Report Viewer page.

### Empty States
Displays a gray outline ring with the message: "Scan a QR code on any UroSense Public Node to initiate your first screening."

### Loading States
A full-screen skeleton loader shimmers over the circular gauge, info cards, and list rows.

### Error States
Displays a connection error card with a retry button: "Failed to load dashboard data. [Try Again]"

---

## Page 2: Health Reports

### Purpose
Allows users to browse, search, and filter their historical urinalysis reports.

### Components
- **Search Bar**: A sticky input field supporting searches by location, month, or health state.
- **Filter Chips**: Horizontal scrolling selector tags (`All`, `Optimal`, `Caution`, `Critical`, `Past 30 Days`).
- **Reports List**: A chronological list of test cards showing date, location, pH, specific gravity, and warning flags.

### Layout
A sticky top search-and-filter panel with a scrollable list view below.

### Data Requirements
- Endpoint: `/api/v1/user/reports`
- Query Params: `query`, `filter_status`, `page`, `limit`.
- Payload: Paginated list of historical reports.

### User Interactions
- Typing in the Search Bar filters list results in real time.
- Tapping filter chips updates query parameters.
- Swiping left on a report row reveals quick options to export or share.

### Empty States
Displays a document icon with the message: "No health reports found matching your search filters."

### Loading States
Renders 5 shimmering placeholder cards in the reports list.

### Error States
Displays an error message at the center of the list view: "Error loading historical reports. [Refresh List]"

---

## Page 3: Trend Analytics

### Purpose
Visualizes long-term changes in hydration, pH, and metabolic markers to track personal health progress.

### Components
- **Timeframe Selector**: Segmented controls to toggle the chart view (`7D`, `30D`, `90D`).
- **Hydration Trend Chart**: A Recharts-based area chart showing hydration index changes over time.
- **Biomarker Matrix**: Sparkline graphs tracking pH, Specific Gravity, and Turbidity trends.
- **Comparative Baseline**: A horizontal dotted line showing the user's personal baseline compared to the regional population average.

### Layout
A vertical layout featuring the Timeframe Selector at the top, followed by the Hydration Trend Chart, and the Biomarker Matrix grid.

### Data Requirements
- Endpoint: `/api/v1/user/trends`
- Query Params: `timeframe` (7d, 30d, 90d).
- Payload: Time-series arrays of health indices and baseline metrics.

### User Interactions
- Tapping timeframe tabs updates chart data.
- Dragging a finger across the chart displays details for specific dates in a tooltip.
- Tapping a sparkline card opens an expanded view of that biomarker's history.

### Empty States
Displays a trendline graphic with the message: "We need at least three separate screenings to begin calculating health trends."

### Loading States
Displays empty chart grids with shimmering grid lines.

### Error States
Displays: "Trend generation failed. Please check your network connection."

---

## Page 4: AI Insights Center

### Purpose
Delivers personalized dietary, lifestyle, and preventive health suggestions based on the user's biometric trends.

### Components
- **Daily Recommendations**: Cards showing actionable health suggestions (e.g., fluid intake targets, nutritional tips).
- **Risk Alerts**: High-contrast notification banners flagging anomalous health trends (e.g., persistent acidic pH levels).
- **Interactive Coaching**: Chat-based modules that answer questions about biomarkers and suggest healthy habits.

### Layout
A card-based vertical layout featuring Risk Alerts at the top, followed by Daily Recommendations, and the Interactive Coaching panel.

### Data Requirements
- Endpoint: `/api/v1/user/insights`
- Payload: Active alerts list, daily recommendation items, and chatbot session tokens.

### User Interactions
- Tap a recommendation card to expand scientific details and citation links.
- Tap a dismiss button to archive recommendations.
- Type questions in the coaching input box.

### Empty States
Displays: "Analyzing your health metrics. Your daily recommendations will appear here soon."

### Loading States
Shimmers placeholder text lines within the recommendation cards.

### Error States
Displays: "Unable to connect to the AI Insights service. [Reconnect]"

---

## Page 5: Smart Report Viewer

### Purpose
Displays a detailed, clinical-grade overview of a single urinalysis report, supporting PDF exports and secure sharing.

### Components
- **Report Header**: Displays the date, time, and a secure QR code verification stamp.
- **Biochemical Parameter Grid**: Displays readings for 10 parameters (pH, specific gravity, protein, etc.) alongside their normal reference ranges.
- **PDF Export Button**: Renders a loading indicator during document generation.
- **Secure Share Link**: Generates a temporary, password-protected link to share with clinicians.

### Layout
A clean, document-inspired layout on an off-white background in Light Mode, or deep slate in Dark Mode, featuring clean borders and precise grids (Stripe design style).

### Data Requirements
- Endpoint: `/api/v1/user/reports/{id}`
- Payload: Full laboratory parameter logs, location metadata, and a cryptographic signature.

### User Interactions
- Tap parameters to view normal vs anomalous range charts.
- Tap the PDF Export Button to download the report.
- Tap "Share" to copy a secure link to the clipboard.

### Empty States
Displays: "Report not found or has been deleted."

### Loading States
Displays a loading spinner inside the document frame.

### Error States
Displays: "Secure validation error. Cryptographic signature verification failed."

---

## Page 6: Notification Center

### Purpose
Manages system messages, wellness alerts, and report availability notifications.

### Components
- **Message List**: Lists notifications with color-coded category tags (`Alert`, `Report`, `System`).
- **Preference Controls**: Swipes to delete or mute specific categories.

### Layout
A clean, single-column scrollable list view.

### Data Requirements
- Endpoint: `/api/v1/user/notifications`
- Payload: List of notifications with timestamp, category, status, and detail links.

### User Interactions
- Tap notifications to open the relevant dashboard card or report page.
- Tap "Clear All" to empty the list.

### Empty States
Displays a clean inbox icon with the message: "No notifications. You are all caught up."

### Loading States
Shimmers rows within the message list.

### Error States
Displays: "Failed to load notifications."

---

## Page 7: Account & Privacy

### Purpose
Gives users complete control over their profile data, sharing preferences, and privacy settings.

### Components
- **Profile Details**: Displays name, mobile number, and connected device settings (e.g., Apple HealthKit).
- **Consent Checklist**: Toggle switches for data collection options (e.g., "Allow anonymous data aggregation").
- **Account Actions**: Buttons to export all personal data or delete the account.

### Layout
A structured settings layout with sections separated by thin borders.

### Data Requirements
- Endpoint: `/api/v1/user/settings`
- Payload: Profile details, consent preferences, and third-party integration statuses.

### User Interactions
- Toggle consent switches (updates settings instantly).
- Tap "Delete Account" to trigger a confirmation modal.

### Empty States
Not applicable (defaults to loaded profile).

### Loading States
Displays a screen overlay with a loading indicator.

### Error States
Displays inline warnings: "Failed to update settings. Please try again."

---

# Strategic Architecture Guidelines

## KPI Strategy
The User Portal tracks key user-centric performance metrics:
- **Scan-to-View Latency**: Target duration from scanning the hardware QR code to displaying the report: $< 3$ seconds.
- **Engagement Score**: A measure of active trend views and insight expansions within 48 hours of a screening.
- **Export Conversion**: Percentage of screenings that result in a PDF download or secure share link generation.

---

## AI Recommendation Framework
The platform matches user biometric trends with personalized lifestyle recommendations using a rules-based classification engine:
1. **Rule**: If specific gravity $\ge 1.025$ (Dehydrated) AND location type is "Airport Transit":
   - *Recommendation*: "Long-haul flight hydration: Dehydration detected. Drink 500ml of mineralized water before boarding to counter low cabin humidity."
2. **Rule**: If pH $\le 5.5$ (Acidic) over a 3-test average:
   - *Recommendation*: "Metabolic balance suggestion: Elevated acidity detected. Consider reducing high-protein foods and tracking daily intake metrics."

---

## Health Scoring Framework
The overall wellness score is calculated using weighted metrics:
$$\text{Wellness Score} = (\text{Hydration Score} \times 0.4) + (\text{pH Balance Score} \times 0.3) + (\text{Metabolic Stability} \times 0.3)$$
Where:
- *Hydration Score* is derived from Specific Gravity and TDS levels.
- *pH Balance Score* measures deviations from the optimal target pH of 6.5.
- *Metabolic Stability* is based on negative readings for high-risk parameters like glucose, protein, and ketones.

---

## User Retention Strategy
- **Baseline Building**: Show progress indicators like "3-Scan Baseline Complete" to encourage users to build consistent wellness profiles.
- **Integrations**: Enable direct sharing with platforms like Apple Health, Google Fit, Oura, and WHOOP to integrate UroSense data into the user's daily health routine.
- **Clinical Utility**: Position the platform as a valuable diagnostic tool by providing clean, clinical-grade PDF reports that users can share with their doctors.

---

## Gamification Opportunities
- **Hydration Streak Tracker**: Displays streak indicators for maintaining optimal hydration scores over consecutive days.
- **Habit Badges**: Awards badges like "Hydration Pro" for completing healthy habits recommended by the AI Insights Center.
- **Anonymized Peer Comparisons**: Shows percentile rankings (e.g., "Your hydration score is in the top 15% for your city today") to encourage wellness habits without compromising privacy.

---

## Mobile Experience Guidelines
- **Touch Targets**: Standard buttons must maintain a minimum target size of `44x44px`.
- **Keyboard Optimization**: OTP entry fields must auto-focus, display numeric keyboards, and support SMS auto-fill.
- **Visual Design**: Use thin borders, glassmorphic card overlays, and subtle glowing gradients (Stripe/Apple style) to create a clean, premium interface.
