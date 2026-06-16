-- PostgreSQL/SQLite Database Schema for Smart Urine Monitoring System

-- Table: devices
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(50) PRIMARY KEY,
    model_version VARCHAR(20) DEFAULT 'ESP32_REV1',
    installation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    firmware_version VARCHAR(10) DEFAULT '1.0.0',
    last_ping TIMESTAMP
);

-- Table: telemetry_logs
CREATE TABLE IF NOT EXISTS telemetry_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT, -- SQLite syntax. Use serial for PostgreSQL.
    device_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Physical Sensor values
    temperature_c REAL,
    ph REAL,
    tds_ppm REAL,
    turbidity_ntu REAL,
    gas_mq2_ratio REAL,
    flow_volume_ml REAL,
    
    -- Colorimetric Strip Parameters
    glucose VARCHAR(20),
    protein VARCHAR(20),
    ketones VARCHAR(20),
    blood VARCHAR(20),
    nitrite VARCHAR(20),
    leukocytes VARCHAR(20),
    specific_gravity REAL,
    strip_ph REAL,
    bilirubin VARCHAR(20),
    urobilinogen VARCHAR(20),
    
    -- Summary health evaluation
    hydration_status VARCHAR(50),
    warning_flags TEXT, -- JSON array string of warning labels
    
    FOREIGN KEY(device_id) REFERENCES devices(device_id)
);

-- Add Index for efficient timestamp sorting
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry_logs (timestamp);
