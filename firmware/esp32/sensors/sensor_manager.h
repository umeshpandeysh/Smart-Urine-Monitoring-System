#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Arduino.h>
#include "../config.h"

struct SensorData {
    float ph;
    float tds;
    float turbidity;
    float temperature;
    float gas;
};

class SensorManager {
public:
    static void begin();
    static SensorData readAllSensors();
};

#endif // SENSOR_MANAGER_H
