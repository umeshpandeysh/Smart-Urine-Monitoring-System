#include "wifi_manager.h"

void WiFiManager::connect() {
    Serial.println("\n[WIFI] Connecting to network...");
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_TIMEOUT_MS) {
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n[WIFI] Connected successfully!");
        Serial.print("[WIFI] IP Address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\n[WIFI] Connection failed. Will retry in background loop.");
    }
}

bool WiFiManager::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}

void WiFiManager::keepAlive() {
    if (!isConnected()) {
        static unsigned long lastReconnectAttempt = 0;
        unsigned long now = millis();
        // Try reconnecting every 15 seconds if connection is lost
        if (now - lastReconnectAttempt > 15000) {
            lastReconnectAttempt = now;
            Serial.println("[WIFI] Connection lost. Attempting reconnection...");
            WiFi.disconnect();
            WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        }
    }
}
