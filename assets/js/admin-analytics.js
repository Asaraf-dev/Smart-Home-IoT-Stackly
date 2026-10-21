document.addEventListener("DOMContentLoaded", function () {
    initAdminAnalytics();
});

/*--- Initialize Analytics ---*/
function initAdminAnalytics() {
    const root = document.querySelector(".sh-analytics");
    if (!root || root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    if (typeof Chart === "undefined") {
        console.error("Chart.js is missing. Check the Chart.js script in admin-analytics.html.");
        return;
    }

    const $ = function (id) {
        return document.getElementById(id);
    };

    /*--- Demo Analytics Dataset ---*/
    const analyticsData = {
        7: {
            revenue: [4200, 5800, 4900, 7200, 6500, 9100, 8400],
            orders: [8, 11, 9, 14, 12, 17, 15],
            previousRevenue: 39000,
            previousOrders: 76,
            units: 128
        },
        30: {
            revenue: [4200, 5800, 4900, 7200, 6500, 9100, 8400, 7600, 9800, 8300, 11200, 9700, 12400, 10800, 13500, 11900, 14300, 12600, 15100, 13800, 16200, 14500, 17400, 15800, 18200, 16900, 19500, 17700, 20400, 22100],
            orders: [8, 11, 9, 14, 12, 17, 15, 13, 18, 15, 20, 17, 22, 19, 24, 21, 26, 23, 28, 25, 30, 27, 32, 29, 34, 31, 36, 33, 38, 41],
            previousRevenue: 275000,
            previousOrders: 510,
            units: 684
        },
        90: {
            revenue: [85000, 92000, 89000, 104000, 98000, 112000, 108000, 119000, 114000, 128000, 123000, 139000],
            orders: [155, 168, 160, 185, 176, 198, 190, 210, 202, 225, 218, 240],
            previousRevenue: 950000,
            previousOrders: 1750,
            units: 2150
        }
    };

    /*--- Category Sales Dataset ---*/
    const categorySales = [
        {name:"Lighting",value:32,color:"#b6ff4a"},
        {name:"Security",value:26,color:"#6485e8"},
        {name:"Climate",value:19,color:"#d9a5ff"},
        {name:"Sensors",value:13,color:"#ffbd73"},
        {name:"Controllers",value:10,color:"#58d6c5"}
    ];

    /*--- Product Sales Dataset ---*/
    const topProducts = [
        {name:"Smart LED Bulb",sku:"STK-LGT-001",category:"Lighting",units:186,revenue:167214,icon:"bi-lightbulb"},
        {name:"Smart Door Lock",sku:"STK-SEC-002",category:"Security",units:124,revenue:805276,icon:"bi-lock"},
        {name:"Smart Plug",sku:"STK-CTL-006",category:"Controllers",units:108,revenue:129492,icon:"bi-plug"},
        {name:"Motion Sensor",sku:"STK-SNS-004",category:"Sensors",units:96,revenue:124704,icon:"bi-broadcast"},
        {name:"Smart Thermostat",sku:"STK-CLM-003",category:"Climate",units:72,revenue:309528,icon:"bi-thermometer-half"}
    ];

    /*--- Demo Activity Dataset ---*/
    const activities = [
        {icon:"bi-graph-up-arrow",title:"Analytics overview updated",description:"Demo performance figures are ready to review.",time:"Just now"},
        {icon:"bi-box-seam",title:"Inventory summary refreshed",description:"Product stock is calculated from the saved demo inventory.",time:"Current"},
        {icon:"bi-bar-chart-line",title:"Sales report available",description:"Review the selected date range and export the report.",time:"Current"}
    ];

    let charts = {};

    /*--- Currency Formatting ---*/
    function formatCurrency(value) {
        return new Intl.NumberFormat("en-IN", {
            style:"currency",
            currency:"INR",
            maximumFractionDigits:0
        }).format(value);
    }

    /*--- Number Formatting ---*/
    function formatNumber(value) {
        return new Intl.NumberFormat("en-IN").format(value);
    }

    /*--- Safe HTML Formatting ---*/
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                "&":"&amp;",
                "<":"&lt;",
                ">":"&gt;",
                '"':"&quot;",
                "'":"&#39;"
            }[character];
        });
    }

    /*--- Percentage Calculation ---*/
    function getChange(current, previous) {
        if (!previous) return 0;
        return ((current - previous) / previous) * 100;
    }

    /*--- Update KPI Change ---*/
    function updateChange(elementId, change) {
        const element = $(elementId);
        const negative = change < 0;
        const icon = negative ? "bi-arrow-down-right" : "bi-arrow-up-right";

        element.classList.toggle("is-negative", negative);
        element.innerHTML = '<i class="bi ' + icon + '"></i> ' +
            (change > 0 ? "+" : "") + change.toFixed(1) + "%";
    }

    /*--- Read Inventory ---*/
    function getInventory() {
        const defaults = [
            {name:"Smart LED Bulb",category:"Lighting",stock:45},
            {name:"Smart Door Lock",category:"Security",stock:12},
            {name:"Smart Thermostat",category:"Climate",stock:8},
            {name:"Motion Sensor",category:"Sensors",stock:26},
            {name:"Smart Home Hub",category:"Controllers",stock:0},
            {name:"Smart Plug",category:"Controllers",stock:34},
            {name:"Outdoor Security Camera",category:"Security",stock:5},
            {name:"Smart Light Strip",category:"Lighting",stock:19},
            {name:"Temperature Sensor",category:"Sensors",stock:0},
            {name:"Smart Fan Controller",category:"Climate",stock:16}
        ];

        try {
            const saved = localStorage.getItem("shAdminProductsDemo");
            if (saved !== null) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(function (item) {
                    return item &&
                        typeof item.name === "string" &&
                        typeof item.category === "string" &&
                        Number.isInteger(item.stock) &&
                        item.stock >= 0;
                })) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn("Unable to read inventory data:", error);
        }

        return defaults;
    }

    /*--- Render Inventory Health ---*/
    function renderInventory() {
        const inventory = getInventory();
        const total = inventory.length;
        const inStock = inventory.filter(function (item) {
            return item.stock > 10;
        }).length;
        const lowStock = inventory.filter(function (item) {
            return item.stock > 0 && item.stock <= 10;
        }).length;
        const outStock = inventory.filter(function (item) {
            return item.stock === 0;
        }).length;

        $("sh-analytics-stock-total").textContent = formatNumber(total);
        $("sh-analytics-stock-in").textContent = formatNumber(inStock);
        $("sh-analytics-stock-low").textContent = formatNumber(lowStock);
        $("sh-analytics-stock-out").textContent = formatNumber(outStock);

        const safeTotal = total || 1;
        $("sh-analytics-stock-bar-in").style.width = (inStock / safeTotal * 100) + "%";
        $("sh-analytics-stock-bar-low").style.width = (lowStock / safeTotal * 100) + "%";
        $("sh-analytics-stock-bar-out").style.width = (outStock / safeTotal * 100) + "%";
    }

    /*--- Render Category Legend ---*/
    function renderCategoryLegend() {
        $("sh-analytics-category-legend").innerHTML = categorySales.map(function (item) {
            return `
                <div class="sh-analytics-category-item">
                    <span class="sh-analytics-category-name">
                        <i class="sh-analytics-category-dot" style="background:${item.color}"></i>
                        ${escapeHTML(item.name)}
                    </span>
                    <strong>${item.value}%</strong>
                </div>`;
        }).join("");
    }

    /*--- Render Top Products ---*/
    function renderTopProducts() {
        const maxUnits = Math.max.apply(null, topProducts.map(function (item) {
            return item.units;
        }));

        $("sh-analytics-products-body").innerHTML = topProducts.map(function (item) {
            const percentage = Math.round(item.units / maxUnits * 100);

            return `
                <tr>
                    <td>
                        <div class="sh-analytics-product-cell">
                            <span class="sh-analytics-product-icon"><i class="bi ${escapeHTML(item.icon)}"></i></span>
                            <span class="sh-analytics-product-name">
                                <strong>${escapeHTML(item.name)}</strong>
                                <span>${escapeHTML(item.sku)}</span>
                            </span>
                        </div>
                    </td>
                    <td>${escapeHTML(item.category)}</td>
                    <td>${formatNumber(item.units)}</td>
                    <td>${formatCurrency(item.revenue)}</td>
                    <td>
                        <div class="sh-analytics-performance">
                            <div class="sh-analytics-performance-track"><span style="width:${percentage}%"></span></div>
                            <span>${percentage}%</span>
                        </div>
                    </td>
                </tr>`;
        }).join("");
    }

    /*--- Render Activity Feed ---*/
    function renderActivities() {
        $("sh-analytics-activity-list").innerHTML = activities.map(function (item) {
            return `
                <div class="sh-analytics-activity-item">
                    <span class="sh-analytics-activity-icon"><i class="bi ${escapeHTML(item.icon)}"></i></span>
                    <div class="sh-analytics-activity-copy">
                        <strong>${escapeHTML(item.title)}</strong>
                        <p>${escapeHTML(item.description)}</p>
                    </div>
                    <span class="sh-analytics-activity-time">${escapeHTML(item.time)}</span>
                </div>`;
        }).join("");
    }

    /*--- Chart Defaults ---*/
    Chart.defaults.color = "#91a198";
    Chart.defaults.font.family = "Inter, Poppins, sans-serif";
    Chart.defaults.font.size = 10;

    const commonScales = {
        x:{
            grid:{display:false},
            border:{display:false},
            ticks:{maxRotation:0,autoSkip:true,maxTicksLimit:7,color:"#829188"}
        },
        y:{
            beginAtZero:true,
            grid:{color:"rgba(255,255,255,.055)",drawTicks:false},
            border:{display:false,dash:[4,4]},
            ticks:{padding:10,color:"#829188"}
        }
    };

    /*--- Create Revenue Chart ---*/
    charts.revenue = new Chart($("sh-analytics-revenue-chart"), {
        type:"line",
        data:{
            labels:[],
            datasets:[
                {
                    label:"Revenue",
                    data:[],
                    borderColor:"#b6ff4a",
                    backgroundColor:"rgba(182,255,74,.09)",
                    borderWidth:2,
                    pointRadius:0,
                    pointHoverRadius:4,
                    pointHoverBackgroundColor:"#b6ff4a",
                    fill:true,
                    tension:.38,
                    yAxisID:"y"
                },
                {
                    label:"Orders",
                    data:[],
                    borderColor:"#6485e8",
                    backgroundColor:"rgba(100,133,232,.08)",
                    borderWidth:2,
                    pointRadius:0,
                    pointHoverRadius:4,
                    fill:false,
                    tension:.38,
                    yAxisID:"y1"
                }
            ]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            interaction:{mode:"index",intersect:false},
            plugins:{
                legend:{display:false},
                tooltip:{
                    backgroundColor:"#202b2d",
                    borderColor:"#3a4840",
                    borderWidth:1,
                    padding:12,
                    callbacks:{
                        label:function (context) {
                            return context.dataset.label + ": " +
                                (context.dataset.label === "Revenue"
                                    ? formatCurrency(context.parsed.y)
                                    : formatNumber(context.parsed.y) + " orders");
                        }
                    }
                }
            },
            scales:{
                x:commonScales.x,
                y:{
                    ...commonScales.y,
                    ticks:{
                        ...commonScales.y.ticks,
                        callback:function (value) {
                            return value >= 1000 ? "₹" + (value / 1000) + "k" : "₹" + value;
                        }
                    }
                },
                y1:{
                    beginAtZero:true,
                    position:"right",
                    grid:{display:false},
                    border:{display:false},
                    ticks:{display:false}
                }
            }
        }
    });

    /*--- Create Category Chart ---*/
    charts.category = new Chart($("sh-analytics-category-chart"), {
        type:"doughnut",
        data:{
            labels:categorySales.map(function (item) { return item.name; }),
            datasets:[{
                data:categorySales.map(function (item) { return item.value; }),
                backgroundColor:categorySales.map(function (item) { return item.color; }),
                borderColor:"#172022",
                borderWidth:4,
                hoverOffset:5,
                borderRadius:3
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            cutout:"72%",
            plugins:{
                legend:{display:false},
                tooltip:{
                    backgroundColor:"#202b2d",
                    borderColor:"#3a4840",
                    borderWidth:1,
                    padding:11,
                    callbacks:{
                        label:function (context) {
                            return context.label + ": " + context.parsed + "%";
                        }
                    }
                }
            }
        }
    });

    /*--- Create Sales Chart ---*/
    charts.sales = new Chart($("sh-analytics-sales-chart"), {
        type:"bar",
        data:{
            labels:[],
            datasets:[{
                label:"Orders",
                data:[],
                backgroundColor:"rgba(182,255,74,.75)",
                hoverBackgroundColor:"#b6ff4a",
                borderRadius:5,
                borderSkipped:false,
                maxBarThickness:18
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{display:false},
                tooltip:{
                    backgroundColor:"#202b2d",
                    borderColor:"#3a4840",
                    borderWidth:1,
                    callbacks:{
                        label:function (context) {
                            return context.parsed.y + " orders";
                        }
                    }
                }
            },
            scales:{
                x:commonScales.x,
                y:{
                    ...commonScales.y,
                    ticks:{
                        ...commonScales.y.ticks,
                        precision:0
                    }
                }
            }
        }
    });

    /*--- Update Analytics For Selected Period ---*/
    function updateAnalytics() {
        const period = $("sh-analytics-period").value;
        const data = analyticsData[period];
        const totalRevenue = data.revenue.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        const totalOrders = data.orders.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        const averageOrder = totalOrders ? totalRevenue / totalOrders : 0;

        const previousAverage = data.previousOrders
            ? data.previousRevenue / data.previousOrders
            : 0;

        $("sh-analytics-revenue").textContent = formatCurrency(totalRevenue);
        $("sh-analytics-orders").textContent = formatNumber(totalOrders);
        $("sh-analytics-aov").textContent = formatCurrency(averageOrder);
        $("sh-analytics-units").textContent = formatNumber(data.units);

        updateChange("sh-analytics-revenue-change", getChange(totalRevenue, data.previousRevenue));
        updateChange("sh-analytics-orders-change", getChange(totalOrders, data.previousOrders));
        updateChange("sh-analytics-aov-change", getChange(averageOrder, previousAverage));
        updateChange("sh-analytics-units-change", getChange(data.units, Math.max(1, data.units * .88)));

        const labels = data.revenue.map(function (_, index) {
            if (period === "90") return "Week " + (index + 1);
            return "Day " + (index + 1);
        });

        charts.revenue.data.labels = labels;
        charts.revenue.data.datasets[0].data = data.revenue;
        charts.revenue.data.datasets[1].data = data.orders;
        charts.revenue.update();

        charts.sales.data.labels = labels;
        charts.sales.data.datasets[0].data = data.orders;
        charts.sales.update();
    }

    /*--- Export Analytics CSV ---*/
    function exportCSV() {
        const period = $("sh-analytics-period").value;
        const data = analyticsData[period];
        const rows = [
            ["Stackly Smart Home - Demo Analytics"],
            ["Selected period", "Last " + period + " days"],
            [],
            ["Metric", "Value"],
            ["Total Revenue", data.revenue.reduce(function (sum, value) { return sum + value; }, 0)],
            ["Total Orders", data.orders.reduce(function (sum, value) { return sum + value; }, 0)],
            ["Average Order Value", Math.round(data.revenue.reduce(function (sum, value) { return sum + value; }, 0) / Math.max(1, data.orders.reduce(function (sum, value) { return sum + value; }, 0)))],
            ["Units Sold", data.units],
            [],
            ["Date / Period", "Revenue INR", "Orders"]
        ];

        data.revenue.forEach(function (revenue, index) {
            rows.push([
                period === "90" ? "Week " + (index + 1) : "Day " + (index + 1),
                revenue,
                data.orders[index]
            ]);
        });

        rows.push([]);
        rows.push(["Category", "Revenue Share (%)"]);
        categorySales.forEach(function (item) {
            rows.push([item.name, item.value]);
        });

        const csv = rows.map(function (row) {
            return row.map(function (cell) {
                const value = String(cell == null ? "" : cell);
                return '"' + value.replace(/"/g, '""') + '"';
            }).join(",");
        }).join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {type:"text/csv;charset=utf-8;"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "stackly-analytics-" + period + "-days.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    /*--- Analytics Events ---*/
    $("sh-analytics-period").addEventListener("change", updateAnalytics);
    $("sh-analytics-export").addEventListener("click", exportCSV);

    /*--- Initial Render ---*/
    renderCategoryLegend();
    renderTopProducts();
    renderActivities();
    renderInventory();
    updateAnalytics();
}
