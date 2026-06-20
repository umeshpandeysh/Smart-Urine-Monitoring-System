# System Calibration Guidelines

Calibration is critical to translate raw sensor voltages and sensor counts into accurate clinical values. This document details the calibration procedures for the physical probes and the optical strip reader.

---

## 1. pH Probe Calibration

pH probes change baseline offset and sensitivity over time due to aging and temperature variations.

### Equipment Needed
* Standard buffer solutions: pH 4.00, pH 7.00, and pH 10.00.
* Deionized (DI) water for rinsing.

### Standard Operating Procedure (SOP)
1. **Rinse**: Rinse the probe thoroughly with DI water and blot dry.
2. **Buffer 7.00 (Neutral Offset)**:
   * Submerge the probe in the pH 7.00 buffer.
   * Allow readings to stabilize for 60 seconds.
   * Adjust the physical potentiometer on the analog signal conditioning board until the voltage reads exactly $2.00\text{V}$ (or note the raw ADC reading as `PH_OFFSET_VOLTS` in [config.h](file:///c:/Users/UMESH%20PANDEY/OneDrive/Documents/Adobe/Smart-Urine-Monitoring-System/firmware/esp32/config.h)).
3. **Buffer 4.00 / 10.00 (Slope/Sensitivity)**:
   * Rinse the probe and submerge in pH 4.00 buffer.
   * Note the stable voltage. Calculate the slope:
     $$\text{Slope (V/pH)} = \frac{V_{4.00} - V_{7.00}}{4.00 - 7.00}$$
   * Save the calculated slope into your ESP32 configuration settings.

---

## 2. TDS / Electrical Conductivity Probe Calibration

TDS measurement relies on the electrical conductivity of dissolved ions.

### Equipment Needed
* Standard calibration solution (e.g., $1413 \, \mu\text{S/cm}$ or $707 \, \text{ppm}$).

### SOP
1. Submerge the TDS probe in the $1413 \, \mu\text{S/cm}$ standard solution.
2. Monitor the raw voltage on the ESP32 serial console.
3. Compute the temperature coefficient using the DS18B20 reading.
4. Calculate the calibration scaling factor:
   $$\text{TDS Factor} = \frac{707.0}{\text{Measured TDS Value}}$$
5. Store the calibration factor in the configurations.

---

## 3. TCS34725 Optical Color Calibration

Because ambient temperature, LED degradation, and mechanical tolerances affect the raw RGB sensor readings, the optical system needs calibration against a reference target.

### Equipment Needed
* Calibrated White Reference Card (typically 95-99% diffuse reflectance).
* Calibrated Matte Black Reference Card.

### Calibration Procedure
1. **Dark Calibration**:
   * Turn off the internal LED.
   * Read the TCS34725. The measured values represent the background leakage current (dark current).
   * Save these as `R_dark`, `G_dark`, `B_dark`.
2. **White Calibration**:
   * Turn the internal LED on.
   * Place the white reference card under the sensor.
   * Read raw counts: `R_white`, `G_white`, `B_white`.
   * Compute normalized gain scaling values to ensure balanced RGB readings:
     $$k_R = \frac{1000}{R_{white} - R_{dark}}, \quad k_G = \frac{1000}{G_{white} - G_{dark}}, \quad k_B = \frac{1000}{B_{white} - B_{dark}}$$
3. **Reference Verification**:
   * Once these coefficients are saved, reading the white card will yield normalized, calibrated RGB values of $(1000, 1000, 1000)$.
   * These factors are applied to subsequent raw readings before running the nearest-neighbor classification:
     $$R_{cal} = (R_{raw} - R_{dark}) \times k_R$$
     $$G_{cal} = (G_{raw} - G_{dark}) \times k_G$$
     $$B_{cal} = (B_{raw} - B_{dark}) \times k_B$$
