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
#include "sensors/ph_sensor.h"
#include "sensors/tds_sensor.h"
#include "sensors/turbidity_sensor.h"
#include "sensors/ds18b20_sensor.h"
#include "sensors/mq2_sensor.h"
#include "sensors/flow_sensor.h"
#include "sensors/color_sensor.h"
#include "strip_reader/strip_reader.h"
#include "wifi/wifi_manager.h"
#include "dashboard/dashboard_api.h"
#include "utils/helpers.h"

// Instantiate Sensor Modules
PHSensor phSensor(PIN_PH_PROBE);
TDSSensor tdsSensor(PIN_TDS_PROBE);
TurbiditySensor turbiditySensor(PIN_TURBIDITY_SENSOR);
DS18B20Sensor tempSensor(PIN_DS18B20_BUS);
MQ2Sensor gasSensor(PIN_MQ2_GAS);
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
    
    // Initialize Sensor Objects
    phSensor.begin();
    tdsSensor.begin();
    turbiditySensor.begin();
    tempSensor.begin();
    gasSensor.begin();
    flowSensor.begin();
    colorSensor.begin();

    // Strip Classifier Setup
    StripReader::begin();

    // MQ-2 Preheating & Air Calibration
    gasSensor.calibrateRo();

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

            // Read physical parameters
            float temperature = tempSensor.readTemperatureC();
            float ph = phSensor.readPH(temperature);
            float tds = tdsSensor.readTDS(temperature);
            float turbidity = turbiditySensor.readNTU();
            float gasRatio = gasSensor.readGasRatio();
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
            
            // Store variables temporarily using ESP32 state variables or upload immediately
            bool postSuccess = DashboardAPI::sendTelemetry(logData);
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
            // Placeholder: currently handled synchronously in STATE_OPTICAL_READ.
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
