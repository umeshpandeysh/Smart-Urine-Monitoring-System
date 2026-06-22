/**
 * Smart Urine Monitoring System - ESP32 Firmware
 * 
 * Target Board: ESP32 Dev Module
 * 
 * Flow:
 * 1. Initialize sensors, I2C bus, WiFi client.
 * 2. Idle State: Wait for flow sensor pulses indicating sample entrance.
 * 3. Fill State: Wait for flow to halt and volume to reach threshold (>150ml).
 * 4. Sample State: Take multi-sample average of physical sensors (pH, TDS, Temp, Turbidity).
 * 5. Optical State: Toggle LED, read TCS34725 color sensor for 10-parameter strip analysis.
 * 6. Transmission State: Connect WiFi and post JSON telemetry payload to Dashboard server.
 * 7. Flush State: Open drain valve to clean physical chamber.
 * 8. Sleep/Timeout: Deep sleep or low-power idle.
 */

#include "config.h"
#include "sensors/sensor_manager.h"
#include "sensors/flow_sensor.h"
#include "sensors/color_sensor.h"
#include "strip_reader/strip_reader.h"
#include "wifi/wifi_manager.h"
#include "dashboard/api_client.h"
#include "utils/helpers.h"

// Instantiate Core Modules
FlowSensor flowSensor(PIN_FLOW_SENSOR);
ColorSensor colorSensor;

// State Machine States
enum SystemState {
    STATE_IDLE,
    STATE_ACQUIRING,
    STATE_OPTICAL_READ,
    STATE_TRANSMITTING,
    STATE_FLUSHING
};

SystemState currentState = STATE_IDLE;
unsigned long stateTimer = 0;

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n=============================================");
    Serial.println("   SMART URINE MONITORING SYSTEM INITIALIZING ");
    Serial.println("=============================================");

    // Pin Configurations
    pinMode(PIN_CHAMBER_LED, OUTPUT);
    pinMode(PIN_DRAIN_VALVE, OUTPUT);
    digitalWrite(PIN_CHAMBER_LED, LOW);
    digitalWrite(PIN_DRAIN_VALVE, LOW); // Closed

    // Initialize I2C and Dallas Bus
    Wire.begin(21, 22); // SDA, SCL
    
    // Initialize Sensor Manager (Abstraction Layer)
    SensorManager::begin();

    // Initialize Flow & Color Sensors
    flowSensor.begin();
    colorSensor.begin();

    // Strip Classifier Setup
    StripReader::begin();

    // Network Setup
    WiFiManager::connect();

    Serial.println("[SYSTEM] Setup complete. Entering STATE_IDLE. Waiting for flow...");
}

void loop() {
    // Keep WiFi connection alive in background
    WiFiManager::keepAlive();

    switch (currentState) {
        
        case STATE_IDLE: {
            // Check for flow sensor activity indicating a sample is arriving
            float currentFlowRate = flowSensor.getFlowRateLMin();
            if (currentFlowRate > 0.05f) {
                Serial.println("[STATE] Flow detected. Transitioning to STATE_ACQUIRING.");
                flowSensor.reset();
                currentState = STATE_ACQUIRING;
                stateTimer = millis();
            }
            break;
        }

        case STATE_ACQUIRING: {
            // Wait for flow to stop (no pulses for 5 seconds) and verify minimum volume
            float flowRate = flowSensor.getFlowRateLMin();
            float volume = flowSensor.getVolumeML();

            if (flowRate <= 0.01f && (millis() - stateTimer > 5000)) {
                Serial.print("[STATE] Sample stable. Volume collected: ");
                Serial.print(volume);
                Serial.println(" mL.");
                
                if (volume > 50.0f) { // Require minimum volume to run analysis
                    Serial.println("[STATE] Transitioning to STATE_OPTICAL_READ.");
                    currentState = STATE_OPTICAL_READ;
                } else {
                    Serial.println("[WARNING] Insufficient sample volume. Flushing and returning to IDLE.");
                    currentState = STATE_FLUSHING;
                }
                stateTimer = millis();
            }
            break;
        }

        case STATE_OPTICAL_READ: {
            Serial.println("[STATE] Performing sensor data acquisition & optical colorimetric scan...");
            
            // Turn on chamber illumination
            colorSensor.setLED(true);
            delay(1000); // Allow light sensor to adapt

            // Read physical parameters from Sensor Manager
            SensorData sensorVals = SensorManager::readAllSensors();
            float temperature = sensorVals.temperature;
            float ph = sensorVals.ph;
            float tds = sensorVals.tds;
            float turbidity = sensorVals.turbidity;
            float gasRatio = sensorVals.gas;
            float finalVolume = flowSensor.getVolumeML();

            // Perform optical scan of reagent strip (simulate manual mechanical indexer delay)
            Serial.println("[STRIP] Reading reagent strip color signatures...");
            RGBCColor colorData = colorSensor.readColor();
            
            // Turn off light chamber
            colorSensor.setLED(false);

            // Populate Transmission Struct
            UrineTelemetry logData;
            logData.temperature_c = temperature;
            logData.ph = ph;
            logData.tds_ppm = tds;
            logData.turbidity_ntu = turbidity;
            logData.gas_ratio = gasRatio;
            logData.flow_volume_ml = finalVolume;

            // Run classifications
            logData.glucose = StripReader::classifyGlucose(colorData);
            logData.protein = StripReader::classifyProtein(colorData);
            logData.ketones = StripReader::classifyKetones(colorData);
            
            // Re-use color signature mock analysis for remaining parameters
            logData.blood = StripReader::classifyBlood(colorData);
            logData.nitrite = StripReader::classifyNitrite(colorData);
            logData.leukocytes = StripReader::classifyLeukocytes(colorData);
            logData.specific_gravity = StripReader::calculateSpecificGravity(colorData);
            logData.strip_ph = StripReader::calculatePH(colorData);
            logData.bilirubin = StripReader::classifyBilirubin(colorData);
            logData.urobilinogen = StripReader::classifyUrobilinogen(colorData);

            // General health indicators
            logData.hydration_status = Helpers::evaluateHydration(tds);

            // Push to Dashboard Backend
            currentState = STATE_TRANSMITTING;
            
            // Send telemetry using APIClient
            bool postSuccess = APIClient::sendTelemetry(logData);
            if (postSuccess) {
                Serial.println("[API] Telemetry sent successfully!");
            } else {
                Serial.println("[API] Failed to post telemetry. Cached data locally.");
            }

            currentState = STATE_FLUSHING;
            stateTimer = millis();
            break;
        }

        case STATE_TRANSMITTING:
            currentState = STATE_FLUSHING;
            break;

        case STATE_FLUSHING: {
            Serial.println("[STATE] Flushing sensing chamber. Opening drain valve...");
            digitalWrite(PIN_DRAIN_VALVE, HIGH); // Open valve
            delay(6000);                         // Drain for 6 seconds
            digitalWrite(PIN_DRAIN_VALVE, LOW);  // Close valve
            
            // Reset flow calculations for next user cycle
            flowSensor.reset();

            Serial.println("[STATE] Chamber clean. Returning to STATE_IDLE.");
            currentState = STATE_IDLE;
            break;
        }
    }

    delay(100); // 10Hz Tick Rate
}
