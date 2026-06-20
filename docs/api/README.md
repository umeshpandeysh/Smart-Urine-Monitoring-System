# API Reference

## Authentication

All protected endpoints require a valid Supabase session JWT. This is automatically included via `httpOnly` cookies when using the browser SDK.

For device-to-server telemetry, use the `x-api-key` header with your `TELEMETRY_INGEST_API_KEY`.

---

## Endpoints

### POST `/api/v1/telemetry`
Ingest sensor readings from ESP32 devices.

**Headers**: `x-api-key: <TELEMETRY_INGEST_API_KEY>`

**Body**:
```json
{
  "device_id": "uuid",
  "api_key": "string",
  "readings": {
    "ph": 6.2,
    "tds_ppm": 340,
    "turbidity_ntu": 12,
    "temperature_c": 36.5,
    "flow_rate_ml_min": 18.4,
    "total_volume_ml": 250,
    "color_r": 45234,
    "color_g": 38921,
    "color_b": 12045,
    "hydration_index": 72.5
  },
  "device_health": {
    "cpu_temp": 42.1,
    "wifi_rssi": -65,
    "free_heap": 180000,
    "uptime_seconds": 86400
  },
  "recorded_at": "2026-06-20T09:00:00Z"
}
```

**Response**: `201 Created`
```json
{ "success": true, "reading_id": "uuid" }
```

---

### GET `/api/v1/reports/:id`
Fetch a single report with its sensor reading.

**Auth**: Session JWT required

**Response**: `200 OK`
```json
{ "data": { "id": "uuid", "title": "...", "ai_summary": "...", ... } }
```

---

### GET `/api/v1/reports/:id/pdf`
Download the signed PDF report.

**Auth**: Session JWT required  
**Response**: Redirect to Supabase Storage signed URL

---

### POST `/api/auth/signout`
Sign out the current user and clear session cookies.

**Response**: Redirect to `/login`

---

## Supabase Direct Queries

The application uses `@supabase/ssr` for all database operations. Key tables:

| Table | Access |
| :--- | :--- |
| `profiles` | Self (patient), All (admin) |
| `sensor_readings` | Own profile (patient), All (admin/operator) |
| `reports` | Own profile (patient), All (admin) |
| `notifications` | Own profile only |
| `devices` | Admin + operator only |
| `device_telemetry` | Admin + operator only |

See [RLS Policies](../architecture/phase-13-foundation.md) for full security rules.
