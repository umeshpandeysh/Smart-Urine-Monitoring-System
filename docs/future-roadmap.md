# Future Roadmap

This document outlines the planned design phases, feature integrations, and production milestones for the **Smart Urine Monitoring System**.

---

## Phase 1: Machine Learning & Classifier Upgrades (Short-Term)

* **Multivariate ML Classification**: Replace Euclidean-distance matching with a lightweight neural network (MLP) or Random Forest running on edge-ML (TensorFlow Lite for Microcontrollers). This will classify the 10-parameter strip pads using historical training datasets to increase robustness against varying hydration levels.
* **Auto-Calibration Loop**: Program the ESP32 to run auto-calibration routines using built-in white color references on the mechanical strip tray before every scan.
* **Advanced Error Handling**: Integrate optical check-sums (e.g. tracking specific alignment marks on the strip) to confirm the strip holder is correctly aligned.

---

## Phase 2: BLE & Mobile Integration (Medium-Term)

* **Bluetooth Low Energy (BLE) Provisioning**: Replace hardcoded WiFi credentials in `config.h` with a BLE-based provisioning service (using ESP-IDF's Unified Provisioning or custom BLE services) for setup via a mobile app.
* **Companion Mobile Application**: Develop a React Native cross-platform application for iOS and Android, allowing users to:
  * Initiate scans via Bluetooth.
  * Receive localized push notifications for health alerts.
  * Export historical logs in CSV/PDF formats for clinic review.
* **Apple HealthKit & Google Fit Syncing**: Integrate hydration levels and average urine metrics directly into mobile system health databases.

---

## Phase 3: Hardware Refinement & Mechanical Integration (Long-Term)

* **Smart Toilet Integration**: Design and prototype a retrofit device that attaches to standard toilet bowls:
  * Automatically intercepts a small sample volume during normal toilet use.
  * Directs the sample through a microfluidic sensing chamber.
  * Discharges the sample back into the bowl via gravity or a micro-pump.
  * Uses a cartridge of reagent strips that automatically indexes a new strip for each reading.
* **Biometric Multi-User Profiles**: Integrate a fingerprint scanner on the toilet flush plate or use time-of-flight sensors to identify different family members, logging readings to distinct user accounts.
* **Clinical Health Integrations**: Partner with telemetry APIs (e.g. Redox, Epic EHR systems) to securely forward records to primary care clinics under HIPAA guidelines.
