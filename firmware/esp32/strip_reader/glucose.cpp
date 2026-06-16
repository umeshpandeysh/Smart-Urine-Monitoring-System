#include "strip_reader.h"

// Define glucose color reference maps (Negative, Trace, Moderate, High)
// Chromaticities are normalized (R, G, B should sum to 1.0)
ColorReference StripReader::glucoseRefs[4] = {
    {"Negative", 0.25f, 0.55f, 0.20f}, // Greenish-blue shade
    {"Trace", 0.35f, 0.45f, 0.20f},    // Light yellowish green
    {"Moderate", 0.45f, 0.38f, 0.17f}, // Brownish orange
    {"High", 0.58f, 0.28f, 0.14f}      // Dark brown
};

float StripReader::computeDistance(float r1, float g1, float b1, float r2, float g2, float b2) {
    return sqrt(pow(r1 - r2, 2) + pow(g1 - g2, 2) + pow(b1 - b2, 2));
}

String StripReader::classifyGlucose(const RGBCColor& sample) {
    float minDist = 999.0f;
    int bestMatch = 0;

    for (int i = 0; i < 4; i++) {
        float dist = computeDistance(sample.norm_r, sample.norm_g, sample.norm_b,
                                     glucoseRefs[i].norm_r, glucoseRefs[i].norm_g, glucoseRefs[i].norm_b);
        if (dist < minDist) {
            minDist = dist;
            bestMatch = i;
        }
    }

    // Flag outlier readings (e.g. if the nearest match is too distant)
    if (minDist > 0.15f) {
        return "Inconclusive (" + glucoseRefs[bestMatch].label + ")";
    }

    return glucoseRefs[bestMatch].label;
}
