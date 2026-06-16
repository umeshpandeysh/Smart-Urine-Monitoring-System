#ifndef DASHBOARD_API_H
#define DASHBOARD_API_H

#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "../config.h"
#include "../sensors/color_sensor.h"

struct UrineTelemetry {
    float temperature_c;
    float ph;
    float tds_ppm;
    float turbidity_ntu;
    float gas_ratio;
    float flow_volume_ml;
    
    String glucose;
    String protein;
    String ketones;
    String blood;
    String nitrite;
    String leukocytes;
    float specific_gravity;
    float strip_ph;
    String bilirubin;
    String urobilinogen;
    
    String hydration_status;
};

class DashboardAPI {
public:
    static bool sendTelemetry(const UrineTelemetry& data) {
        if (WiFi.status() != WL_CONNECTED) {
            Serial.println("[API] Cannot send telemetry: WiFi disconnected.");
            return false;
        }

        HTTPClient http;
        http.begin(BACKEND_API_URL);
        http.addHeader("Content-Type", "application/json");

        // Allocate JSON Document
        StaticJsonDocument<1024> doc;
        doc["device_id"] = DEVICE_ID;
        doc["timestamp"] = millis() / 1000; // Simulated timestamp or epoch if synced with NTP

        JsonObject sensors = doc.createNestedObject("sensors");
        sensors["temperature_c"] = data.temperature_c;
        sensors["ph"] = data.ph;
        sensors["tds_ppm"] = data.tds_ppm;
        sensors["turbidity_ntu"] = data.turbidity_ntu;
        sensors["gas_mq2_raw"] = data.gas_ratio;
        sensors["flow_volume_ml"] = data.flow_volume_ml;

        JsonObject strip = doc.createNestedObject("strip_results");
        strip["glucose"] = data.glucose;
        strip["protein"] = data.protein;
        strip["ketones"] = data.ketones;
        strip["blood"] = data.blood;
        strip["nitrite"] = data.nitrite;
        strip["leukocytes"] = data.leukocytes;
        strip["specific_gravity"] = data.specific_gravity;
        strip["ph"] = data.strip_ph;
        strip["bilirubin"] = data.bilirubin;
        strip["urobinilogen"] = data.urobilinogen;

        JsonObject assessment = doc.createNestedObject("assessment");
        assessment["hydration_status"] = data.hydration_status;

        // Add warning flags
        JsonArray flags = assessment.createNestedArray("flags");
        if (data.ph < 5.0f || data.ph > 8.0f) flags.add("Abnormal Urine pH");
        if (data.glucose != "Negative") flags.add("Glycosuria Detected");
        if (data.protein != "Negative") flags.add("Proteinuria Detected");
        if (data.ketones != "Negative") flags.add("Ketosis Detected");
        if (data.turbidity_ntu > 50.0f) flags.add("High Turbidity / Cloudy");

        String requestBody;
        serializeJson(doc, requestBody);

        Serial.print("[API] Sending POST payload: ");
        Serial.println(requestBody);

        int httpResponseCode = http.POST(requestBody);
        bool success = false;

        if (httpResponseCode > 0) {
            Serial.print("[API] Response Code: ");
            Serial.println(httpResponseCode);
            String response = http.getString();
            Serial.print("[API] Response: ");
            Serial.println(response);
            success = (httpResponseCode == 200 || httpResponseCode == 201);
        } else {
            Serial.print("[API] Error on sending POST: ");
            Serial.println(http.errorToString(httpResponseCode).c_str());
        }

        http.end();
        return success;
    }
};

#endif // DASHBOARD_API_H
