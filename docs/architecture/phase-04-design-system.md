# UroSense UI Architecture & Design System
*Version 1.0.0 — Series A Preparedness Specification*

## Executive Summary
This document establishes the UI Architecture and Design System for **UroSense**, a venture-backed health-tech company pioneering real-time, non-invasive continuous urinalysis and IoT edge-biometric tracking. Engineered to satisfy the aesthetic rigor of Apple and Vercel, the functional density of Linear, the developer-grade precision of Stripe, and the biophysical readability of Oura and WHOOP, this design system bridges clinical accuracy with consumer-grade product excellence.

---

## 1. Design Philosophy
- **Biometric Integrity & Scientific Honesty**: Urinalysis outputs represent critical biological telemetry. The design system rejects arbitrary decoration in favor of structural clarity, visual accuracy, and high information density. Data representation is direct and objective, avoiding toxic anxiety-inducing cues while upholding strict clinical precision.
- **Empathetic Frictionlessness**: Recognizing the deeply personal nature of physiological monitoring, UroSense employs a supportive, clean, and clinical tone. Interactions are designed to minimize cognitive friction during device setup, daily sample collection, and longitudinal clinical reporting.
- **Hardware-Software Continuity**: Seamlessly mapping physical IoT touchpoints (LED status, optical sensor alignments, physical tray movements) to the digital UI. The user feels a tangible connection between their hardware device and their mobile/desktop dashboards.
- **Longitudinal Focus**: Prioritizing baseline trend comparisons over isolated daily readings. The design system emphasizes delta metrics (weekly, monthly, quarterly) to encourage long-term wellness tracking and early metabolic symptom detection.

---

## 2. Visual Identity
- **Logo & Symbolic Construction**: The UroSense brandmark is a precise geometry combining a stylized fluid droplet with a continuous feedback loop, symbolizing fluid dynamics and proactive health tracking. It is constructed on a golden-ratio grid, embodying precision engineering.
- **Brand Imagery Guidelines**: 
  - Photography must utilize clean, architectural layouts, natural light refraction through glass, and macro focus on sterile, high-quality medical-grade materials.
  - Visual renders of the physical UroSense IoT module should emphasize sleek satin plastics, anodized aluminum bezels, and diffuse LED indicator rings.
- **Iconography System**:
  - *Grid Base*: Built on a strict 20x20px viewport with a 2px safe zone (16x16px active area), matching the density of Linear.
  - *Geometry*: 1.5px stroke weight, rounded caps, and joins. No filled states except for status indicators.
  - *Semantic Categories*: Biometric markers (pH scale, molecular rings, droplet viscosity, crystal formations), hardware states (Bluetooth waves, Wi-Fi bars, battery levels, optical sensor calibrations), and dashboard actions.

---

## 3. Typography System
- **Typeface Selection**:
  - *Primary Display & Biometric Readouts*: **Outfit** (Google Fonts) – chosen for its clean geometric structures, readable circular letters, and friendly yet premium tech-aesthetic.
  - *Body, Tables, and Technical Copy*: **Inter** – chosen for its neutral tone, high readability at micro-sizes, and excellent numerical legibility (slashed zeros, proportional numbers).
- **Typographic Scale**:
  - *Heading 1 (Hero Metric)*: `48px` / `line-height: 56px` / `weight: 700 (Bold)` / `tracking: -0.03em`
  - *Heading 2 (Page Header)*: `32px` / `line-height: 40px` / `weight: 600 (Semi-Bold)` / `tracking: -0.02em`
  - *Heading 3 (Section Header)*: `24px` / `line-height: 32px` / `weight: 600 (Semi-Bold)` / `tracking: -0.015em`
  - *Subheading (Card Title)*: `16px` / `line-height: 24px` / `weight: 500 (Medium)` / `tracking: -0.01em`
  - *Body Text*: `14px` / `line-height: 20px` / `weight: 400 (Regular)` / `tracking: 0`
  - *Micro / Caption*: `12px` / `line-height: 16px` / `weight: 500 (Medium)` / `tracking: 0.01em`
  - *Technical Data (Monospace)*: `13px` / `line-height: 18px` / `weight: 400 (Regular)` / `tracking: 0` (JetBrains Mono / SF Mono for raw telemetry)

