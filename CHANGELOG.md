# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta] - 2026-06-16

### Added
- **Firmware (ESP32)**:
  - Integrated sensor drivers for pH, TDS, turbidity, temperature (DS18B20), gas (MQ-2), water flow, and I2C color sensor (TCS34725).
  - Implemented non-blocking sensor collection loop.
  - Implemented 10-parameter urine strip color analysis engine.
  - Added WiFi connection manager with auto-reconnect.
  - Created REST API client for forwarding telemetry payloads to dashboard.
- **Hardware**:
  - Preliminary pinout assignments and schematic configuration.
  - Layer layout recommendations and design guidelines for PCB design.
  - CAD model suggestions and physical collection chamber design constraints.
  - Complete Bill of Materials (BOM) for prototype assembly.
- **Dashboard**:
  - Web UI mockup supporting real-time sensor streams and strip parameter graphs.
  - Node.js/Express backend API for ingesting ESP32 POST requests.
  - SQL Schema for PostgreSQL/SQLite database telemetry storage.
- **Documentation**:
  - System architecture, calibration guidelines, and future roadmap documents.
