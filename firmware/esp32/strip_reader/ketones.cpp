#include "strip_reader.h"

// Define ketones color reference maps (Negative, Trace, Moderate, High)
ColorReference StripReader::ketonesRefs[4] = {
    {"Negative", 0.45f, 0.42f, 0.13f}, // Beige / pale buff
    {"Trace", 0.46f, 0.38f, 0.16f},    // Pinkish-buff
    {"Moderate", 0.48f, 0.30f, 0.22f}, // Violet/purple-pink
    {"High", 0.49f, 0.20f, 0.31f}      // Dark violet
};

String StripReader::classifyKetones(const RGBCColor& sample) {
    float minDist = 999.0f;
    int bestMatch = 0;

    for (int i = 0; i < 4; i++) {
        float dist = computeDistance(sample.norm_r, sample.norm_g, sample.norm_b,
                                     ketonesRefs[i].norm_r, ketonesRefs[i].norm_g, ketonesRefs[i].norm_b);
        if (dist < minDist) {
            minDist = dist;
            bestMatch = i;
        }
    }

    if (minDist > 0.15f) {
        return "Inconclusive (" + ketonesRefs[bestMatch].label + ")";
    }

    return ketonesRefs[bestMatch].label;
}

// ----------------------------------------------------
// Mock Implementations for other 10-parameter strip options
// ----------------------------------------------------

String StripReader::classifyBlood(const RGBCColor& sample) {
    // Standard reaction: orange-to-blue/green. Mocking negative for baseline
    if (sample.norm_g > 0.45f && sample.norm_r < 0.35f) {
        return "Positive";
    }
    return "Negative";
}

String StripReader::classifyNitrite(const RGBCColor& sample) {
    // Standard reaction: white-to-bright pink. Mocking negative
    if (sample.norm_r > 0.50f && sample.norm_g > 0.30f && sample.norm_b > 0.30f) {
        // High red reflection + medium blue reflection (pinkish)
        if (sample.norm_b > 0.25f) return "Positive";
    }
    return "Negative";
}

String StripReader::classifyLeukocytes(const RGBCColor& sample) {
    // Standard reaction: white-to-purple. Mocking negative
    if (sample.norm_b > 0.30f && sample.norm_r > 0.40f) {
        return "Positive (+1)";
    }
    return "Negative";
}

float StripReader::calculateSpecificGravity(const RGBCColor& sample) {
    // Standard reaction: blue/green (1.000) to yellow (1.030)
    // Low blue + high red/green means yellow (higher SG)
    float ratio = sample.norm_r / (sample.norm_b + 0.01f);
    if (ratio > 2.5f) return 1.025f;
    if (ratio > 1.8f) return 1.015f;
    return 1.005f;
}

float StripReader::calculatePH(const RGBCColor& sample) {
    // pH ranges from orange (5.0) to green (7.0) to blue (9.0)
    if (sample.norm_b > 0.30f) return 8.0f;
    if (sample.norm_g > 0.45f) return 6.5f;
    return 5.5f;
}

String StripReader::classifyBilirubin(const RGBCColor& sample) {
    // Pale pink to peach/tan. Mocking negative
    return "Negative";
}

String StripReader::classifyUrobilinogen(const RGBCColor& sample) {
    // Light pink to dark red. Mocking normal (0.2 mg/dL)
    return "Normal (0.2 mg/dL)";
}
