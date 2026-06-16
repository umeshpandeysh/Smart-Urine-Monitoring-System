#ifndef PH_SENSOR_H
#define PH_SENSOR_H

#include <Arduino.h>
#include "../config.h"

class PHSensor {
private:
    uint8_t pin;
    float phSlope;
    float phOffset;

public:
    PHSensor(uint8_t analogPin) : pin(analogPin) {
        // Compute pH slope based on pH 4 and pH 7 calibration points
        // pH = 7.0 + (Voltage_7 - Voltage_measured) / Slope
        phSlope = (PH_CAL_VOLT_4 - PH_CAL_VOLT_7) / (4.0f - 7.0f);
        phOffset = PH_CAL_VOLT_7;
    }

    void begin() {
        pinMode(pin, INPUT);
    }

    float readVoltage() {
        int raw = 0;
        // Take 30 samples to average out noise
        for (int i = 0; i < 30; i++) {
            raw += analogRead(pin);
            delay(2);
        }
        float avgRaw = (float)raw / 30.0f;
        return (avgRaw / PH_ADC_RESOLUTION) * PH_ADC_VREF;
    }

    float readPH(float temperatureC) {
        float voltage = readVoltage();
        
        // Temperature-compensated slope correction: standard slope is defined at 25C (298.15K)
        // Nernst equation correction factor: (T_Kelvin / 298.15)
        float tCorrection = (temperatureC + 273.15f) / 298.15f;
        float actualSlope = phSlope * tCorrection;

        if (actualSlope == 0) return 7.0f;
        
        float phValue = 7.0f + (phOffset - voltage) / actualSlope;
        
        // Clamp output to reasonable biological range
        if (phValue < 0.0f) phValue = 0.0f;
        if (phValue > 14.0f) phValue = 14.0f;
        
        return phValue;
    }
};

#endif // PH_SENSOR_H
