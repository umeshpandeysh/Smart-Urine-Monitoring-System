#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>
#include "../config.h"

class WiFiManager {
public:
    static void connect();
    static bool isConnected();
    static void keepAlive();
};

#endif // WIFI_MANAGER_H
