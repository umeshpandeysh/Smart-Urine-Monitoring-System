# Contributing to Smart Urine Monitoring System

First off, thank you for considering contributing to the Smart Urine Monitoring System! It is people like you that make this open-source health screening platform a reality.

To maintain code quality, reproducibility, and safety, please follow the guidelines below.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs or Hardware Issues
* Check the current open issues to ensure the bug has not already been reported.
* Open a new issue with a clear title and description, including:
  * Hardware revision (ESP32 board type, sensor modules used).
  * Schematic changes (if applicable).
  * Firmware version and steps to reproduce the issue.
  * Serial monitor logs or telemetry dumps.

### Requesting Features
* Open a feature request issue explaining the "why" and "how".
* Provide mockups or flowcharts for UI updates.
* Suggest specific components or wiring pinouts for new hardware integration.

### Submitting Pull Requests (PRs)
1. Fork the repository and create your branch from `main`.
2. Ensure firmware compiles cleanly on the ESP32 Core (v3.x or latest stable) for Arduino IDE or PlatformIO.
3. Write clean, modular C++ code matching the style guide below.
4. Document any new config parameters in [config.h](file:///c:/Users/UMESH%20PANDEY/OneDrive/Documents/Adobe/Smart-Urine-Monitoring-System/firmware/esp32/config.h).
5. Update docs under `docs/` if modifying sensor behaviors or calculations.
6. Verify your PR passes any validation scripts.

## Coding & Hardware Standards

### Firmware
* Use camelCase for variables/functions, PascalCase for classes, and UPPER_SNAKE_CASE for constants.
* Every sensor module should be self-contained in its header or source file within `firmware/esp32/sensors/`.
* Avoid blocking calls like `delay()` inside sensor loops; use non-blocking timers (`millis()`).

### Hardware
* Keep circuit diagrams in readable PDF/PNG/SVG formats inside `hardware/circuit-diagrams/`.
* Maintain the Bill of Materials (BOM) in `hardware/bill-of-materials/bom.csv` using correct manufacturer part numbers (MPNs).
