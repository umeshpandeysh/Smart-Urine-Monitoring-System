#include "strip_reader.h"

// Define protein color reference maps (Negative, Trace, Moderate, High)
ColorReference StripReader::proteinRefs[4] = {
    {"Negative", 0.38f, 0.44f, 0.18f}, // Pale yellow-green
    {"Trace", 0.32f, 0.48f, 0.20f},    // Yellow-green tint
    {"Moderate", 0.25f, 0.52f, 0.23f}, // Greenish
    {"High", 0.18f, 0.55f, 0.27f}      // Blue-green
};

String StripReader::classifyProtein(const RGBCColor& sample) {
    float minDist = 999.0f;
    int bestMatch = 0;

    for (int i = 0; i < 4; i++) {
        float dist = computeDistance(sample.norm_r, sample.norm_g, sample.norm_b,
                                     proteinRefs[i].norm_r, proteinRefs[i].norm_g, proteinRefs[i].norm_b);
        if (dist < minDist) {
            minDist = dist;
            bestMatch = i;
        }
    }

    if (minDist > 0.15f) {
        return "Inconclusive (" + proteinRefs[bestMatch].label + ")";
    }

    return proteinRefs[bestMatch].label;
}
