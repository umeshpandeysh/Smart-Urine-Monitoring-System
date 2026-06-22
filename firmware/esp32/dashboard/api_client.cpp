#include "api_client.h"

bool APIClient::sendTelemetry(const UrineTelemetry& data) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[API] Cannot send telemetry: WiFi disconnected.");
        return false;
    }

    HTTPClient http;
    http.begin(BACKEND_API_URL);
    http.addHeader("Content-Type", "application/json");

    // Add API key authentication using DeviceAuth
    http.addHeader("Authorization", DeviceAuth::getBearerTokenHeader().c_str());

    // Allocate JSON Document
    StaticJsonDocument<1024> doc;
    doc["deviceId"] = DEVICE_ID;
    
    // Support nested sensors structure mapping
    JsonObject sensors = doc.createNestedObject("sensors");
    sensors["ph"] = data.ph;
    sensors["tds_ppm"] = data.tds_ppm;
    sensors["turbidity_ntu"] = data.turbidity_ntu;
    sensors["temperature_c"] = data.temperature_c;
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
    strip["urobilinogen"] = data.urobilinogen;

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
