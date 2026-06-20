# UroSense Public Dashboard Architecture
*Version 1.0.0 — Series A Analytical Platform Specification*

## Executive Summary
This document defines the complete UI Architecture, Navigation, Data Strategy, and Component Specifications for the **UroSense Public Dashboard**. 

Designed to look like the Stripe Dashboard, Linear Analytics, Oura Insights, and modern Smart City Command Centers, this dashboard is a real-time, public-facing analytics system. It visualizes aggregated, fully anonymous, non-personal health trends and infrastructure performance statistics across global airport networks, smart city regions, and enterprise campuses.

---

# Public Dashboard Architecture

## 1. Dashboard Purpose
The UroSense Public Dashboard translates passive biochemical telemetry into actionable, large-scale health and operational insights. It serves two main functions:
1. **Epidemiological and Biosecurity Monitoring**: Allows public health agencies to track dehydration rates, infectious markers, and metabolic wellness trends across geographic regions.
2. **Infrastructure Fleet Management**: Allows facility managers (airports, transit hubs, hospitals) to monitor hardware health, sensor calibration states, and automated maintenance workflows.

---

## 2. User Personas
- **Dr. Evelyn Vane (Director of Public Health Operations)**: Uses regional health trends and seasonal anomalies to track early outbreak signals and target municipal wellness campaigns.
- **Kenji Sato (VP of Operations, International Airport Group)**: Monitors device uptime, calibration statuses, and cartridge replacement alerts across airport terminals to maintain service levels.
- **Siddharth Mehta (Smart City Systems Engineer)**: Integrates municipal telemetry data feeds into urban water, waste management, and smart transit platforms.
- **Venture Capitalist / Series A Investor**: Evaluates UroSense’s data volume, API performance, network expansion speed, and technical scalability.

---

## 3. Information Hierarchy
The layout follows a progressive disclosure grid (inspired by Linear and Stripe):
1. **Executive Overview (Top Tier)**: High-level KPI indicators (active locations, daily screenings, device health, system status) that establish system scope.
2. **Interactive Visualizations (Mid Tier)**: Geographic heatmaps, health trends, and infrastructure telemetry charts.
3. **Operational Logs & Actions (Lower Tier)**: Live status logs, maintenance alert queues, and direct data export tools.

```
+-------------------------------------------------------+
|  Global Controls (Sector, Location, Date Range)        |
+-------------------------------------------------------+
|  Executive Overview KPIs (4 columns)                  |
+-------------------------------------------------------+
|  Geographic Heatmap (60%)  |  Alert Center Queue (40%)|
+-------------------------------------------------------+
|  Health Analytics (50%)    |  Infrastructure (50%)    |
+-------------------------------------------------------+
```

---

## 4. Navigation Structure
- **Global Context Bar**: Located at the top of the interface, featuring dropdown selectors for `Sector` (All, Airport, Corporate Campus, University), `Location/Region`, and `Date Range Preset` (Real-Time, Today, 7D, 30D, Custom).
- **Collapsible Left Sidebar**:
  - `Overview` (System KPIs & Quick Alerts)
  - `Geographic Analytics` (Interactive GIS Maps)
  - `Health Analytics` (Biomarker Trends & Metrics)
  - `Infrastructure` (Device Fleet, Calibration, Diagnostics)
  - `Alert Center` (Active Health & Maintenance queues)
  - `Developer API` (JSON payload sandboxes and SDK docs)

---

## 5. Data Architecture
- **Data Collection Pipeline**: Deployed ESP32 units transmit telemetry payloads (physical sensor readings and RGB values) via HTTPS REST/WebSockets.
- **Aggregation Engine**: An ingestion pipeline processes raw logs, stripping local network metadata and routing data to a time-series database (TimescaleDB/InfluxDB).
- **Aggregation Rules**:
  - Raw individual telemetry logs are deleted after processing.
  - Data is aggregated in 1-hour blocks.
  - Minimum cohort sizes are enforced: no geographical coordinate displays if fewer than 50 screenings occur in a region within the target hour.

---

## 6. Real-Time Data Strategy
- **Ingestion Pipeline**: The client dashboard opens a secure WebSocket connection (`wss://api.urosense.com/v1/public/telemetry/live`) to receive updates.
- **Throttling & Buffering**: Real-time counters (e.g., "Analyses Today") update using a client-side transition animation. Charts use a 10-second data buffer to prevent visual noise from high-frequency updates.
- **State Preservation**: Page state parameters (such as viewport coordinates, selected metric tabs, and chart zoom levels) are preserved in query parameters to support easy page sharing.

---

## 7. Privacy & Anonymization Strategy
- **$k$-Anonymity & $l$-Diversity**: Geographic markers are grouped into coarse sectors (e.g., Terminal 1, Gate Area B). Specific restroom coordinates are never displayed.
- **Zero PII (Personally Identifiable Information)**: The system does not capture names, payment card information, device IDs, MAC addresses, or IP addresses.
- **Edge Hashing**: Authentication checks (like NFC taps) are hashed locally using salt keys before transmission. The public dashboard only accesses aggregated numbers.

---

