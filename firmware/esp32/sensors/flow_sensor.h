#ifndef FLOW_SENSOR_H
#define FLOW_SENSOR_H

#include <Arduino.h>
#include "../config.h"

class FlowSensor {
private:
    uint8_t pin;
    static volatile uint32_t pulseCount;
    unsigned long lastTime;
    float calibrationFactor;

    static IRAM_ATTR void pulseCounterISR() {
        pulseCount++;
    }

public:
    FlowSensor(uint8_t interruptPin) 
        : pin(interruptPin), calibrationFactor(7.5f), lastTime(0) {}

    void begin() {
        pinMode(pin, INPUT_PULLUP);
        pulseCount = 0;
        attachInterrupt(digitalPinToInterrupt(pin), pulseCounterISR, RISING);
        lastTime = millis();
    }

    void reset() {
        noInterrupts();
        pulseCount = 0;
        interrupts();
        lastTime = millis();
    }

    uint32_t getPulseCount() {
        uint32_t count;
        noInterrupts();
        count = pulseCount;
        interrupts();
        return count;
    }

    // Returns cumulative fluid volume passed through sensor in milliliters
    float getVolumeML() {
        uint32_t pulses = getPulseCount();
        // Standard YF-S201: 450 pulses per Liter
        return ((float)pulses / 450.0f) * 1000.0f;
    }

    // Returns instantaneous flow rate in Liters/minute
    float getFlowRateLMin() {
        unsigned long now = millis();
        unsigned long duration = now - lastTime;
        if (duration < 100) return 0.0f; // Prevent division issues

        uint32_t pulses;
        noInterrupts();
        pulses = pulseCount;
        pulseCount = 0; // Reset for next reading window
        interrupts();

        lastTime = now;
        
        // Flow rate (L/min) = (pulses / duration_sec) / calibrationFactor
        float flowRate = ((float)pulses / ((float)duration / 1000.0f)) / calibrationFactor;
        return flowRate;
    }
};

// Initialize static member variable
volatile uint32_t FlowSensor::pulseCount = 0;

#endif // FLOW_SENSOR_H