---

## 4. Color System
The color system matches Stripe's vibrant precision and Oura/WHOOP's recovery-based physiological representations.

- **Primary Brand Colors**:
  - **UroSense Cyan**: `HSL(192, 95%, 48%)` — An energetic, sterile, high-tech cyan reflecting liquid purity and digital innovation.
  - **UroSense Midnight**: `HSL(224, 71%, 4%)` — Deep base color for backgrounds and dark states.
- **Biometric Health State Colors**:
  - **Optimal (Normal)**: `HSL(142, 72%, 29%)` — High-recovery green, indicating stable metrics (e.g., pH 6.5, negative glucose).
  - **Caution (Borderline)**: `HSL(38, 92%, 50%)` — Hydration alert amber, indicating minor physiological deviations or mild dehydration.
  - **Pathological (Critical)**: `HSL(350, 89%, 52%)` — High-alert crimson, indicating values requiring clinical attention (e.g., high ketones, protein detection, hematuria).
- **Neutral Scale**:
  - *Light Mode*: `N50: HSL(210, 40%, 98%)`, `N100: HSL(210, 30%, 95%)`, `N400: HSL(210, 16%, 60%)`, `N900: HSL(210, 24%, 12%)`
  - *Dark Mode*: `D50: HSL(224, 25%, 12%)`, `D100: HSL(224, 22%, 18%)`, `D600: HSL(224, 12%, 60%)`, `D900: HSL(224, 71%, 4%)`
- **Contrast & Compliance**: All colored text combinations maintain a minimum contrast ratio of 4.5:1 against their background to comply with WCAG 2.1 AA. Primary buttons and active states use large fonts or bold text where HSL ratios are tighter.

---

## 5. Spacing System
Built on a strict **8-pixel geometric scale** to ensure layout consistency across all viewports (with a 4px step for micro-elements).
- `4px` (xxs) — Micro-paddings, bullet indicators, inner borders.
- `8px` (xs) — Label-to-input gap, icon-to-text spacing.
- `12px` (sm) — Button padding, small card internal spacing.
- `16px` (md) — Standard card padding, list item gutters.
- `24px` (lg) — Outer layout margins, main card gaps, form group spacing.
- `32px` (xl) — Section breaks, hero metric margins.
- `48px` (xxl) — Desktop layout gutters, header-to-content separation.
- `64px` (xxxl) — Hero visual paddings, login screen offsets.

---

## 6. Grid System
- **Desktop (1280px and above)**:
  - 12 Columns, 24px Gutter, 32px Outer Margin. Max container width: 1440px.
- **Tablet (768px to 1079px)**:
  - 8 Columns, 16px Gutter, 24px Outer Margin.
- **Mobile (Up to 767px)**:
  - 4 Columns, 16px Gutter, 16px Outer Margin.
- **Flexbox and CSS Grid Guidelines**: Layout components must utilize relative widths and CSS grid template areas. Columns collapse sequentially from right to left as viewports shrink.

---

## 7. Component Architecture

### 1. MetricCard (KPI Block)
- **Purpose**: Displays a single, primary physiological parameter (e.g., pH, Turbidity, Hydration Index) with historical status and target deltas.
- **Variants**:
  - *Standard*: Shows raw value, label, and trend sparkline.
  - *Highlighted*: Large size, features a circular progress ring (similar to Apple/Oura rings) for critical indices like Hydration or Kidney Health.
- **States**:
  - *Default*: Static rendering, translucent borders.
  - *Hover*: Elevation shadow shift, border highlights with primary brand color, subtle icon scale (1.05x).
  - *Active (Selected)*: Embedded indicator showing detailed telemetry drilldown in adjacent panel.
  - *Loading*: Skeleton shimmer effect over data text.
- **Usage Guidelines**: Never stack more than 4 MetricCards horizontally. Place at the top of the dashboard views.

