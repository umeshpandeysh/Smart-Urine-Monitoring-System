# Circuit Diagram & Connections

This guide provides electrical specifications, wiring layouts, and pull-up requirements for the **Smart Urine Monitoring System** schematic.

---

## 1. Complete Connection Matrix

The following table provides the pin-to-pin wiring map between the ESP32 DevKitC and individual system modules.

| Source Module | Module Pin | ESP32 Pin | Logic Level | Pull-up/down Requirements |
| :--- | :--- | :--- | :--- | :--- |
| **Power Supply** | +5V Output | 5V | 5V | Common power rail |
| **Power Supply** | GND Output | GND | 0V | Common ground |
| **pH Sensor** | VCC | 5V | 5V | Analog conditioning board supply |
| **pH Sensor** | GND | GND | 0V | Analog conditioning board ground |
| **pH Sensor** | Analog Out | GPIO 32 | 3.3V Max | Output adjusted via onboard potentiometer |
| **TDS Sensor** | VCC | 3.3V | 3.3V | Excitation module supply |
| **TDS Sensor** | GND | GND | 0V | Excitation module ground |
| **TDS Sensor** | Analog Out | GPIO 35 | 3.3V Max | Raw analog telemetry |
| **Turbidity Sensor**| VCC | 5V | 5V | IR LED / Photodiode supply |
| **Turbidity Sensor**| GND | GND | 0V | Ground |
| **Turbidity Sensor**| Analog Out | GPIO 34 | 3.3V Max | Voltage divider required if output > 3.3V |
| **DS18B20 Temp** | VCC | 3.3V | 3.3V | Digital thermometer supply |
| **DS18B20 Temp** | GND | GND | 0V | Ground |
| **DS18B20 Temp** | DQ (Data) | GPIO 4 | 3.3V | **$4.7\text{k}\Omega$ Pull-up resistor to 3.3V** |
| **MQ-2 Gas Sensor** | VCC | 5V | 5V | High heating element draw ($\approx 150\text{mA}$) |
| **MQ-2 Gas Sensor** | GND | GND | 0V | Ground |
| **MQ-2 Gas Sensor** | Analog Out | GPIO 33 | 3.3V Max | Voltage divider to protect ESP32 pin |
| **Flow Sensor** | VCC | 5V | 5V | Hall-effect sensor supply |
| **Flow Sensor** | GND | GND | 0V | Ground |
| **Flow Sensor** | Pulse Out | GPIO 25 | 3.3V / 5V | **$10\text{k}\Omega$ Pull-up to 3.3V** |
| **TCS34725 Color** | VCC | 3.3V | 3.3V | Digital colorimeter supply |
| **TCS34725 Color** | GND | GND | 0V | Ground |
| **TCS34725 Color** | SDA | GPIO 21 | 3.3V | **$4.7\text{k}\Omega$ Pull-up to 3.3V** |
| **TCS34725 Color** | SCL | GPIO 22 | 3.3V | **$4.7\text{k}\Omega$ Pull-up to 3.3V** |
| **LED Driver** | Gate | GPIO 12 | 3.3V | **$220\Omega$ Gate resistor to N-MOSFET** |
| **Solenoid Valve** | Gate | GPIO 27 | 3.3V | **Flyback diode (1N4007) across solenoid coil** |

---

## 2. Special Protective Circuitry

### 1. Inductive Flyback Protection (Solenoid Valve)
When the ESP32 cuts power to the 12V Solenoid Valve, the collapsing magnetic field in the coil generates a high-voltage spike. A **1N4007 flyback diode** must be placed in parallel with the solenoid coil (cathode connected to the +12V rail, anode to the MOSFET drain) to clamp these spikes and prevent destruction of the driving N-MOSFET.

### 2. Analog Protection Dividers
Since the Turbidity Sensor and MQ-2 run on 5V, their analog output signals can reach up to 4.5V under certain conditions. The ESP32 pins are only rated for 3.3V. To prevent damage:
* Place a resistor voltage divider ($10\text{k}\Omega$ and $20\text{k}\Omega$) on the analog output line to scale the maximum 5V voltage down to 3.3V.
