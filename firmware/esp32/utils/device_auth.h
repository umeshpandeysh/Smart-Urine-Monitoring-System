#ifndef DEVICE_AUTH_H
#define DEVICE_AUTH_H

#include <Arduino.h>
#include "../config.h"

class DeviceAuth {
public:
    static String getBearerTokenHeader();
};

#endif // DEVICE_AUTH_H
