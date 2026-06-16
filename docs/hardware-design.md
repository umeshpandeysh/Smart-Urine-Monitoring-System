# Hardware Design Specification

This document provides details on the electrical, power, and mechanical design requirements for the **Smart Urine Monitoring System**.

---

## 1. Electrical Schematic Design

The system coordinates standard analog sensors, I2C digital sensors, and 1-Wire sensors powered by a dual-rail supply (5V and 3.3V) managed by an ESP32.

```
                    +---------------------------------------+
                    |              ESP32 DevKit             |
                    |                                       |
  [5V DC Input] ----| 5V                                3V3 |----+ (VCC for TCS34725, DS18B20)
  [GND Input] ------| GND                               GND |----+ (Common Ground)
                    |                                       |
  [pH Signal] ------| GPIO 32 (ADC1_CH4)            GPIO 21 |---- SDA [TCS34725 Color]
  [TDS Signal] -----| GPIO 35 (ADC1_CH7)            GPIO 22 |---- SCL [TCS34725 Color]
  [Turbid Signal] --| GPIO 34 (ADC1_CH6)                    |
  [MQ-2 Signal] ----| GPIO 33 (ADC1_CH5)            GPIO 4  |---- DQ  [DS18B20 Temp]
  [Flow Signal] ----| GPIO 25 (Interrupt)           GPIO 12 |---- Gate [White LED Driver]
                    +---------------------------------------+
```

---

## 2. Component Pinout and Wiring Details

| Component | Interface | Operating Voltage | Pin on ESP32 | External Components Required |
| :--- | :--- | :--- | :--- | :--- |
| **pH Sensor Module** | Analog | 5.0V | GPIO 32 | Analog signal output calibration trim |
| **TDS Sensor Board** | Analog | 3.3V / 5.0V | GPIO 35 | Temperature-compensation logic in software |
| **Turbidity Sensor** | Analog | 5.0V | GPIO 34 | Phototransistor/IR diode collector |
| **DS18B20 Temperature**| OneWire | 3.3V | GPIO 4 | $4.7\text{k}\Omega$ pull-up resistor (DQ to VCC) |
| **MQ-2 Gas Sensor** | Analog | 5.0V | GPIO 33 | High heating current (requires separate 5V line) |
| **Flow Sensor** | Pulse | 3.3V / 5.0V | GPIO 25 | Internal or external $10\text{k}\Omega$ pull-up resistor |
| **TCS34725 Color** | I2C | 3.3V | GPIO 21 (SDA), 22 (SCL)| $4.7\text{k}\Omega$ pullups on SDA/SCL lines |
| **Chamber White LED** | PWM | 3.3V (Logic) | GPIO 12 | N-Channel MOSFET (e.g., 2N7000) + $220\Omega$ gate resistor |

---

## 3. Power Supply Architecture

Urine monitoring sensors have high power demands:
1. **MQ-2 Heater**: Draws up to $150\text{mA}$ continuous current for its internal heater.
2. **Turbidity Sensor**: Draws up to $40\text{mA}$ for its IR transmitter.
3. **ESP32 WiFi Transmissions**: Draws brief spikes up to $250\text{mA}$.

To prevent voltage drops affecting analog-to-digital conversions (ADC):
* **Recommended Source**: A 5V, 2.0A DC wall adapter.
* **Separation of Rails**:
  * **5V Rail**: Powers the MQ-2 heater, Turbidity module, and pH sensor board (if 5V-only).
  * **3.3V Rail**: Fed by the ESP32 onboard LDO regulator, powering the TCS34725, DS18B20 temperature sensor, and flow sensor.
* **Filtering**: Add a $100\mu\text{F}$ capacitor across the ESP32 5V and GND pins, and a $10\mu\text{F}$ capacitor near the analog sensor supplies to damp high-frequency switching noise.

---

## 4. Mechanical & Optical Chamber Design

Urinalysis requires isolation from external variables.

### Fluidic Collection Chamber
* **Material**: Medical-grade ABS or SLA resin (3D-printed with chemical-resistant sealant like polyurethane).
* **Sensor Immersion**: The pH, TDS, and temperature probes must be oriented vertically to prevent air bubbles from lodging on the sensing glass/prongs.
* **Drain Valve**: A normally closed (NC) 12V solenoid valve is placed at the exit. The valve is opened via a logic-level transistor (TIP120 or similar MOSFET) connected to ESP32 GPIO 27 to dump the sample after processing.

### Optical Reagent Strip Chamber
* **Optical Isolation**: An enclosed box painted matte black internally to eliminate external light leaks.
* **Illumination**: Standard LEDs shift in temperature and spectrum. A constant-current driver ensures stable light intensity.
* **Sensor-to-Strip Distance**: The TCS34725 sensor is positioned $10\text{mm}$ to $15\text{mm}$ directly above the target strip pad.
* **Mechanical Slider**: A stepper motor (e.g., 28BYJ-48) or a manual index slider moves the strip holder beneath the color sensor to measure all 10 reagent pads sequentially.
