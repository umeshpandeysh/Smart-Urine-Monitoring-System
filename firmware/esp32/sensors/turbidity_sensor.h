#ifndef TURBIDITY_SENSOR_H
#define TURBIDITY_SENSOR_H

#include <Arduino.h>
#include "../config.h"

class TurbiditySensor {
private:
    uint8_t pin;

public:
    TurbiditySensor(uint8_t analogPin) : pin(analogPin) {}

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
        // Typically output voltage ranges up to 4.5V, scaled down for ESP32
        return (avgRaw / 4095.0f) * 3.3f * (5.0f / 3.3f); // Compensating divider if used
    }

    float readNTU() {
        float voltage = readVoltage();
        
        // Characteristic curve equation for SEN0189 turbidity sensor:
        // NTU = -1120.4 * V^2 + 5742.3 * V - 4352.9
        float ntu = -1120.4f * pow(voltage, 2) + 5742.3f * voltage - 4352.9f;
        
        if (ntu < 0.0f) ntu = 0.0f;
        if (voltage >= 4.1f) ntu = 0.0f; // High voltage represents pure clear water
        
        return ntu;
    }
};

#endif // TURBIDITY_SENSOR_H
