#ifndef DS18B20_SENSOR_H
#define DS18B20_SENSOR_H

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "../config.h"

class DS18B20Sensor {
private:
    uint8_t pin;
    OneWire oneWire;
    DallasTemperature sensors;

public:
    DS18B20Sensor(uint8_t oneWirePin) 
        : pin(oneWirePin), oneWire(oneWirePin), sensors(&oneWire) {}

    void begin() {
        sensors.begin();
        sensors.setResolution(12); // Use 12-bit resolution for 0.0625°C precision
    }

    float readTemperatureC() {
        sensors.requestTemperatures();
        float tempC = sensors.getTempCByIndex(0);
        
        // Handle sensor disconnect (-127°C is returned by Dallas library on error)
        if (tempC == DEVICE_DISCONNECTED_C) {
            Serial.println("[ERROR] DS18B20 Temperature Sensor Disconnected! Returning 37.0°C default.");
            return 37.0f; // Default body temperature fallback
        }
        return tempC;
    }
};

#endif // DS18B20_SENSOR_H
