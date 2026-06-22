# UroSense ESP32 Offline Data Buffering Architecture

This document describes the offline buffering and fallback transmission strategy implemented in the UroSense ESP32 firmware when internet connection is lost.

---

## 1. Buffering Logic Flowchart

```
           [Sensor Sample Completed]
                      │
                      ▼
             {Is WiFi Connected?}
             /                  \
          Yes                    No
          /                        \
         ▼                          ▼
[Post to Ingestion API]    [Serialize to local JSON]
         │                          │
         ▼                          ▼
 {Post Successful?}      [Write to Flash Queue File]
      /      \                      │
   Yes        No                    │
   /            \                   │
  ▼              ▼                  ▼
[Done]    [Write to Queue]    [Wait for WiFi reconnect]
                 │                  │
                 └───────◄──────────┘
                            │
                            ▼
                    {WiFi Restored?}
                            │
                            ▼
                 [Read queue files & upload]
                            │
                            ▼
                  [Clear offline buffer]
```

---

## 2. Storage Media Strategy (SPIFFS / LittleFS)

ESP32 microcontrollers contain an onboard Serial Peripheral Interface Flash File System (SPIFFS) or LittleFS.
For UroSense, **LittleFS** is recommended due to its speed, thread safety, and resilience against power-loss during file write operations.

### Storage Parameters
- **Reserved Partition Size**: 512 KB
- **Format**: Flat JSON Lines (`.jsonl`) or sequential binary telemetry records.
- **Maximum Buffer Size**: 500 records (plenty of capacity for several days of offline sensing).

---

## 3. Flash Serialization Structure

Telemetry objects are stored as flat serialized JSON lines. Example stored file: `/offline_buffer.jsonl`

```json
{"deviceId":"US-NOD-1001","sensors":{"ph":6.1,"tds_ppm":300,"turbidity_ntu":0.4,"temperature_c":36.6,"gas_mq2_raw":17},"timestamp":1782054000}
{"deviceId":"US-NOD-1001","sensors":{"ph":5.3,"tds_ppm":545,"turbidity_ntu":8.8,"temperature_c":37.6,"gas_mq2_raw":61},"timestamp":1782054030}
```

---

## 4. Transmission Backlog Synchronization

Once `WiFiManager::isConnected()` returns `true`, the `APIClient` initiates the backlog clearance sequence:

1. **Open Queue**: Open `/offline_buffer.jsonl` in read mode.
2. **Sequential Upload**:
   - Parse each line.
   - Post to `/api/device/upload` incorporating the stored timestamp.
   - Upon receiving `200 OK` from the server, mark the record as sent.
3. **Buffer Clearance**: Truncate or delete `/offline_buffer.jsonl` once all entries are transmitted.
