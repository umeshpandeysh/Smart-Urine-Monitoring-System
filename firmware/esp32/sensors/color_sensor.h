#ifndef COLOR_SENSOR_H
#define COLOR_SENSOR_H

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_TCS34725.h>
#include "../config.h"

struct RGBCColor {
    uint16_t r;
    uint16_t g;
    uint16_t b;
    uint16_t c;
    float norm_r;
    float norm_g;
    float norm_b;
};

class ColorSensor {
private:
    Adafruit_TCS34725 tcs;
    bool isInitialized;

public:
    ColorSensor() : isInitialized(false) {
        // Initialize with default integration time and gain from config
        tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_101MS, TCS34725_GAIN_4X);
    }

    bool begin() {
        if (tcs.begin()) {
            isInitialized = true;
            Serial.println("[INFO] TCS34725 Color Sensor found.");
            return true;
        } else {
            Serial.println("[ERROR] No TCS34725 found ... check your wiring!");
            isInitialized = false;
            return false;
        }
    }

    RGBCColor readColor() {
        RGBCColor color = {0, 0, 0, 0, 0.0f, 0.0f, 0.0f};
        if (!isInitialized) return color;

        tcs.getRawData(&color.r, &color.g, &color.b, &color.c);
        
        // Prevent division-by-zero if clear reading is 0
        uint32_t sum = (uint32_t)color.r + (uint32_t)color.g + (uint32_t)color.b;
        if (sum > 0) {
            color.norm_r = (float)color.r / (float)sum;
            color.norm_g = (float)color.g / (float)sum;
            color.norm_b = (float)color.b / (float)sum;
        } else {
            color.norm_r = 0.0f;
            color.norm_g = 0.0f;
            color.norm_b = 0.0f;
        }
        return color;
    }

    // Toggle white LED for illuminated optical environment
    void setLED(bool state) {
        // Many TCS breakout boards pull the LED pin high by default.
        // It can be controlled via GPIO if connected.
        digitalWrite(PIN_CHAMBER_LED, state ? HIGH : LOW);
    }
};

#endif // COLOR_SENSOR_H
