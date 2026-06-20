# Sensor Integration Guide

This guide details the integration protocols, driver configuration, and electrical interface logic for all sensors in the **Smart Urine Monitoring System**.

---

## 1. Physical Parameter Sensors

### pH Sensor (Analog)
* **Model**: Analog pH Meter Kit (e.g., SEN0161).
* **Interface**: Analog (Voltage output proportional to Hydrogen ion concentration).
* **ESP32 Integration**: Connected to GPIO 32. ESP32 ADCs have non-linearities, requiring a multi-point calibration lookup table (LUT) or regression curve from 0V to 3.3V.
* **Operating Logic**:
  * Neutral voltage ($pH = 7.0$) is typically calibrated to $\approx 1.5\text{V} - 2.0\text{V}$.
  * Slope: $\approx -59.2\text{mV} / \text{pH}$ unit at 25°C.

### TDS / EC Sensor (Total Dissolved Solids)
* **Model**: Analog TDS Sensor (e.g., SEN0244).
* **Interface**: Analog (Voltage proportional to conductivity, EC).
* **Operating Logic**:
  * An AC excitation voltage is used to prevent probe polarization.
  * TDS is calculated using the formula:
    $$TDS = (135.6 \times V^3 - 55.43 \times V^2 + 10.32 \times V) \times 0.5$$
    where $V$ is the temperature-compensated analog voltage.

### Turbidity Sensor
* **Model**: Turbidity Sensor Module (e.g., SEN0189).
* **Interface**: Analog (voltage range 0V to 4.5V).
* **Operating Logic**:
  * High voltage ($\approx 4.2\text{V}$) indicates clear water (0 NTU).
  * Low voltage ($\approx 2.5\text{V}$ or lower) indicates highly turbid fluid (3000+ NTU).
  * Approximation curve:
    $$NTU = -1120.4 \times V^2 + 5742.3 \times V - 4352.9$$

### Temperature Sensor (DS18B20)
* **Model**: Waterproof DS18B20 Probe.
* **Interface**: Dallas 1-Wire Digital Bus.
* **Pin**: GPIO 4 (requires $4.7\text{k}\Omega$ pull-up to 3.3V).
* **Operating Logic**:
  * Uses 64-bit unique ROM addressing.
  * Provides 9 to 12-bit temperature readings in Celsius. Used to feed the pH and TDS temperature compensation routines.

### MQ-2 Gas Sensor
* **Model**: MQ-2 Gas Detector Module.
* **Interface**: Analog.
* **Operating Logic**:
  * Detects volatile organic components (VOCs) and ammonia gas by heating a Tin Dioxide ($\text{SnO}_2$) semiconductor layer.
  * Resistor load $R_L$ is adjusted to change sensitivity. Readings are processed as a ratio of sensor resistance to clean air resistance ($R_s / R_0$).

### Flow Sensor
* **Model**: YF-S201 Hall-Effect Flow Sensor.
* **Interface**: Digital Pulses (Frequency).
* **Pin**: GPIO 25.
* **Operating Logic**:
  * Standard pulse rate: $F = 7.5 \times Q$ (where $Q$ is flow rate in L/min).
  * ESP32 utilizes a rising-edge hardware interrupt to track pulses.

---

## 2. Optical Reagent Sensor (TCS34725)

The TCS34725 is a multi-spectral colorimeter that captures Red, Green, Blue, and Clear (RGBC) light values.

### Device Details
* **I2C Address**: `0x29`
* **Bus Speed**: Fast Mode (400 kHz)
* **Pinout**:
  * SDA: GPIO 21
  * SCL: GPIO 22
  * LED control: GPIO 12 (connected to the sensor's LED pin or transistor gate to toggle illumination).

### Register Configuration
The firmware configures the TCS34725 for urine strip scanning as follows:
* **Integration Time (ATIME)**: `0xEB` (100ms conversion time, max count 43008) to capture sufficient light without saturation.
* **Gain (CONTROL)**: `0x01` (4x Gain) to balance reading sensitivity inside the matte-black enclosure.

### RGBC to Color Temperature & Lux
The raw RGBC counts are parsed to calculate correlated color temperature (CCT) and lux level:
```cpp
uint16_t r, g, b, c;
tcs.getRawData(&r, &g, &b, &c);

// Calculate color temperature (degrees Kelvin)
uint16_t colorTemp = tcs.calculateColorTemperature(r, g, b);

// Calculate lux (illuminance)
uint16_t lux = tcs.calculateLux(r, g, b);
```
These normalized chromaticity coordinates are then mapped against reference vectors for glucose, protein, and ketone color pads.