### 2. PhysiologicalBadge (Health Range Status)
- **Purpose**: Instantly highlights the safety tier of a telemetry reading.
- **Variants**:
  - *Optimal*: Green fill (10% opacity) with solid green border and text.
  - *Caution*: Amber fill (10% opacity) with solid amber border and text.
  - *Critical*: Red fill (10% opacity) with solid red border and text.
- **States**:
  - *Default*: High-contrast state, static.
  - *Interactive*: Clickable badge displaying physiological range breakdown (e.g., pH 4.5–8.0 normal limits). Hover reveals a tooltip.
- **Usage Guidelines**: Place adjacent to numeric readouts. Do not use plain text colors without background container badges to preserve WCAG accessibility.

### 3. TelemetryChartContainer
- **Purpose**: Wraps raw charts, supplying global controls (date range, zoom resets, export buttons) and legend tags.
- **Variants**:
  - *Bi-temporal*: Side-by-side comparison charts (e.g., Today vs. 30-day baseline).
  - *Compact*: Stripped-back version for small card displays.
- **States**:
  - *Default*: Translucent panel structure, interactive grid lines.
  - *Data Fetching*: Shimmering overlay with "Syncing with cloud database..." label.
  - *Error*: Renders a caution icon, retry button, and clear fallback copy.
- **Usage Guidelines**: Must span at least 8 columns on desktop. Maximize vertical height (minimum 320px) to prevent vertical line crowding.

### 4. ReagentStripVisualizer
- **Purpose**: A digital replica of the physical 10-parameter urine strip, showing the color change of each chemical pad side-by-side with its reference colors.
- **Variants**:
  - *Interactive Diagnostic*: Highlights individual pads (e.g., Leukocytes, Nitrite, Urobilinogen) to inspect calibrated RGB matching and concentration levels.
  - *Static Summary*: Minimal vertical layout representing final test results.
- **States**:
  - *Unread*: Empty grey segments.
  - *Scanning*: Sequential glowing sweep animation (Vercel-like gradient transition) across the pads.
  - *Analysis Complete*: Fully colored pads with score overlays.
  - *Hover State*: Magnified view of the hovered pad with deviation indicator.
- **Usage Guidelines**: Keep vertically aligned on mobile and horizontally centered on large screens. Must always include text tooltips to ensure non-colorblind usability.

### 5. MultiUserProfileSelector
- **Purpose**: Manages multi-user biological profile switching on shared household devices.
- **Variants**:
  - *Dropdown Menu*: Compact select box for header integration.
  - *Avatar Grid*: Large grid screen for shared tablet installations.
- **States**:
  - *Active*: Highlighted with a colored border and active checkmark.
  - *Locked*: Show lock icon for profiles requiring biometrics or passcode verification (HIPAA compliance).
  - *Hover*: Elevation offset and border glow.
- **Usage Guidelines**: Place in the top-right corner of the global navigation bar.

### 6. DeviceConnectionStatus
- **Purpose**: Real-time visualization of the ESP32 IoT hardware status.
- **Variants**:
  - *Inline Status*: Compact dot + text (e.g., "Connected via BLE").
  - *Control Panel*: Modal interface displaying network details, RSSI signal strength, battery charge, and firmware upgrade status.
- **States**:
  - *Disconnected*: Pulsing red dot with troubleshooting link.
  - *Searching/Pairing*: Pulsing brand-cyan ring.
  - *Syncing*: Rotating sync arrows with percentage bar.
  - *Ready*: Solid emerald green dot.
- **Usage Guidelines**: Place permanently in the sidebar or main header bar for immediate feedback.

### 7. TelemetryDataTable
- **Purpose**: Shows long-term, multi-variable patient history logs.
- **Variants**:
  - *Clinical Review*: Comprehensive table with filtering, search, and CSV export.
  - *Compact Log*: 5-row preview shown on general landing dashboard.
- **States**:
  - *Sorting/Filtering*: Semi-transparent row loading state.
  - *Flagged Row*: Highlights in red or amber overlay if anomalous metrics are recorded.
  - *Hover*: Row background color shift to highlight cursor focus.
