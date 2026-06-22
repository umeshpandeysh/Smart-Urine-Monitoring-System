/**
 * UroSense — IIoT Hardware Device Simulator
 * 
 * Pushes simulated sensor streams from four distinct virtual nodes:
 * - Airport (US-NOD-1001)
 * - Hospital (US-NOD-1002)
 * - University (US-NOD-1003)
 * - Corporate (US-NOD-1004)
 */

const SERVER_URL = 'http://localhost:3001/api/device/upload';

const SIMULATED_DEVICES = [
  {
    deviceId: 'US-NOD-1001',
    apiKey: 'uro_key_usnod1001_test',
    locationName: 'Terminal 3 Departures Lounge',
    // Normal healthy profile
    baseReadings: { ph: 6.2, tds: 320, turbidity: 1.2, temp: 36.5, gas: 15 }
  },
  {
    deviceId: 'US-NOD-1002',
    apiKey: 'uro_key_usnod1002_test',
    locationName: 'OPD Block Ground Floor',
    // Elevated protein/sugar (high turbidity, high gas, high TDS)
    baseReadings: { ph: 5.4, tds: 550, turbidity: 8.5, temp: 37.8, gas: 62 }
  },
  {
    deviceId: 'US-NOD-1003',
    apiKey: 'uro_key_usnod1003_test',
    locationName: 'GGSIPU Administration Block',
    // Mildly dehydrated (elevated TDS)
    baseReadings: { ph: 7.1, tds: 490, turbidity: 2.1, temp: 36.8, gas: 25 }
  },
  {
    deviceId: 'US-NOD-1004',
    apiKey: 'uro_key_usnod1004_test',
    locationName: 'IIT Delhi Academic Center',
    // High UTI Risk indicators (alkaline pH, high turbidity, high gas)
    baseReadings: { ph: 7.6, tds: 380, turbidity: 12.0, temp: 38.2, gas: 55 }
  }
];

function generateFluctuatedValue(base: number, range: number): number {
  const variation = (Math.random() - 0.5) * range;
  return parseFloat((base + variation).toFixed(2));
}

async function simulateTelemetryPost(device: typeof SIMULATED_DEVICES[0]) {
  const ph = generateFluctuatedValue(device.baseReadings.ph, 0.4);
  const tds = Math.max(50, Math.round(generateFluctuatedValue(device.baseReadings.tds, 40)));
  const turbidity = Math.max(0.1, generateFluctuatedValue(device.baseReadings.turbidity, 1.5));
  const temperature = generateFluctuatedValue(device.baseReadings.temp, 0.6);
  const gasValue = Math.max(1, Math.round(generateFluctuatedValue(device.baseReadings.gas, 6)));

  const payload = {
    deviceId: device.deviceId,
    phone: '+919999999999', // Aarav Sharma's portal link
    sensors: {
      ph: ph,
      tds_ppm: tds,
      turbidity_ntu: turbidity,
      temperature_c: temperature,
      gas_mq2_raw: gasValue
    }
  };

  console.log(`[Simulator] Posting telemetry from [${device.deviceId}] at [${device.locationName}]...`);
  console.log(`            Payload: pH=${ph}, TDS=${tds}ppm, Turbidity=${turbidity}NTU, Temp=${temperature}°C, Gas=${gasValue}mV`);

  try {
    const res = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${device.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (res.ok && json.success) {
      console.log(`[Simulator] SUCCESS: Generated report ID [${json.reportId}] for [${device.deviceId}]`);
      console.log(`            Wellness Score: ${json.findings?.overallScore || 'N/A'}, Hydration: ${json.findings?.hydrationStatus || 'N/A'}`);
    } else {
      console.error(`[Simulator] ERROR from backend:`, json.error || json);
    }
  } catch (err: any) {
    console.error(`[Simulator] Network/Fetch failure for device [${device.deviceId}]:`, err.message);
  }
}

async function runSimulation() {
  console.log('========================================================');
  console.log('      UroSense — Virtual Hardware Device Simulator      ');
  console.log('========================================================');

  for (const device of SIMULATED_DEVICES) {
    await simulateTelemetryPost(device);
    // Add small delay between device uploads
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('========================================================');
  console.log('        Simulation cycle finished successfully.         ');
  console.log('========================================================');
}

runSimulation();
