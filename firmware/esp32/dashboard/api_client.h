#ifndef API_CLIENT_H
#define API_CLIENT_H

#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "../config.h"
#include "../utils/device_auth.h"

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

class APIClient {
public:
    static bool sendTelemetry(const UrineTelemetry& data);
};

#endif // API_CLIENT_H