- **Usage Guidelines**: Must support keyboard pagination (Left/Right arrows) and full scroll horizontal container offsets for micro screens.

### 8. ClinicalThresholdForm
- **Purpose**: Allows clinicians or advanced users to custom-tune caution and critical warning trigger points.
- **Variants**:
  - *Single-metric Slider*: Range slider with visual boundaries.
  - *Bulk Configurator*: Tabular form group.
- **States**:
  - *Default*: Enabled fields showing current thresholds.
  - *Validating*: Real-time background checking to ensure limits match physiological viability (e.g. warning if pH max is set below pH min).
  - *Error*: Red focus borders with clear validation message text.
- **Usage Guidelines**: Restrict access to authenticated profiles (Physician/Admin) via RBAC flags.

### 9. PrimaryActionButton
- **Purpose**: Triggers critical user paths (e.g., "Start Optical Scan", "Connect Device").
- **Variants**:
  - *Primary*: Brand Cyan background, bold white text (Stripe-inspired hover transitions).
  - *Secondary*: Matte grey background, slate text.
  - *Destructive*: Deep crimson background, white text.
- **States**:
  - *Default*: Static visual weight.
  - *Hover*: 10% brightness increase, subtle translateY(-1px) elevation shift.
  - *Active (Press)*: Scale down (0.98x), dark border overlay.
  - *Loading*: Disables interaction, hides label, renders central spinner.
- **Usage Guidelines**: Limit to one Primary button per context page block.

### 10. ClinicalAlertModal
- **Purpose**: High-priority alert dialog appearing when extreme biochemical anomalies are detected (e.g., high glucose + high ketones).
- **Variants**:
  - *Emergency Dial*: Modal with urgent triage phone numbers and EHR dispatch options.
  - *Warning Alert*: Soft confirmation modal suggesting doctor appointments.
- **States**:
  - *Entrance*: Spring animation scaling from 95% to 100% opacity.
  - *Dismissed*: Fades down.
- **Usage Guidelines**: Focus trap must be enabled. Background backdrop must overlay with blur (`backdrop-filter: blur(8px)`) to obscure background data distraction.

---

## 8. Dashboard Design Language
- **Information Architecture Hierarchy**: 
  1. *Top Deck*: Global connection indicator + Profile switcher.
  2. *First Row*: 4 primary KPIs (Hydration, pH, Turbidity, Glucose index).
  3. *Main Area (Split Grid)*: Left 2/3 shows Telemetry Chart Container. Right 1/3 displays the active Reagent Strip Visualizer.
  4. *Bottom Row*: Multi-row history logs with filter mechanisms.
- **Visual Depth & Layout (Stripe/Linear Influence)**: 
  - Cards utilize absolute thin borders (`1px solid rgba(255,255,255,0.06)` in dark mode, `rgba(0,0,0,0.08)` in light mode).
  - Use of CSS backdrop filters (`blur(20px)`) combined with gradient-underlays to simulate premium glassmorphism.
- **Cognitive Load Optimization**: Hide secondary variables (e.g., DS18B20 calibration temps, Raw RGB sensor values) inside disclosure tabs. Display only translated physiological indexes at first glance.

---

## 9. Form Design Standards
- **Input Layout**: Forms must use a strict vertical orientation. Labels are placed above inputs in Outfit bold (`13px`), followed by a 4px gap. Input containers are fixed at `44px` height (ideal touch target). Helper text is located directly below.
- **Validation Engine**:
  - *Instant Feedback*: Inline validation triggers 500ms after user pauses typing.
  - *Visual Cueing*: Focus states use an outer glow transition (`box-shadow: 0 0 0 3px rgba(19, 194, 194, 0.25)`). Invalid states map to Crimson with a subtle shake animation.
- **Range Inputs**: Sliders must display real-time numerical previews directly above the thumb handle. Physiological ranges must show shaded tracks representing normal vs pathological bounds.

---

## 10. Data Visualization Standards
- **Biometric Color Maps**:
  - *pH*: Smooth gradient from red (acidic, 4.5) to green (optimal, 6.5) to deep purple (alkaline, 8.5).
  - *Specific Gravity*: Linear progression from transparent pale cyan (fully hydrated) to dense dark amber (dehydrated).
  - *Glucose / Ketones*: High contrast multi-color step-charts.