# Dashboard Section Details

## Section 1: Executive Overview

### Module 1.1: Global Infrastructure KPI Deck
- **Purpose**: Displays the real-time size, usage, and health of the active UroSense network.
- **Components**: Four high-contrast KPI cards (Active Locations, Analyses Today, Active Screenings, Fleet Health Score).
- **Data Sources**: `/api/v1/public/overview/stats` (Redis cache layer updating every 5 seconds).
- **User Interactions**: Hovering displays a tooltip showing change indicators compared to the previous 24 hours. Clicking opens the detailed analytical view for that specific metric.
- **Drill-down Behavior**:
  - *Active Locations*: Switches navigation to the Geographic Analytics tab.
  - *Analyses Today*: Focuses time-series charts on the current day's progress.
- **Loading States**: Skeleton shimmer over text values and Sparkline vectors.
- **Empty States**: Renders default `0` with a gray connectivity dot.
- **Error States**: Displays `---` with a red warning badge: "Unable to sync metrics. Retrying..."

---

## Section 2: Geographic Analytics

### Module 2.1: Population Biomonitoring Map
- **Purpose**: Visualizes the density of screenings and regional health alerts.
- **Components**: Interactive 3D geographic map overlay using MapLibre GL, color-coded heat circles (Green, Amber, Red), and filter controls.
- **Data Sources**: `/api/v1/public/geo/map-data` (spatial aggregate query).
- **User Interactions**: Map panning, zooming, and clicking on region markers. Hovering over a region displays a popover summary card.
- **Drill-down Behavior**: Clicking a region zooms the map, updates global filters, and filters dashboard metrics to show only the selected region's data.
- **Loading States**: Translucent overlay with a glowing radar ring.
- **Empty States**: Displays the global map layout with a tooltip: "No active deployments in the selected region."
- **Error States**: Displays a static fallback map vector with an overlay: "Failed to load spatial map layers."

---

## Section 3: Health Analytics

### Module 3.1: Biomarker Trend Matrix
- **Purpose**: Visualizes anonymous, long-term trends for key biomarkers like pH, specific gravity (hydration), and protein indicators.
- **Components**: Recharts interactive line charts, metric selection tabs, and average baseline comparison overlays.
- **Data Sources**: `/api/v1/public/health/trends` (historical analytics database).
- **User Interactions**: Hovering highlights time coordinates, vertical crosshairs, and comparison values. Brushing zooms in on specific date ranges.
- **Drill-down Behavior**: Clicking a metric (e.g., pH) updates adjacent population histogram grids to show the distribution of pH scores.
- **Loading States**: Smooth shimmer animation over the chart grid lines and legends.
- **Empty States**: Renders an empty grid line canvas with the message: "No data matches your selected range parameters."
- **Error States**: Replaces the canvas with an alert block: "Telemetry collection timeout. [Refresh Chart]"

---

## Section 4: Infrastructure Analytics

### Module 4.1: Fleet Diagnostic Dashboard
- **Purpose**: Tracks hardware performance and maintenance states across all active UroSense installations.
- **Components**: A stacked bar chart showing device statuses (Uptime, Calibrating, Warning, Offline), along with a predictive maintenance table.
- **Data Sources**: `/api/v1/public/infrastructure/diagnostics`.
- **User Interactions**: Filtering devices by status, sorting the maintenance table by priority or model type, and searching by device ID.
- **Drill-down Behavior**: Clicking a device entry opens a diagnostic view showing battery charts, sensor calibration signals, and cartridge levels.
- **Loading States**: Row-by-row skeleton loading in the data table.
- **Empty States**: Displays a green check icon with the message: "All devices operating within normal parameters. No maintenance required."
- **Error States**: Replaces the list with a diagnostic alert: "Unable to sync device states. [Retry Link]"

---

## Section 5: Time-Series Analytics

### Module 5.1: Comparative Chrono-Chart
- **Purpose**: Compares current screening rates and biometric indices against historical averages.
- **Components**: Layered bar and line graphs showing current data overlaid on historical baselines (e.g., current hourly rates vs. the rolling 30-day average).
- **Data Sources**: `/api/v1/public/timeseries/compare`.
- **User Interactions**: Toggling granularity buttons (Hourly, Daily, Weekly, Monthly) and toggling baseline comparison visibility.
- **Drill-down Behavior**: Clicking a specific day or hour zooms the time range to show detailed data for that period.
- **Loading States**: Renders empty chart axes with a glowing loading indicator in the center.
- **Empty States**: Displays a flat timeline indicating zero activity.
- **Error States**: Renders a warning message: "Could not fetch time-series comparison data."

---

## Section 6: Public Health Insights

