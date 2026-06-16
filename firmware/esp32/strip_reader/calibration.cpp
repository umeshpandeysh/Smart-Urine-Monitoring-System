#include "strip_reader.h"

void StripReader::begin() {
    Serial.println("[INFO] Reagent Strip Reader Initialized.");
}

void StripReader::updateCalibration(const String& parameter, int index, float r, float g, float b) {
    if (index < 0 || index >= 4) return;
    
    // Normalize coordinates
    float sum = r + g + b;
    if (sum <= 0) return;
    
    float nr = r / sum;
    float ng = g / sum;
    float nb = b / sum;

    if (parameter.equalsIgnoreCase("glucose")) {
        glucoseRefs[index].norm_r = nr;
        glucoseRefs[index].norm_g = ng;
        glucoseRefs[index].norm_b = nb;
        Serial.print("[CALIB] Updated glucose reference [");
        Serial.print(index);
        Serial.print("] to R:");
        Serial.print(nr);
        Serial.print(" G:");
        Serial.println(ng);
    } else if (parameter.equalsIgnoreCase("protein")) {
        proteinRefs[index].norm_r = nr;
        proteinRefs[index].norm_g = ng;
        proteinRefs[index].norm_b = nb;
    } else if (parameter.equalsIgnoreCase("ketones")) {
        ketonesRefs[index].norm_r = nr;
        ketonesRefs[index].norm_g = ng;
        ketonesRefs[index].norm_b = nb;
    }
}
