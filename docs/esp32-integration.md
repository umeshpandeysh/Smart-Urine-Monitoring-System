# UroSense ESP32 Hardware Integration Guide

This guide details the API specification and provides resources for connecting ESP32 microcontroller units (MCUs) to the UroSense Smart Urine Monitoring System.

---

## 1. API Architecture

UroSense provides two main ingestion endpoints under `http://<server-ip>:3001`:

1. **Production Device Upload (`/api/device/upload`)**
   - **Authentication**: Required (via Bearer token matching `device_api_keys`).
   - **Use Case**: Real ESP32 hardware streaming telemetry.
   - **Method**: `POST`
   - **Content-Type**: `application/json`

2. **Manual Test Upload (`/api/device/test-upload`)**
   - **Authentication**: Disabled (for simple manual/simulation testing).
   - **Use Case**: Postman, curl, or simulator testing without needing active database keys.
   - **Method**: `POST`
   - **Content-Type**: `application/json`

---

## 2. Ingestion Request Format

The backend accepts two formats of JSON payload structure:

### Option A: Flat Payload Format
```json
{
  "deviceId": "US-NOD-1001",
  "ph": 6.80,
  "tds": 340.00,
  "turbidity": 2.00,
  "temperature": 36.20,
  "gasValue": 18.00,
  "phone": "+919999999999"
}
```

### Option B: Nested Firmware Format (TCS34725/Sensors Sub-object)
```json
{
  "deviceId": "US-NOD-1001",
  "sensors": {
    "ph": 6.80,
    "tds_ppm": 340.00,
    "turbidity_ntu": 2.00,
    "temperature_c": 36.20,
    "gas_mq2_raw": 18.00
  },
  "phone": "+919999999999"
}
```

### Key Parameter Mappings
| Flat Parameter | Nested (Firmware) Parameter | Unit / Description |
| :--- | :--- | :--- |
| `deviceId` | `deviceId` or `deviceCode` | Registered device code in database (e.g., `US-NOD-1001`) |
| `ph` | `sensors.ph` | Urine pH value (0.00 - 14.00) |
| `tds` | `sensors.tds_ppm` | Total Dissolved Solids in parts per million (ppm) |
| `turbidity` | `sensors.turbidity_ntu` | Volumetric clarity in Nephelometric Turbidity Units (NTU) |
| `temperature`| `sensors.temperature_c` | Thermal sensor value in Celsius (°C) |
| `gasValue` | `sensors.gas_mq2_raw` | MQ-2 volatile compound level / ratio |
| `phone` | `phone` | (Optional) Links report to patient profile by phone number (Default: `+919999999999`) |

---

## 3. API Response Structure (200 OK)

A successful ingestion generates a clinical report immediately and returns the document metadata:

```json
{
  "success": true,
  "reportId": "d4e89cab-1bb0-4945-a503-31180a30b5fc",
  "findings": {
    "utiRisk": "Low",
    "kidneyStress": "Low",
    "overallScore": 100,
    "hydrationStatus": "Optimal Hydration",
    "glucoseIndicator": "Negative",
    "proteinIndicator": "Negative",
    "recommendations": [
      "Hydration parameters are optimal. Maintain your current daily fluid intake."
    ]
  },
  "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http%3A%2F%2Flocalhost%3A3000%2Freport%2Fd4e89cab-1bb0-4945-a503-31180a30b5fc",
  "pdfUrl": ""
}
```

---

## 4. API Integration Examples

### curl (Manual Test Upload)
```bash
curl -X POST http://localhost:3001/api/device/test-upload \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "US-NOD-1001",
    "ph": 6.80,
    "tds": 340.00,
    "turbidity": 2.00,
    "temperature": 36.20,
    "gasValue": 18.00,
    "phone": "+919999999999"
  }'
```

### curl (Authenticated Production Upload)
```bash
curl -X POST http://localhost:3001/api/device/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer uro_key_usnod1001_test" \
  -d '{
    "deviceId": "US-NOD-1001",
    "ph": 6.80,
    "tds": 340.00,
    "turbidity": 2.00,
    "temperature": 36.20,
    "gasValue": 18.00,
    "phone": "+919999999999"
  }'
```

---

## 5. Sample Arduino Code (ESP32)

Below is a complete Arduino sketch configured to send sensor telemetry from an ESP32 to the UroSense server.

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// UroSense Server Configuration
const char* serverUrl = "http://<SERVER_IP>:3001/api/device/upload";
const char* deviceApiKey = "uro_key_usnod1001_test"; // Set from device_api_keys table
const char* deviceId = "US-NOD-1001";

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected successfully!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // 1. Simulate reading sensor values
    float simulatedPH = 6.4 + ((random(-20, 20)) / 100.0);
    float simulatedTDS = 350.0 + random(-10, 10);
    float simulatedTurbidity = 1.4 + ((random(0, 10)) / 10.0);
    float simulatedTemp = 36.6 + ((random(-5, 5)) / 10.0);
    float simulatedGas = 20.0 + random(-2, 2);

    // 2. Prepare JSON body
    StaticJsonDocument<512> doc;
    doc["deviceId"] = deviceId;
    doc["phone"] = "+919999999999"; // Fallback patient account
    
    JsonObject sensors = doc.createNestedObject("sensors");
    sensors["ph"] = simulatedPH;
    sensors["tds_ppm"] = simulatedTDS;
    sensors["turbidity_ntu"] = simulatedTurbidity;
    sensors["temperature_c"] = simulatedTemp;
    sensors["gas_mq2_raw"] = simulatedGas;

    String jsonString;
    serializeJson(doc, jsonString);

    // 3. Setup HTTP Connection
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Add Bearer Token Authentication header
    String authHeaderVal = "Bearer " + String(deviceApiKey);
    http.addHeader("Authorization", authHeaderVal.c_str());

    // 4. Send POST request
    Serial.println("\nSending telemetry payload to UroSense...");
    Serial.println(jsonString);
    
    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("Response Code: ");
      Serial.println(httpResponseCode);
      Serial.println("Response Payload: ");
      Serial.println(response);
    } else {
      Serial.print("Error during POST request: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected. Reconnecting...");
    WiFi.begin(ssid, password);
  }

  // Stream data every 30 seconds
  delay(30000);
}
```

---

## 6. End-to-End Simulation Instructions

To simulate the hardware flow on your local system, we have provided a simulated test suite script.

1. Ensure the development server is active at `http://localhost:3001`.
2. Run the Node hardware simulation script to generate and submit mock sensor streams:
   ```bash
   npx tsx scripts/device-simulator.ts
   ```
3. Open the **Patient Portal** (`/patient-portal`) or **Admin Portal** (`/admin-center`) to view the newly created urine screening reports and live device status.
