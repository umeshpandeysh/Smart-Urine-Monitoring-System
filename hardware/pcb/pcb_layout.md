# PCB Layout & Design Guidelines

This document outlines electrical routing rules, layer configurations, and noise mitigation guidelines for laying out the **Smart Urine Monitoring System** PCB.

---

## 1. PCB Stackup

A **2-layer board** is sufficient for this design, but a **4-layer stackup** is recommended to isolate low-level analog probe voltages from Wi-Fi switching transients.

### Recommended 4-Layer Stackup
1. **Layer 1 (Top)**: High-speed digital signals (I2C, OneWire), sensor analog routes, and components.
2. **Layer 2 (Inner)**: Solid Ground Plane (GND) to minimize current return loops.
3. **Layer 3 (Inner)**: Power Rails (3.3V and 5.0V split planes).
4. **Layer 4 (Bottom)**: Solenoid driver pathways, LED routing, and auxiliary debug test points.

---

## 2. Component Placement Constraints

* **ESP32 Antenna Keepout**: Place the ESP32 module near the edge of the board. Ensure the region directly beneath and surrounding the PCB antenna is clear of copper planes, traces, and vias on all layers.
* **Separation of Concerns (Analog vs. Digital)**:
  * Place the high-impedance pH and TDS conditioning circuitry on the left side of the board, as far away from the ESP32 Wi-Fi antenna as possible.
  * Keep the I2C digital traces and the DS18B20 digital routes separated from the analog sensor inputs.
* **Thermal Isolation**: The MQ-2 gas sensor contains an internal heater that generates significant heat. Isolate it thermal-wise by placing routing slot cutouts around its PCB footprint to prevent heat transferring to the sensitive pH/TDS analog calibration electronics.

---

## 3. Routing Guidelines

### Trace Widths
* **Power Lines (5V, 3.3V, 12V Solenoid)**: Trace widths should be at least **$0.8\text{mm}$ to $1.2\text{mm}$** to handle the solenoid surge currents and heater demands without excessive heat generation.
* **Signal Lines (Analog, I2C)**: Trace widths of **$0.2\text{mm}$ to $0.25\text{mm}$** are sufficient.

### Shielding & Impedance
* **I2C Routing**: Keep SDA and SCL parallel, short, and adjacent to a ground plane. Avoid routing I2C lines parallel to high-impedance analog lines.
* **Guard Rings**: Surround the high-impedance analog traces connecting the BNC connector of the pH probe to the operational amplifiers with a copper guard ring connected to GND.
