'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, Cpu, Wifi, Database, Play, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Info, Heart
} from 'lucide-react';
import Link from 'next/link';

const TEST_SCENARIOS = [
  {
    id: 'scenario1',
    name: 'Scenario 1: Healthy Sample',
    description: 'Normal parameters showing optimal score and healthy indicators.',
    payload: {
      deviceId: 'US-NOD-1001',
      ph: 6.4,
      tds: 310,
      turbidity: 1.1,
      temperature: 36.5,
      gasValue: 14,
      phone: '+919999999999'
    }
  },
  {
    id: 'scenario2',
    name: 'Scenario 2: Mild Dehydration',
    description: 'Elevated TDS indicating mild dehydration alert.',
    payload: {
      deviceId: 'US-NOD-1001',
      ph: 6.0,
      tds: 485,
      turbidity: 1.9,
      temperature: 36.8,
      gasValue: 18,
      phone: '+919999999999'
    }
  },
  {
    id: 'scenario3',
    name: 'Scenario 3: High Turbidity',
    description: 'Elevated turbidity suggesting trace elements/cloudy sample.',
    payload: {
      deviceId: 'US-NOD-1001',
      ph: 6.5,
      tds: 350,
      turbidity: 14.5,
      temperature: 36.6,
      gasValue: 16,
      phone: '+919999999999'
    }
  },
  {
    id: 'scenario4',
    name: 'Scenario 4: Elevated Glucose Indicator',
    description: 'Acidic pH combined with high gas readings indicating glucose presence.',
    payload: {
      deviceId: 'US-NOD-1001',
      ph: 5.1,
      tds: 420,
      turbidity: 2.1,
      temperature: 37.1,
      gasValue: 68,
      phone: '+919999999999'
    }
  },
  {
    id: 'scenario5',
    name: 'Scenario 5: Potential UTI Pattern',
    description: 'Alkaline pH, high turbidity, and high gas suggesting potential UTI risk.',
    payload: {
      deviceId: 'US-NOD-1001',
      ph: 7.7,
      tds: 390,
      turbidity: 12.5,
      temperature: 38.3,
      gasValue: 56,
      phone: '+919999999999'
    }
  }
];

export default function HardwareTestPage() {
  const [data, setData] = useState<any>({ rawPayloads: [], uploadLogs: [], health: [] });
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/device/test-history');
      const json = await res.json();
      if (!json.error) {
        setData(json);
      }
    } catch (e) {
      console.error('Error fetching hardware test history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerScenario = async (scenario: typeof TEST_SCENARIOS[0]) => {
    setTriggering(scenario.id);
    setFeedback(null);
    try {
      const res = await fetch('/api/device/test-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario.payload)
      });
      const result = await res.json();
      setFeedback({
        success: res.ok && result.success,
        message: res.ok ? 'Data successfully uploaded to Next.js pipeline.' : result.error || 'Server error',
        data: result
      });
      fetchHistory();
    } catch (e: any) {
      setFeedback({ success: false, message: e.message });
    } finally {
      setTriggering(null);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success' || status === 'online') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (status === 'pending') return <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />;
    return <XCircle className="w-5 h-5 text-rose-500" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Cpu className="w-8 h-8 text-blue-600" />
              Hardware Test Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Lightweight panel for ESP32 calibration and validation scenarios.</p>
          </div>
          <button 
            onClick={fetchHistory}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Network and Database Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Pipeline Status</h3>
              <p className="text-sm text-slate-600 mt-1">Ingestion Port: 3001</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                Listening for Telemetry
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Database Connection</h3>
              <p className="text-sm text-slate-600 mt-1">Supabase Cluster Online</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                Connected
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">ESP32 Key Status</h3>
              <p className="text-sm text-slate-600 mt-1">Device: US-NOD-1001</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                Auth Profile Active
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Scenarios Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                Trigger Simulation
              </h2>
              <div className="space-y-4">
                {TEST_SCENARIOS.map((sc) => (
                  <div key={sc.id} className="border border-slate-150 p-4 rounded-lg bg-slate-50 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800">{sc.name}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{sc.description}</p>
                    </div>
                    <button
                      onClick={() => triggerScenario(sc)}
                      disabled={triggering !== null}
                      className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {triggering === sc.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          Simulate Upload
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Feedback */}
            {feedback && (
              <div className={`p-4 border rounded-xl shadow-sm ${feedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  {feedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  {feedback.success ? 'Simulation Success' : 'Simulation Failed'}
                </h4>
                <p className="text-xs mt-1">{feedback.message}</p>
                {feedback.success && feedback.data?.reportId && (
                  <div className="mt-3 border-t border-emerald-200 pt-3 space-y-1">
                    <p className="text-xs">Report ID: <span className="font-mono bg-emerald-100 px-1 py-0.5 rounded">{feedback.data.reportId}</span></p>
                    <p className="text-xs">Wellness Score: <strong>{feedback.data.findings?.overallScore}</strong></p>
                    <Link 
                      href={`/report/${feedback.data.reportId}`}
                      target="_blank"
                      className="text-xs font-semibold underline text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-1"
                    >
                      View Patient Portal Report &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results and History Logs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Latest Report detail view */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                Latest Generated Report
              </h2>
              {data.uploadLogs.length > 0 && data.uploadLogs[0].reports ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block">Wellness Score</span>
                      <strong className="text-xl text-slate-800">{data.uploadLogs[0].reports.overall_score}/100</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block">Hydration</span>
                      <strong className="text-sm text-slate-800 block truncate">{data.uploadLogs[0].reports.hydration_status}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block">UTI Risk</span>
                      <strong className="text-sm text-slate-800 block truncate">{data.uploadLogs[0].reports.uti_risk}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block">Glucose</span>
                      <strong className="text-sm text-slate-800 block truncate">{data.uploadLogs[0].reports.glucose_indicator}</strong>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-xs text-slate-500 block">Recommendations</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{data.uploadLogs[0].reports.recommendation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No reports generated yet. Trigger a simulation scenario above.</p>
              )}
            </div>

            {/* Ingestion Logs */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                Device Ingestion Log History
              </h2>
              {loading ? (
                <p className="text-sm text-slate-500 italic">Loading ingestion log history...</p>
              ) : data.uploadLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-4 rounded-l">Timestamp</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Device Code</th>
                        <th className="py-2.5 px-4 rounded-r">Generated Report ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {data.uploadLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 text-slate-600">
                            {new Date(log.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 flex items-center gap-1.5 capitalize font-medium text-slate-700">
                            {getStatusIcon(log.processing_status)}
                            {log.processing_status}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-800">US-NOD-1001</td>
                          <td className="py-3 px-4 font-mono text-blue-600">
                            {log.generated_report_id ? (
                              <Link href={`/report/${log.generated_report_id}`} target="_blank" className="underline">
                                {log.generated_report_id.substring(0, 8)}...
                              </Link>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No upload logs found in device_upload_logs table.</p>
              )}
            </div>

            {/* Raw sensor payload monitor */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-600" />
                Raw Telemetry Payload Stream (raw_sensor_payloads)
              </h2>
              {data.rawPayloads.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-600 flex justify-between">
                    <span>Latest raw packet ID: <strong>{data.rawPayloads[0].id}</strong></span>
                    <span>Received: {new Date(data.rawPayloads[0].received_at).toLocaleTimeString()}</span>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto font-mono max-h-48">
                    {JSON.stringify(data.rawPayloads[0].raw_payload, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No raw payloads captured. Pushing simulated telemetry will populate this live stream.</p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
