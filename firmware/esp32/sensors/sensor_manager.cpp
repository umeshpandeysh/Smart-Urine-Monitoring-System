#include "sensor_manager.h"
#include "ph_sensor.h"
#include "tds_sensor.h"
#include "turbidity_sensor.h"
#include "ds18b20_sensor.h"
#include "mq2_sensor.h"

// Real driver instances can be defined here
static PHSensor* phSensorPtr = nullptr;
static TDSSensor* tdsSensorPtr = nullptr;
static TurbiditySensor* turbiditySensorPtr = nullptr;
static DS18B20Sensor* tempSensorPtr = nullptr;
static MQ2Sensor* gasSensorPtr = nullptr;

void SensorManager::begin() {
    Serial.println("[Sensors] Initializing sensor drivers...");
    
    // Allocate driver instances (mocking or pointing to pins)
    phSensorPtr = new PHSensor(PIN_PH_PROBE);
    tdsSensorPtr = new TDSSensor(PIN_TDS_PROBE);
    turbiditySensorPtr = new TurbiditySensor(PIN_TURBIDITY_SENSOR);
    tempSensorPtr = new DS18B20Sensor(PIN_DS18B20_BUS);
    gasSensorPtr = new MQ2Sensor(PIN_MQ2_GAS);

    // Call begin on each driver
    phSensorPtr->begin();
    tdsSensorPtr->begin();
    turbiditySensorPtr->begin();
    tempSensorPtr->begin();
    gasSensorPtr->begin();
}

SensorData SensorManager::readAllSensors() {
    SensorData data;

    // Use driver methods to read values
    data.temperature = tempSensorPtr ? tempSensorPtr->readTemperatureC() : 36.6f;
    data.ph = phSensorPtr ? phSensorPtr->readPH(data.temperature) : 6.5f;
    data.tds = tdsSensorPtr ? tdsSensorPtr->readTDS(data.temperature) : 350.0f;
    data.turbidity = turbiditySensorPtr ? turbiditySensorPtr->readNTU() : 1.5f;
    data.gas = gasSensorPtr ? gasSensorPtr->readGasRatio() : 20.0f;

    // Boundary check / fallback protection
    if (isnan(data.ph) || data.ph < 0 || data.ph > 14) data.ph = 6.5f;
    if (isnan(data.tds) || data.tds < 0) data.tds = 350.0f;
    if (isnan(data.turbidity) || data.turbidity < 0) data.turbidity = 1.5f;
    if (isnan(data.temperature)) data.temperature = 36.6f;
    if (isnan(data.gas) || data.gas < 0) data.gas = 20.0f;

    return data;
}
