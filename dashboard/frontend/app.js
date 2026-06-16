document.addEventListener('DOMContentLoaded', () => {
    // API Endpoints
    const BASE_URL = 'http://localhost:3000/api';
    
    // UI Elements
    const valPh = document.getElementById('val-ph');
    const valTds = document.getElementById('val-tds');
    const valTurbidity = document.getElementById('val-turbidity');
    const valTemp = document.getElementById('val-temp');
    
    const stripGlucose = document.getElementById('strip-glucose');
    const stripProtein = document.getElementById('strip-protein');
    const stripKetones = document.getElementById('strip-ketones');
    const stripBlood = document.getElementById('strip-blood');
    const stripNitrite = document.getElementById('strip-nitrite');
    const stripLeukocytes = document.getElementById('strip-leukocytes');
    
    const hydrationBadge = document.getElementById('hydration-badge');
    const alertsWrapper = document.getElementById('alerts-wrapper');
    const refreshBtn = document.getElementById('refresh-btn');
    
    let trendChartInstance = null;

    // Initialize ChartJS
    function initChart(labels = [], datasets = {}) {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        // Define clean dark-theme chart style
        trendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'pH level',
                        data: datasets.ph || [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'TDS (scaled / 100)',
                        data: (datasets.tds || []).map(v => v / 100),
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', weight: '600' }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    // Fetch telemetry from express backend
    async function fetchLatestData() {
        try {
            const res = await fetch(`${BASE_URL}/telemetry`);
            const data = await res.json();
            
            if (data && data.length > 0) {
                // Take latest record
                const latest = data[data.length - 1];
                updateDashboardUI(latest);
                
                // Extract metrics for chart trends (limit to last 10 points)
                const history = data.slice(-10);
                const labels = history.map((item, idx) => `Sample #${idx + 1}`);
                const phVals = history.map(item => item.sensors.ph);
                const tdsVals = history.map(item => item.sensors.tds_ppm);
                
                if (trendChartInstance) {
                    trendChartInstance.destroy();
                }
                initChart(labels, { ph: phVals, tds: tdsVals });
            } else {
                showFallbackData();
            }
        } catch (err) {
            console.warn("[DASHBOARD] Live backend unavailable. Loading fallback demo data.", err);
            showFallbackData();
        }
    }

    // Update screen DOM values
    function updateDashboardUI(record) {
        // Physical values
        valPh.textContent = record.sensors.ph.toFixed(2);
        valTds.innerHTML = `${record.sensors.tds_ppm} <span>ppm</span>`;
        valTurbidity.innerHTML = `${record.sensors.turbidity_ntu.toFixed(1)} <span>NTU</span>`;
        valTemp.innerHTML = `${record.sensors.temperature_c.toFixed(1)} <span>°C</span>`;

        // Reagents
        updateReagentBadge(stripGlucose, record.strip_results.glucose);
        updateReagentBadge(stripProtein, record.strip_results.protein);
        updateReagentBadge(stripKetones, record.strip_results.ketones);
        updateReagentBadge(stripBlood, record.strip_results.blood);
        updateReagentBadge(stripNitrite, record.strip_results.nitrite);
        updateReagentBadge(stripLeukocytes, record.strip_results.leukocytes);

        // Hydration status
        hydrationBadge.textContent = record.assessment.hydration_status;
        if (record.assessment.hydration_status.toLowerCase().includes('dehydrated')) {
            hydrationBadge.style.background = 'rgba(239, 68, 68, 0.15)';
            hydrationBadge.style.color = '#ef4444';
            hydrationBadge.style.borderColor = 'rgba(239, 68, 68, 0.25)';
        } else {
            hydrationBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            hydrationBadge.style.color = '#10b981';
            hydrationBadge.style.borderColor = 'rgba(16, 185, 129, 0.25)';
        }

        // Flags alerts
        alertsWrapper.innerHTML = '';
        if (record.assessment.flags && record.assessment.flags.length > 0) {
            record.assessment.flags.forEach(flag => {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert';
                alertDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Alert Flag:</strong> ${flag}`;
                alertsWrapper.appendChild(alertDiv);
            });
        }
    }

    function updateReagentBadge(element, value) {
        element.textContent = value;
        element.className = 'reagent-value'; // Reset
        if (value.toLowerCase() === 'negative' || value.toLowerCase() === 'normal') {
            element.classList.add('negative');
        } else if (value.toLowerCase().includes('trace') || value.toLowerCase().includes('moderate')) {
            element.classList.add('warning');
        } else {
            element.classList.add('danger');
        }
    }

    // Load static demo datasets if express endpoint is not connected
    function showFallbackData() {
        const mockRecord = {
            sensors: { ph: 6.25, tds_ppm: 480, turbidity_ntu: 12.5, temperature_c: 36.8 },
            strip_results: {
                glucose: "Negative",
                protein: "Negative",
                ketones: "Trace",
                blood: "Negative",
                nitrite: "Negative",
                leukocytes: "Negative"
            },
            assessment: {
                hydration_status: "Optimal Hydration",
                flags: ["Trace Ketones detected - Metabolic screening suggestion"]
            }
        };
        updateDashboardUI(mockRecord);
        initChart(
            ['June 10', 'June 11', 'June 12', 'June 13', 'June 14', 'June 15', 'June 16'],
            {
                ph: [6.1, 6.4, 6.2, 5.9, 6.5, 6.0, 6.25],
                tds: [450, 500, 320, 680, 520, 410, 480]
            }
        );
    }

    // Click Handlers
    refreshBtn.addEventListener('click', () => {
        fetchLatestData();
    });

    // Start Up
    fetchLatestData();
});
