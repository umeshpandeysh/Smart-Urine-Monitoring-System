#ifndef STRIP_READER_H
#define STRIP_READER_H

#include <Arduino.h>
#include "../sensors/color_sensor.h"

// Struct representing a calibration color coordinate point
struct ColorReference {
    String label;
    float norm_r;
    float norm_g;
    float norm_b;
};

// Main strip reader processor
class StripReader {
private:
    // Reference color arrays for the 3 sample parameters
    static ColorReference glucoseRefs[4];
    static ColorReference proteinRefs[4];
    static ColorReference ketonesRefs[4];

    // Helper to compute Euclidean distance between two normalized RGB coordinates
    static float computeDistance(float r1, float g1, float b1, float r2, float g2, float b2);

public:
    static void begin();
    
    // Core classification functions
    static String classifyGlucose(const RGBCColor& sample);
    static String classifyProtein(const RGBCColor& sample);
    static String classifyKetones(const RGBCColor& sample);

    // Mock functions for other 10-parameter targets to complete interface compatibility
    static String classifyBlood(const RGBCColor& sample);
    static String classifyNitrite(const RGBCColor& sample);
    static String classifyLeukocytes(const RGBCColor& sample);
    static float calculateSpecificGravity(const RGBCColor& sample);
    static float calculatePH(const RGBCColor& sample);
    static String classifyBilirubin(const RGBCColor& sample);
    static String classifyUrobilinogen(const RGBCColor& sample);

    // Dynamic calibration updates
    static void updateCalibration(const String& parameter, int index, float r, float g, float b);
};

#endif // STRIP_READER_H
