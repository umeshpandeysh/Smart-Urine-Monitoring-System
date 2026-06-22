import { createServiceClient } from '@/lib/supabase/server';

export interface CalibrationProfile {
  sensor_type: string;
  offset: number;
  coefficient: number;
}

/**
 * Sensor Calibration Engine.
 * Yields: Calibrated = (Raw - Offset) * Coefficient
 * Falls back to offset = 0, coefficient = 1 if none is defined in the database.
 */
export async function calibrateSensorValue(
  deviceId: string,
  sensorType: string,
  rawValue: number
): Promise<number> {
  const supabase = createServiceClient();

  try {
    // Look up calibration record
    const { data } = await supabase
      .from('sensor_calibrations')
      .select('offset, coefficient')
      .eq('device_id', deviceId)
      .eq('sensor_type', sensorType)
      .single();

    const offset = data ? Number((data as any).offset) : 0.0;
    const coefficient = data ? Number((data as any).coefficient) : 1.0;

    const calibrated = (rawValue - offset) * coefficient;
    return parseFloat(calibrated.toFixed(4));
  } catch (err) {
    // Fallback if record not found
    return rawValue;
  }
}

/**
 * Helper to calibrate an entire sensor readings payload for a device.
 */
export async function calibrateReadings(
  deviceId: string,
  readings: {
    ph: number;
    tds: number;
    turbidity: number;
    temperature: number;
    gasValue: number;
  }
) {
  const ph = await calibrateSensorValue(deviceId, 'ph', readings.ph);
  const tds = await calibrateSensorValue(deviceId, 'tds', readings.tds);
  const turbidity = await calibrateSensorValue(deviceId, 'turbidity', readings.turbidity);
  const temperature = await calibrateSensorValue(deviceId, 'temperature', readings.temperature);
  const gasValue = await calibrateSensorValue(deviceId, 'gasValue', readings.gasValue);

  return { ph, tds, turbidity, temperature, gasValue };
}
