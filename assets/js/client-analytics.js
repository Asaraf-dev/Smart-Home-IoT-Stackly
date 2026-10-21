
/*--- Client Analytics ---*/
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /*--- Initialize Analytics ---*/
    const root = document.getElementById("sh-client-analytics");
    if (!root) return;

    const periodSelect = document.getElementById("sh-ca-period");
    const exportButton = document.getElementById("sh-ca-export");

    let energyChart = null;
    let deviceChart = null;
    let currentData = null;

    /*--- Demo Energy Data ---*/
    const energyData = {
        7: [4.2, 5.1, 4.7, 5.8, 4.3, 6.0, 4.5],
        30: [4.1, 4.8, 5.2, 4.4, 5.7, 4.6, 5.0, 4.3, 5.5, 4.8, 4.2, 5.9, 4.7, 5.1, 4.4, 5.6, 4.5, 4.9, 5.3, 4.1, 5.7, 4.6, 5.0, 4.3, 5.4, 4.8, 4.2, 5.6, 4.5, 4.7],
        90: Array.from({ length: 90 }, function (_, index) {
            return Number((4.1 + Math.abs(Math.sin(index * 0.43)) * 1.5 + (index % 7) * 0.08).toFixed(1));
        })
    };

    const usageDevices = [
        { name: "Air Conditioner", icon: "bi-snow", usage: 12.8 },
        { name: "Living Room Lights", icon: "bi-lightbulb", usage: 6.4 },
        { name: "Smart Plug", icon: "bi-plug", usage: 5.2 },
        { name: "Security Camera", icon: "bi-camera-video", usage: 3.1 },
        { name: "Other Devices", icon: "bi-cpu", usage: 7.1 }
    ];

    const activities = [
        { icon: "bi-lightbulb", title: "Living Room Lights", detail: "Lighting system connected successfully.", time: "Today" },
        { icon: "bi-snow", title: "Smart Air Conditioner", detail: "Climate device reported an active connection.", time: "Today" },
        { icon: "bi-shield-check", title: "Security Camera", detail: "Security device status checked.", time: "Yesterday" },
        { icon: "bi-plug", title: "Smart Plug", detail: "Device reported as offline in sample data.", time: "Yesterday" }
    ];

    /*--- Format Values ---*/
    function formatNumber(value, decimals) {
        return Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function getLabels(period) {
        const labels = [];
        const now = new Date();

        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);

            if (period === 7) {
                labels.push(date.toLocaleDateString("en-IN", { weekday: "short" }));
            } else {
                labels.push(date.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short"
                }));
            }
        }

        return labels;
    }

    function getEnergyValues(period) {
        const source = energyData[period];
        if (source.length === period) return source.slice();

        return Array.from({ length: period }, function (_, index) {
            return source[index % source.length];
        });
    }

    /*--- Render Usage By Device ---*/
    function renderUsage() {
        const container = document.getElementById("sh-ca-usage-list");
        if (!container) return;

        const total = usageDevices.reduce(function (sum, device) {
            return sum + device.usage;
        }, 0);

        container.innerHTML = usageDevices.map(function (device) {
            const percentage = total ? (device.usage / total) * 100 : 0;

            return `
                <div class="sh-ca-usage-row">
                    <div class="sh-ca-usage-top">
                        <span class="sh-ca-usage-name">
                            <i class="bi ${device.icon}"></i>${device.name}
                        </span>
                        <span class="sh-ca-usage-value">${formatNumber(device.usage, 1)} kWh</span>
                    </div>
                    <div class="sh-ca-usage-track">
                        <div class="sh-ca-usage-fill" style="width:${percentage.toFixed(1)}%"></div>
                    </div>
                </div>`;
        }).join("");
    }

    /*--- Render Recent Activity ---*/
    function renderActivity() {
        const container = document.getElementById("sh-ca-activity-list");
        if (!container) return;

        container.innerHTML = activities.map(function (activity) {
            return `
                <div class="sh-ca-activity">
                    <span class="sh-ca-activity-icon"><i class="bi ${activity.icon}"></i></span>
                    <div class="sh-ca-activity-content">
                        <strong>${activity.title}</strong>
                        <p>${activity.detail}</p>
                    </div>
                    <span class="sh-ca-activity-time">${activity.time}</span>
                </div>`;
        }).join("");
    }

    /*--- Update Device Availability ---*/
    function updateDeviceHealth() {
        const online = 5;
        const offline = 1;
        const total = online + offline;
        const percentage = Math.round((online / total) * 100);

        document.getElementById("sh-ca-availability").textContent = percentage;
        document.getElementById("sh-ca-online-summary").textContent =
            online + " of " + total + " devices online";
        document.getElementById("sh-ca-device-percent").textContent = percentage + "%";
        document.getElementById("sh-ca-online-count").textContent = online;
        document.getElementById("sh-ca-offline-count").textContent = offline;
        document.getElementById("sh-ca-device-total").textContent = total;

        if (typeof Chart === "undefined") return;

        const canvas = document.getElementById("sh-ca-device-chart");
        if (!canvas) return;

        if (deviceChart) deviceChart.destroy();

        deviceChart = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: ["Online", "Offline"],
                datasets: [{
                    data: [online, offline],
                    backgroundColor: ["#b6ff4a", "#35413b"],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "78%",
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ": " + context.raw + " devices";
                            }
                        }
                    }
                }
            }
        });
    }

    /*--- Render Energy Analytics ---*/
    function renderAnalytics() {
        const period = Number(periodSelect.value);
        const values = getEnergyValues(period);
        const total = values.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        const average = total / values.length;
        const todayUsage = 4.8;

        currentData = {
            period: period,
            values: values,
            labels: getLabels(period),
            total: total,
            average: average
        };

        document.getElementById("sh-ca-energy-today").textContent =
            formatNumber(todayUsage, 1);
        document.getElementById("sh-ca-energy-total").textContent =
            formatNumber(total, 1);
        document.getElementById("sh-ca-average").textContent =
            formatNumber(average, 2);
        document.getElementById("sh-ca-chart-total").textContent =
            formatNumber(total, 1);
        document.getElementById("sh-ca-period-label").textContent =
            "Last " + period + " days";
        document.getElementById("sh-ca-chart-range").textContent =
            "Last " + period + " days";

        if (typeof Chart === "undefined") {
            console.error("Chart.js is missing. Add its CDN script before client-analytics.js.");
            return;
        }

        /*--- Create Energy Chart ---*/
        const canvas = document.getElementById("sh-ca-energy-chart");
        if (!canvas) return;

        if (energyChart) energyChart.destroy();

        energyChart = new Chart(canvas, {
            type: "line",
            data: {
                labels: currentData.labels,
                datasets: [{
                    label: "Energy (kWh)",
                    data: values,
                    borderColor: "#b6ff4a",
                    backgroundColor: "rgba(182,255,74,0.10)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                    pointRadius: period === 7 ? 3 : 0,
                    pointHoverRadius: 5,
                    pointBackgroundColor: "#b6ff4a"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return " " + formatNumber(context.parsed.y, 1) + " kWh";
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "#899990",
                            maxTicksLimit: period === 7 ? 7 : 6,
                            maxRotation: 0,
                            font: { size: 9 }
                        },
                        border: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255,255,255,0.06)" },
                        ticks: {
                            color: "#899990",
                            font: { size: 9 },
                            callback: function (value) {
                                return value + " kWh";
                            }
                        },
                        border: { display: false }
                    }
                }
            }
        });
    }

    /*--- Export Analytics CSV ---*/
    function exportCSV() {
        if (!currentData) return;

        const rows = [
            ["Stackly Smart Home - Client Analytics"],
            ["Period (days)", currentData.period],
            ["Date", "Energy Consumption (kWh)"]
        ];

        currentData.labels.forEach(function (label, index) {
            rows.push([label, currentData.values[index]]);
        });

        rows.push([]);
        rows.push(["Total Consumption (kWh)", currentData.total.toFixed(2)]);
        rows.push(["Average Daily Consumption (kWh)", currentData.average.toFixed(2)]);
        rows.push(["Note", "Illustrative demo data, not live IoT readings."]);

        const csv = rows.map(function (row) {
            return row.map(function (value) {
                const text = String(value ?? "");
                return '"' + text.replace(/"/g, '""') + '"';
            }).join(",");
        }).join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "stackly-client-analytics-" + currentData.period + "-days.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    /*--- Initialize Analytics ---*/
    periodSelect.addEventListener("change", renderAnalytics);
    exportButton.addEventListener("click", exportCSV);

    renderUsage();
    renderActivity();
    updateDeviceHealth();
    renderAnalytics();
});
