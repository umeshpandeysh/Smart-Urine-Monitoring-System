export interface SensorReadingsInput {
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
  gasValue: number;
}

export interface ScreeningInterpretation {
  hydrationStatus: string;
  glucoseIndicator: string;
  proteinIndicator: string;
  utiRisk: string;
  kidneyStress: string;
  overallScore: number;
  recommendations: string[];
}

/**
 * Rules-based interpretation engine for urine screening analytics.
 * Supports dynamic threshold rules fetched from the database.
 */
export function interpretReadings(
  input: SensorReadingsInput,
  rules?: Record<string, any>
): ScreeningInterpretation {
  const { ph, tds, turbidity, temperature, gasValue } = input;
  const recommendations: string[] = [];

  // Extract threshold settings or use hardcoded defaults
  const hydRules = rules?.hydration_threshold || { moderate: 450, severe: 700 };
  const gluRules = rules?.glucose_threshold || { trace: 30, elevated: 50, ph_limit: 5.5 };
  const protRules = rules?.protein_threshold || { trace: 3.0, elevated: 6.0, ph_limit: 7.0 };
  const utiRules = rules?.uti_threshold || { turbidity: 5.0, gas: 40, ph: 7.2 };
  const kidneyRules = rules?.kidney_stress_threshold || { tds_limit: 600, ph_low: 5.2, ph_high: 8.0, turbidity_high: 4.5 };

  // 1. Hydration Status
  let hydrationStatus = 'Optimal Hydration';
  if (tds > hydRules.severe) {
    hydrationStatus = 'Severe Dehydration';
    recommendations.push('Severe hydration indicators flagged. Consume electrolyte fluids immediately.');
  } else if (tds > hydRules.moderate) {
    hydrationStatus = 'Mild Dehydration';
    recommendations.push('Mild hydration trace flagged. Incremental water intake recommended.');
  } else {
    recommendations.push('Hydration parameters are optimal. Maintain your current daily fluid intake.');
  }

  // 2. Glucose Indicator
  let glucoseIndicator = 'Negative';
  if (gasValue > gluRules.elevated && ph < gluRules.ph_limit) {
    glucoseIndicator = 'Elevated';
    recommendations.push('Elevated wellness indicators for glucose. Follow-up screening or standard clinical consultation is advised.');
  } else if (gasValue > gluRules.trace) {
    glucoseIndicator = 'Trace';
    recommendations.push('Trace glucose indicators detected. Limit sugars and simple carbohydrates.');
  }

  // 3. Protein Indicator
  let proteinIndicator = 'Negative';
  if (turbidity > protRules.elevated && ph > protRules.ph_limit) {
    proteinIndicator = 'Elevated';
    recommendations.push('Elevated protein screening findings. Regular activity adjustment and standard checkup recommended.');
  } else if (turbidity > protRules.trace) {
    proteinIndicator = 'Trace';
    recommendations.push('Trace protein indicators flagged. Monitor muscle strain and hydration levels.');
  }

  // 4. UTI Risk
  let utiRisk = 'Low';
  if (turbidity > utiRules.turbidity && gasValue > utiRules.gas && ph > utiRules.ph) {
    utiRisk = 'High';
    recommendations.push('High UTI risk screening findings. Consult a primary healthcare professional for formal screening.');
  } else if (turbidity > utiRules.turbidity * 0.6 || gasValue > utiRules.gas * 0.6) {
    utiRisk = 'Medium';
    recommendations.push('Moderate UTI risk indicator. Consider drinking unsweetened cranberry juice.');
  }

  // 5. Kidney Stress
  let kidneyStress = 'Low';
  if ((tds > kidneyRules.tds_limit && ph < kidneyRules.ph_low) || (ph > kidneyRules.ph_high && turbidity > kidneyRules.turbidity_high)) {
    kidneyStress = 'High';
    recommendations.push('Kidney stress parameters flagged. Avoid high sodium.');
  } else if (tds > kidneyRules.tds_limit * 0.66 || ph < kidneyRules.ph_low + 0.3 || ph > kidneyRules.ph_high - 0.2) {
    kidneyStress = 'Moderate';
    recommendations.push('Moderate kidney stress indicators.');
  }

  // 6. Overall Wellness Score Calculation (out of 100)
  let score = 100;
  if (hydrationStatus === 'Severe Dehydration') score -= 25;
  else if (hydrationStatus === 'Mild Dehydration') score -= 10;
  if (glucoseIndicator === 'Elevated') score -= 20;
  else if (glucoseIndicator === 'Trace') score -= 5;
  if (proteinIndicator === 'Elevated') score -= 15;
  else if (proteinIndicator === 'Trace') score -= 5;
  if (utiRisk === 'High') score -= 20;
  else if (utiRisk === 'Medium') score -= 8;
  if (kidneyStress === 'High') score -= 15;
  else if (kidneyStress === 'Moderate') score -= 5;

  // Temperature variation penalty
  if (temperature < 35.0 || temperature > 38.5) {
    score -= 10;
    recommendations.push('Sensor temperature reading is outside the normal physiological range.');
  }

  // Bound check
  const overallScore = Math.max(10, Math.min(100, score));

  return {
    hydrationStatus,
    glucoseIndicator,
    proteinIndicator,
    utiRisk,
    kidneyStress,
    overallScore,
    recommendations
  };
}
