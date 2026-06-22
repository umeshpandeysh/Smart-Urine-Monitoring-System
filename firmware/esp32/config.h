#ifndef CONFIG_H
#define CONFIG_H

// ==========================================
// Device Configuration
// ==========================================
#define DEVICE_ID "US-NOD-1001"
#define DEVICE_API_KEY "uro_key_usnod1001_test"

// ==========================================
// Network Settings
// ==========================================
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define BACKEND_API_URL "http://192.168.1.100:3001/api/device/upload"
#define WIFI_TIMEOUT_MS 10000

// ==========================================
// Pin Mappings
// ==========================================
#define PIN_PH_PROBE 32
#define PIN_TDS_PROBE 35
#define PIN_TURBIDITY_SENSOR 34
#define PIN_DS18B20_BUS 4
#define PIN_MQ2_GAS 33
#define PIN_FLOW_SENSOR 25
#define PIN_CHAMBER_LED 12
#define PIN_DRAIN_VALVE 27

// ==========================================
// Sensor Calibration Parameters
// ==========================================
// pH Calibration
#define PH_CAL_VOLT_7 2.00f   // Voltage measured at pH 7.00
#define PH_CAL_VOLT_4 2.65f   // Voltage measured at pH 4.00
#define PH_ADC_RESOLUTION 4095.0f
#define PH_ADC_VREF 3.3f

// TDS Calibration
#define TDS_CAL_FACTOR 1.0f   // Scale factor determined during calibration

// Gas Sensor Calibration (Ro in clean air)
#define MQ2_RO_CLEAN_AIR 10.0f // Target clean air sensor resistance

// ==========================================
// Strip Reader Parameters
// ==========================================
#define STRIP_PAD_COUNT 10
#define COLOR_SENSOR_GAIN 1    // 0 = 1x, 1 = 4x, 2 = 16x, 3 = 64x
#define COLOR_INTEGRATION_TIME 100 // ms

#endif // CONFIG_H