- **Interactive Tooltip Architecture**: Hovering on data points locks a vertical crosshair line. The tooltip displays the exact parameter reading, standard range deviations, and time of sample collection. Tooltips must animate smoothly using a spring transition.
- **Empty States**: If no telemetry has been recorded today, render a Vercel-like outline container illustrating the physical strip tray with a primary call to action button: "Initiate first scan of the day".

---

## 11. Accessibility Standards
- **Keyboard Navigation (Focus Management)**: Users must be able to navigate the entire dashboard, device setup workflows, and settings pages using `TAB` and `SHIFT+TAB`. Interactive components must render a high-contrast focus ring (`outline: 2px solid HSL(192, 95%, 48%)`).
- **Screen Reader Support (ARIA)**:
  - Tables must contain semantic `<thead>`, `<tbody>`, and descriptive `caption`.
  - Reagent Strip Visualizer must utilize `aria-live="polite"` during scan states to read out results (e.g., "Scan complete. pH is 6.5, normal. Leukocytes, negative.").
  - Interactive icons require `aria-hidden="true"` with descriptive screen-reader-only labels (`sr-only` text wrappers).

---

## 12. Mobile-first Strategy
- **Touch Target Optimization**: All buttons, profile selectors, and table rows must provide a minimum tap target of `44x44px` (Apple Human Interface Guidelines standard). Gaps between interactive elements are kept at minimum `8px`.
- **Gesture Architecture**:
  - *Swipe-to-Action*: Swiping a log item reveals export/delete actions.
  - *Pull-to-Refresh*: Triggers immediate ESP32 sync via Bluetooth or local API request.
  - *BottomSheet*: Profile switching and device configurations slide up from the bottom on mobile viewports to ensure single-hand thumb reach.
- **Responsive Adaptations**: The 12-column desktop grid collapses into a single vertical scroll stream on mobile. Telemetry tables automatically convert into swipeable summary cards showing only the abnormal parameters.

---

## 13. Motion Design Standards
- **Choreography & Animation Curves**:
  - Hover / Simple transitions: `200ms cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo).
  - Slide-in panels / Modals: `350ms` spring animation (`damping: 26, stiffness: 170`).
- **Scanning Feedback**: When the IoT device is transmitting sensor telemetry, the UI displays a rhythmic pulsing wave animation (glowing cyan gradients) reflecting the fluid flow sensor rate.
- **Accessibility Control**: Motion effects must be disabled or swapped for instant opacity cuts if the system-level `prefers-reduced-motion` media query is active.

---

## 14. Dark Mode Strategy
- **Contrast & Depth Mapping**:
  - *Background*: Deep Obsidian Black (`#090d16`).
  - *Surface Level 1 (Cards)*: Dark Slate (`#121824`).
  - *Surface Level 2 (Modals/Popovers)*: Mid Grey (`#1b2336`).
  - *Borders*: Semi-transparent white (`rgba(255, 255, 255, 0.06)`).
- **Light Source Emulation**: A subtle radial gradient overlay at the top of the dashboard page provides an organic Vercel/Linear-style glow effect, reducing visual flatness and guiding user focus.

---

## 15. Enterprise SaaS Design Standards
- **Multi-Tenant Architecture**: Interfaces for medical clinics feature a left-hand navigation sidebar that separates clinic locations, clinical staff rosters, patient telemetry review queues, and billing configuration dashboards.
- **Audit Trails & Security Displays**: All dashboard views show a small badge in the global footer indicating HIPAA compliance, secure end-to-end telemetry encryption (AES-256), and time since last security audit log entry.
- **Role-Based Access Control (RBAC)**:
  - *Physician View*: Full read/write, configuration of clinical alerts, medication pairing logs.
  - *Nurse View*: Patient onboarding, physical strip verification, note taking.
  - *Patient View*: Personal telemetry trend visualization, hardware troubleshooting, export of reports to PDF.
