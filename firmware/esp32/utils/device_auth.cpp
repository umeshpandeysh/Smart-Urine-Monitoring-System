#include "device_auth.h"

String DeviceAuth::getBearerTokenHeader() {
    // Generate Bearer token string
    #ifdef DEVICE_API_KEY
        return "Bearer " + String(DEVICE_API_KEY);
    #else
        return "Bearer default_key";
    #endif
}
