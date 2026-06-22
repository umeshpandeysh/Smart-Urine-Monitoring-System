export interface TrendDataPoint {
  date: string;
  wellnessScore: number;
  hydrationStatus: string;
  glucoseIndicator: string;
  proteinIndicator: string;
  utiRisk: string;
}

export interface AnalyticsSummary {
  hydrationTrend: 'improving' | 'stable' | 'declining';
  glucoseTrend: 'improving' | 'stable' | 'declining';
  proteinTrend: 'improving' | 'stable' | 'declining';
  utiTrend: 'improving' | 'stable' | 'declining';
  monthlyWellnessScores: { month: string; averageScore: number }[];
  highestWellnessScore: number;
  lowestWellnessScore: number;
  currentWellnessScore: number;
}

/**
 * Calculates trend directions and monthly averages from a list of user screening reports.
 */
export function calculateTrends(reports: any[]): AnalyticsSummary {
  if (!reports || reports.length === 0) {
    return {
      hydrationTrend: 'stable',
      glucoseTrend: 'stable',
      proteinTrend: 'stable',
      utiTrend: 'stable',
      monthlyWellnessScores: [],
      highestWellnessScore: 0,
      lowestWellnessScore: 0,
      currentWellnessScore: 0
    };
  }

  // Sort reports by date ascending
  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
  );

  const scores = sortedReports.map(r => r.overall_score || 0);
  const highestWellnessScore = Math.max(...scores);
  const lowestWellnessScore = Math.min(...scores);
  const currentWellnessScore = scores[scores.length - 1] || 0;

  // Monthly grouping
  const monthlyScores: Record<string, number[]> = {};
  for (const r of sortedReports) {
    const d = new Date(r.report_date);
    const monthKey = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyScores[monthKey]) {
      monthlyScores[monthKey] = [];
    }
    monthlyScores[monthKey].push(r.overall_score || 0);
  }

  const monthlyWellnessScores = Object.entries(monthlyScores).map(([month, val]) => ({
    month,
    averageScore: Math.round(val.reduce((acc, score) => acc + score, 0) / val.length)
  }));

  // Helper function to evaluate trend
  const evaluateTrendDirection = (values: string[]): 'improving' | 'stable' | 'declining' => {
    if (values.length < 2) return 'stable';
    // Mapping alerts to numeric risk values: Elevated/High = 2, Trace/Medium = 1, Negative/Low = 0
    const numericRisks: number[] = values.map(v => {
      const lower = v.toLowerCase();
      if (lower.includes('high') || lower.includes('elevated') || lower.includes('severe')) return 2;
      if (lower.includes('medium') || lower.includes('trace') || lower.includes('mild') || lower.includes('moderate')) return 1;
      return 0;
    });

    const first = numericRisks.slice(0, Math.ceil(numericRisks.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(numericRisks.length / 2);
    const second = numericRisks.slice(Math.ceil(numericRisks.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(numericRisks.length / 2);

    if (second < first) return 'improving'; // risk decreased
    if (second > first) return 'declining'; // risk increased
    return 'stable';
  };

  const hydrationTrend = evaluateTrendDirection(sortedReports.map(r => r.hydration_status || ''));
  const glucoseTrend = evaluateTrendDirection(sortedReports.map(r => r.glucose_indicator || ''));
  const proteinTrend = evaluateTrendDirection(sortedReports.map(r => r.protein_indicator || ''));
  const utiTrend = evaluateTrendDirection(sortedReports.map(r => r.uti_risk || ''));

  return {
    hydrationTrend,
    glucoseTrend,
    proteinTrend,
    utiTrend,
    monthlyWellnessScores,
    highestWellnessScore,
    lowestWellnessScore,
    currentWellnessScore
  };
}
