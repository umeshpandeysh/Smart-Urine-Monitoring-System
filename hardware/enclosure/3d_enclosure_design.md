# 3D Enclosure & Mechanical Chamber Design

This document details the mechanical design, light isolation, and fluidic chamber specifications for the **Smart Urine Monitoring System** enclosure.

---

## 1. Dual-Chamber Design

To ensure user safety and device longevity, the enclosure is divided into two physically isolated chambers: the **Fluidic Chamber** and the **Electronics / Optical Chamber**.

```
+-------------------------------------------------------------+
|                     ELECTRONICS CHAMBER                     |
|                                                             |
|   [ ESP32 DevKit ]   [ TCS34725 Sensor ]   [ LED Driver ]  |
|                                |                            |
+--------------------------------|----------------------------+
|=================== SEALED NEOPRENE GASKET ==================|
+--------------------------------|----------------------------+
|                      FLUIDIC CHAMBER                        |
|                                v                            |
|    [ pH Probe ]   [ TDS Probe ]   [ Reagent Strip Tray ]    |
|                                                             |
+-------------------------------------------------------------+
```

### 1. Fluidic Chamber (Wet Zone)
* Contains the flow sensor, turbidity sensor cuvette, pH probe bulb, and TDS prongs.
* Features a gravity-assisted slope of 15° to ensure fluid flows towards the drain solenoid.
* Must be printed using water-resistant filament (e.g., PETG or ASA) and coated with food-grade epoxy resin to prevent fluid absorption.

### 2. Electronics & Optical Chamber (Dry Zone)
* Houses the ESP32, power management circuits, and the TCS34725 optical sensor.
* Separated from the wet chamber by a 3mm silicone or neoprene gasket to prevent moisture ingress.
* Houses the reagent strip reading tray, which is mechanically advanced under the TCS34725 sensor.

---

## 2. Optical Isolation for Reagent Strip Reading

Reagent strip color readings are highly sensitive to ambient light variations (fluorescent, LED, or sunlight).
* **Light Trap**: The optical box is designed with an overlapping interlocking lid (baffle design) that blocks external light.
* **Internal Finish**: The interior of the optical chamber is spray-coated with matte black primer to prevent internal reflections.
* **LED Placement**: The high-CRI white LED is angled at 45° relative to the reagent strip surface, while the TCS34725 sensor looks straight down at 90°. This layout prevents specular reflections (glare) from entering the sensor.

---

## 3. Manufacturing Recommendations

* **3D Printing File Formats**: Standard `.STL` and `.STEP` files.
* **FDM Settings (PETG)**:
  * Infill: 30% Gyroid (for structural integrity and sealing).
  * Layer Height: 0.15mm (for fine thread definition on the probe mount glands).
  * Perimeter: 4 walls (to ensure the liquid channel remains watertight).
* **SLA Resin Printing (Alternative)**: Recommended for the optical reader tray and fine sensor mounts to ensure precise 0.1mm tolerances.
