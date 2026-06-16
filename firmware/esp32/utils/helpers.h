#ifndef HELPERS_H
#define HELPERS_H

#include <Arduino.h>

class Helpers {
public:
    // Assess hydration status using TDS/EC and specific gravity
    static String evaluateHydration(float tdsPpm) {
        // High TDS indicates highly concentrated urine, a sign of dehydration
        // Normal range is typically 200 - 800 ppm
        if (tdsPpm < 150.0f) {
            return "Overhydrated / Dilute";
        } else if (tdsPpm >= 150.0f && tdsPpm < 550.0f) {
            return "Optimal Hydration";
        } else if (tdsPpm >= 550.0f && tdsPpm < 850.0f) {
            return "Mildly Dehydrated";
        } else {
            return "Dehydrated - Increase Fluid Intake";
        }
    }

    // Format float values to readable strings
    static String formatFloat(float value, int decimalPlaces) {
        char buffer[16];
        dtostrf(value, 4, decimalPlaces, buffer);
        return String(buffer);
    }
};

#endif // HELPERS_H
