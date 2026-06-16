# System Architecture

This document details the software, hardware, and data communication architecture of the **Smart Urine Monitoring System**.

---

## Architecture Overview

The system is split into three main layers:
1. **Physical & Optical Sensing Layer**: Collects raw physical parameters from the sample fluid and captures optical RGB signatures from the reagent strip.
2. **Edge Processing Layer (ESP32)**: Handles I2C/analog acquisition, temperature compensation, calibration mathematics, color metric categorization, and Wi-Fi transmission.
3. **Data Logging & Visual Dashboard Layer**: Ingests JSON payloads, saves telemetry to a database, and exposes an interactive dashboard showing historical records.

```
+-----------------------------------------------------------------------------------+
|                            Physical / Fluidic Chamber                             |
|  [Urine Inlet] ---> (Flow Sensor) ---> [Sensing Chamber] ---> (Solenoid Valve)    |
|                                                |                                  |
|                                                v                                  |
|                                     [Optical Reagent Chamber]                     |
+-----------------------------------------------------------------------------------+
                                                 | (Sensory Inputs)
                                                 v
+-----------------------------------------------------------------------------------+
|                             Edge Processing (ESP32)                               |
|   +-------------------+    +--------------------+    +------------------------+   |
|   | Analog / I2C Bus  |--->| Calibration Engine |--->| Classify/Filter Engine |   |
|   | (Raw Voltages)    |    | (Temp-Compensated) |    | (10-Parameter Logic)   |   |
|   +-------------------+    +--------------------+    +------------------------+   |
|                                                                    |              |
|                                                                    v              |
|                                                        +-----------------------+  |
|                                                        | JSON Payload Build    |  |
|                                                        +-----------------------+  |
+-----------------------------------------------------------------------------------+
                                                                     | (Wi-Fi POST)
                                                                     v
+-----------------------------------------------------------------------------------+
|                           Cloud / Local Dashboard Layer                           |
|      +---------------------+      +-------------------+      +-----------------+  |
|      | Express Ingestion   |----->| DB Storage        |----->| Glassmorphism   |  |
|      | REST API Server     |      | (SQLite/Postgres) |      | Web UI          |  |
|      +---------------------+      +-------------------+      +-----------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 1. Physical & Optical Fluidics Flow

* **Inlet Flow**: Urine enters the system through the physical collection chamber, passing through a Hall-effect flow sensor.
* **Sensing Chamber**: Probes (pH, TDS, Turbidity, DS18B20 Temp) are submerged in the fluid. The ESP32 waits until the flow rate drops to zero, indicating the chamber is filled and stable, then takes reading samples for 3-5 seconds.
* **Optical Reagent Chamber**: The fluid passes or is manually applied onto a standard 10-parameter reagent strip placed in a dark box. A white LED (CRI > 90) provides calibrated illumination, and the TCS34725 color sensor sweeps across the strip pads (or multiple color sensors read distinct pads) to capture the RGB reflectances.
* **Drainage**: A solenoid valve or gravity drain empties the chamber.

---

## 2. Edge Processing Layer (ESP32 Firmware)

The ESP32 runs a single-threaded loop (or freeRTOS dual-core tasks) performing the following:

### Data Acquisition Task
* Samples analog channels for pH, TDS, and turbidity.
* Reads DS18B20 temperature via OneWire.
* Calculates moving averages over 64 samples to filter out electrical noise.

### Temperature Compensation
* pH and electrical conductivity (TDS) change with temperature. The firmware compensates these values using the DS18B20 reading:
  $$EC_{25} = \frac{EC_T}{1 + \alpha(T - 25)}$$
  where $\alpha \approx 0.0191 / ^\circ\text{C}$ and $T$ is the temperature in °C.

### Strip Classification Logic
* Maps the raw RGB values from the TCS34725 to calibrated reference ranges.
* Classifies the color into discrete medical bins (e.g., Glucose: Normal, Light, Moderate, High).
* Computes hydration levels using the compensated TDS value.

---

## 3. Communication Protocol

Telemetry is sent via HTTP POST to the API endpoint as a JSON payload.

### API Endpoint
* **Path**: `/api/telemetry`
* **Method**: `POST`
* **Content-Type**: `application/json`

### JSON Schema Example
```json
{
  "device_id": "ESP32_URINE_MONITOR_01",
  "timestamp": 1781648712,
  "sensors": {
    "temperature_c": 36.8,
    "ph": 6.25,
    "tds_ppm": 480,
    "turbidity_ntu": 12.5,
    "gas_mq2_raw": 320,
    "flow_volume_ml": 250
  },
  "strip_results": {
    "glucose": "Negative",
    "protein": "Negative",
    "ketones": "Trace",
    "blood": "Negative",
    "nitrite": "Negative",
    "leukocytes": "Negative",
    "specific_gravity": 1.015,
    "ph": 6.0,
    "bilirubin": "Negative",
    "urobilinogen": "Normal"
  },
  "assessment": {
    "hydration_status": "Optimal",
    "flags": []
  }
}
```

---

## 4. Ingestion & Storage

* **Express API Server**: Listens for HTTP POSTs, parses the JSON payload, checks ranges for warnings, and writes data to the database.
* **Database (schema.sql)**: Stores readings across two main tables: `devices` and `telemetry_logs`, which index physical metrics and strip parameters.
* **Web UI Dashboard**: Queries the database to display historical trends, parameter charts, and active flags.