### Module 6.1: Epidemiological Risk Predictor
- **Purpose**: Alerts public health agencies to anomalous biometric patterns that may indicate health risks.
- **Components**: Risk factor dials (Hydration Risk, Renal Load, Metabolic Shift Alerts), anomaly alert cards, and seasonal baseline charts.
- **Data Sources**: `/api/v1/public/health/insights` (output of the ML anomaly detection pipeline).
- **User Interactions**: Filtering by alert type (Infectious, Nutritional, Chronic) and exporting reports.
- **Drill-down Behavior**: Clicking an anomaly card opens a detail view showing matching regional markers, demographic estimates, and historical chart overlays.
- **Loading States**: Rotating dials and pulse animations over anomaly cards.
- **Empty States**: Renders a clean status panel: "No public health anomalies or biometric outliers detected."
- **Error States**: Displays a warning block: "Predictive pipeline offline. Retrying connection..."

---

## Section 7: Smart City Analytics

### Module 7.1: City Telemetry Integrations
- **Purpose**: Displays correlations between public health trends and smart city environmental metrics.
- **Components**: Multi-variable correlation line charts (e.g., tracking average dehydration levels against local temperatures).
- **Data Sources**: `/api/v1/public/integration/smartcity`.
- **User Interactions**: Drag-and-drop metric axis selectors and data export options.
- **Drill-down Behavior**: Clicking a data point opens details showing environmental factors, transit patterns, and municipal water data.
- **Loading States**: Shimmer overlays over the chart axis and grid.
- **Empty States**: Displays a preview graphic: "Select city metrics to compare with population health trends."
- **Error States**: Displays: "City integration feed unavailable."

---

## Section 8: Alert Center

### Module 8.1: Unified Incident Queue
- **Purpose**: Lists operational, maintenance, and public health incidents in a single queue.
- **Components**: Live log queue, severity indicators (Critical, High, Medium, Low), and assignment controls.
- **Data Sources**: `/api/v1/public/alerts/live` (live SSE event stream).
- **User Interactions**: Filtering alerts by severity or type, and assigning alerts to maintenance queues.
- **Drill-down Behavior**: Clicking an alert row highlights the affected region on the map and displays the device's diagnostic history.
- **Loading States**: Displays flashing indicators at the top of the card as updates stream in.
- **Empty States**: Displays a clean status message: "No active incidents. Zero alerts triggered."
- **Error States**: Renders a red error banner: "Live event stream disconnected. [Reconnect]"

---

# Strategic Architecture Guidelines

## KPI Framework
Metrics must use standardized formulas across all systems:
$$\text{Device Health Score} = \left( 1 - \frac{\text{Offline Hours} + \text{Calibration Error Hours}}{\text{Total Operational Hours}} \right) \times 100$$
$$\text{Hydration Index} = \frac{\text{Total Screenings with Normal TDS}}{\text{Total Screenings}} \times 100$$
$$\text{System Uptime} = \frac{\text{Active Nodes Online}}{\text{Total Deployed Nodes}} \times 100$$

---

## Chart Strategy & Visual Design
- **Line & Area Charts**: Use for continuous variables (e.g., daily pH averages). Use semi-transparent gradients below lines (Stripe design style) to add depth.
- **Bar Charts**: Use for discrete comparisons (e.g., usage across terminals).
- **Colors**:
  - Primary Line: `HSL(192, 95%, 48%)` (UroSense Cyan).
  - Normal/Optimal: `HSL(142, 72%, 29%)` (Emerald Green).
  - Caution: `HSL(38, 92%, 50%)` (Amber).
  - Critical: `HSL(350, 89%, 52%)` (Crimson).

---

## Recharts Implementation Recommendations
- **ResponsiveContainer**: Wrap all charts in `<ResponsiveContainer width="100%" height={350}>` to ensure layouts adapt across viewports.
- **Tooltip Customization**: Build custom tooltips that render as absolute glassmorphic overlays (`backdrop-filter: blur(8px)`) with rounded corners (`8px`) and thin borders.
- **Performance Optimization**: Set `isAnimationActive={false}` on line charts when displaying live WebSockets data to optimize browser rendering performance.

---

## Mobile Dashboard Strategy
- **Responsive Layout**: The sidebar navigation collapses into a bottom navigation bar. Grids adapt to a single column, displaying key metrics first.
- **Data Densification**: Large data tables collapse into simple summary cards. Clicking a card opens full details in a slide-up drawer.
- **Touch-Friendly Controls**: Dropdowns and date picker elements open full-screen modals with oversized touch targets.

---

## Accessibility Strategy
- **WCAG 2.1 AA Compliance**: Maintain a contrast ratio of at least 4.5:1 for all text. Focus indicators must use a solid outline (`outline: 2px solid HSL(192, 95%, 48%)`).
- **Keyboard Navigation**: Ensure users can navigate the dashboard using `TAB` keys and search/filter using arrow keys.
- **Screen Reader Support**: Include descriptive `aria-label` tags for charts and maps (e.g., `aria-label="Line chart showing average population pH values over a 30 day period"`).

---

## Real-Time Update Strategy
- **WebSocket Streaming**: Use a persistent WebSocket connection to stream real-time events.
- **Dynamic Updates**: Animate counters using numeric transitions. Smoothly transition lines on time-series charts when new data points arrive.
- **Connection Backoff**: If the WebSocket disconnects, the system automatically falls back to HTTP polling every 30 seconds while trying to reconnect using an exponential backoff strategy (2s, 4s, 8s, 16s... up to a maximum of 60s).
