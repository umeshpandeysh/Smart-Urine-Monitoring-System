#ifndef MQ2_SENSOR_H
#define MQ2_SENSOR_H

#include <Arduino.h>
#include "../config.h"

class MQ2Sensor {
private:
    uint8_t pin;
    float ro;

public:
    MQ2Sensor(uint8_t analogPin) : pin(analogPin), ro(MQ2_RO_CLEAN_AIR) {}

    void begin() {
        pinMode(pin, INPUT);
    }

    float readVoltage() {
        int raw = 0;
        for (int i = 30; i > 0; i--) {
            raw += analogRead(pin);
            delay(2);
        }
        float avgRaw = (float)raw / 30.0f;
        return (avgRaw / 4095.0f) * 3.3f;
    }

    // Calculate sensor resistance Rs from analog voltage
    float getRs() {
        float voltage = readVoltage();
        if (voltage >= 3.3f) return 0.1f; // Avoid divide-by-zero
        if (voltage <= 0.05f) return 100.0f;
        
        // Rs = (Vcc - Vc) * R_load / Vc, assuming R_load is 5.0 kOhms
        // Adjust for resistor divider scaling if applicable
        float rs = (3.3f - voltage) * 5.0f / voltage;
        return rs;
    }

    // Returns resistance ratio Rs/Ro
    // Low values indicate high concentrations of combustible/organic gases (odor/acetone)
    float readGasRatio() {
        float rs = getRs();
        return rs / ro;
    }

    void calibrateRo() {
        float sumRs = 0;
        Serial.println("[INFO] Calibrating MQ-2 Gas Sensor in clean air...");
        for (int i = 0; i < 50; i++) {
            sumRs += getRs();
            delay(100);
        }
        float avgRs = sumRs / 50.0f;
        
        // Ro = Rs / 9.83 (9.83 is MQ-2 air constant ratio)
        ro = avgRs / 9.83f;
        Serial.print("[INFO] Calibration complete. Ro: ");
        Serial.print(ro);
        Serial.println(" kOhm");
    }
};

#endif // MQ2_SENSOR_H
