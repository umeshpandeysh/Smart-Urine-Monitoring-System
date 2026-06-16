const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database (seeded with some initial values)
let telemetryData = [
    {
        device_id: "ESP32_URINE_MONITOR_01",
        timestamp: 1781640000,
        sensors: {
            temperature_c: 36.5,
            ph: 6.2,
            tds_ppm: 420,
            turbidity_ntu: 10.2,
            gas_mq2_raw: 0.95,
            flow_volume_ml: 220
        },
        strip_results: {
            glucose: "Negative",
            protein: "Negative",
            ketones: "Negative",
            blood: "Negative",
            nitrite: "Negative",
            leukocytes: "Negative",
            specific_gravity: 1.015,
            ph: 6.0,
            bilirubin: "Negative",
            urobilinogen: "Normal"
        },
        assessment: {
            hydration_status: "Optimal Hydration",
            flags: []
        }
    }
];

// Serve Static Frontend if desired
app.use(express.static(path.join(__dirname, '../frontend')));

// API Endpoints
// GET: Fetch all telemetry records
app.get('/api/telemetry', (req, res) => {
    res.status(200).json(telemetryData);
});

// POST: Receive telemetry payloads from ESP32
app.post('/api/telemetry', (req, res) => {
    const payload = req.body;
    
    // Simple verification
    if (!payload.device_id || !payload.sensors || !payload.strip_results) {
        return res.status(400).json({ error: "Invalid telemetry payload format." });
    }

    // Add server timestamp if not provided
    if (!payload.timestamp) {
        payload.timestamp = Math.floor(Date.now() / 1000);
    }

    // Push to memory cache
    telemetryData.push(payload);
    
    // Log to console for debugging
    console.log(`[HTTP POST] Received data from ${payload.device_id}:`);
    console.log(JSON.stringify(payload, null, 2));

    // Optional: append readings to CSV log
    appendTelemetryToCSV(payload);

    res.status(201).json({ message: "Telemetry received successfully." });
});

// Helper: Append incoming reading to historical dataset CSV
function appendTelemetryToCSV(data) {
    const csvPath = path.join(__dirname, '../../datasets/sensor-readings/sample_readings.csv');
    
    // Ensure dir structure exists
    const dir = path.dirname(csvPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    let csvLine = `${data.timestamp},${data.sensors.ph},${data.sensors.tds_ppm},${data.sensors.turbidity_ntu},${data.sensors.temperature_c},${data.strip_results.glucose},${data.strip_results.protein},${data.strip_results.ketones}\n`;
    
    // If file doesn't exist, write headers first
    if (!fs.existsSync(csvPath)) {
        const headers = "timestamp,ph,tds_ppm,turbidity_ntu,temperature_c,glucose,protein,ketones\n";
        fs.writeFileSync(csvPath, headers);
    }
    
    fs.appendFileSync(csvPath, csvLine);
}

// Start Server
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(` Smart Urine Monitoring Server running on port ${PORT} `);
    console.log(` Access dashboard at http://localhost:${PORT}        `);
    console.log(`===================================================`);
});
