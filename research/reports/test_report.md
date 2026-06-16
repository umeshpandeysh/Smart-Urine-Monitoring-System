# Prototype Test Evaluation Report

* **Date**: 2026-06-16
* **Device ID**: `ESP32_URINE_MONITOR_01`
* **Status**: Prototype Validation - Phase 1 Complete

---

## 1. Physical Sensor Calibration Verification

We verified the accuracy of the physical sensors against standard reference materials at $25.0^\circ\text{C}$ room temperature.

### pH Probe Accuracy Test
The pH probe was tested against buffer solutions after applying offset calibrations:
* **Buffer pH 4.00 Target**: Measured **pH 4.05** (Error: +1.2%)
* **Buffer pH 7.00 Target**: Measured **pH 7.01** (Error: +0.1%)
* **Buffer pH 10.00 Target**: Measured **pH 9.88** (Error: -1.2%)
* *Result*: **Pass**. Accuracy is within the $\pm 0.15$ pH target threshold.

### TDS Sensor Test
Electrical conductivity calibration factor verified using $1413 \, \mu\text{S/cm}$ standard solution:
* **Target Concentration**: $707 \, \text{ppm}$
* **Measured Value**: $695 \, \text{ppm}$ (Error: -1.7%)
* *Result*: **Pass**. Within the targeted $\pm 5\%$ margin for hydration index proxies.

---

## 2. Optical Strip Reader Classification Matrix

Tested the Nearest-Neighbor Euclidean Classifier on standard urine test strips.

| Target Parameter | Expected Value | Measured Classification | Match Status | Note |
| :--- | :--- | :--- | :--- | :--- |
| **Glucose** | Negative | Negative | **Match** | High contrast green pad |
| **Glucose** | Moderate | Moderate | **Match** | Brown-green transition |
| **Protein** | Negative | Negative | **Match** | Yellowish green pad |
| **Protein** | High | High | **Match** | Dark blue-green pad |
| **Ketones** | Negative | Negative | **Match** | Beige pad |
| **Ketones** | Trace | Trace | **Match** | Pale pinkish pad |

* *Result*: **Pass**. No false positives detected during baseline tests.
