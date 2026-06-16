#ifndef TDS_SENSOR_H
#define TDS_SENSOR_H

#include <Arduino.h>
#include "../config.h"

class TDSSensor {
private:
    uint8_t pin;

public:
    TDSSensor(uint8_t analogPin) : pin(analogPin) {}

    void begin() {
        pinMode(pin, INPUT);
    }

    float readVoltage() {
        int raw = 0;
        for (int i = 0; i < 30; i++) {
            raw += analogRead(pin);
            delay(2);
        }
        float avgRaw = (float)raw / 30.0f;
        return (avgRaw / 4095.0f) * 3.3f;
    }

    float readTDS(float temperatureC) {
        float rawVoltage = readVoltage();
        
        // Temperature compensation formula:
        // EC25 = EC_T / (1 + 0.0191 * (T - 25))
        float temperatureCoefficient = 1.0f + 0.0191f * (temperatureC - 25.0f);
        float compensatedVoltage = rawVoltage / temperatureCoefficient;
        
        // Polynomial equation converting compensated voltage to TDS (ppm)
        // Designed for standard analog TDS probe kits
        float tdsValue = (135.6f * pow(compensatedVoltage, 3) 
                          - 55.43f * pow(compensatedVoltage, 2) 
                          + 10.32f * compensatedVoltage) * 0.5f;
                          
        tdsValue *= TDS_CAL_FACTOR;
        
        if (tdsValue < 0.0f) tdsValue = 0.0f;
        return tdsValue;
    }
};

#endif // TDS_SENSOR_H
