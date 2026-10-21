
/*--- Stackly Client Overview ---*/
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /*--- Read Registered Client Details ---*/
    let profile = {};

    try {
        profile = JSON.parse(localStorage.getItem("shUserProfile") || "{}") || {};
    } catch (error) {
        console.warn("Unable to read saved client profile.", error);
    }

    const name = profile.name ||
        localStorage.getItem("shUserName") ||
        sessionStorage.getItem("shUserName") ||
        "";

    const email = profile.email ||
        localStorage.getItem("shUserEmail") ||
        sessionStorage.getItem("shUserEmail") ||
        "Account";

    /*--- Personalize Welcome Message ---*/
    const nameElement = document.getElementById("sh-client-name");

    if (nameElement) {
        nameElement.textContent = name ? name.split(/\s+/)[0] : "there";
    }

    /*--- Update Shared Dashboard Email ---*/
    document.querySelectorAll("[data-sh-user-email]").forEach(function (element) {
        element.textContent = email;
    });

    /*--- Demo Overview Values ---*/
    const demo = {
        devices: 6,
        online: 5,
        offline: 1,
        energy: "4.8",
        automations: 3,
        weeklyEnergy: [45, 65, 52, 78, 58, 88, 68]
    };

    /*--- Update Device Summary ---*/
    const summaryElements = {
        "sh-client-device-total": demo.devices,
        "sh-client-device-online": demo.online,
        "sh-client-automation-total": demo.automations,
        "sh-client-health-online": demo.online,
        "sh-client-health-offline": demo.offline,
        "sh-client-health-total": demo.devices,
        "sh-client-energy-today": demo.energy,
        "sh-client-energy-total": demo.energy
    };

    Object.entries(summaryElements).forEach(function ([id, value]) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });

    /*--- Calculate Illustrative Device Health ---*/
    const healthPercent = demo.devices
        ? Math.round((demo.online / demo.devices) * 100)
        : 0;

    const percentElement = document.getElementById("sh-client-health-percent");
    if (percentElement) percentElement.textContent = healthPercent + "%";

    const ring = document.querySelector(".sh-client-health-ring");
    if (ring) {
        const degrees = (healthPercent / 100) * 360;
        ring.style.background =
            "conic-gradient(#b6ff4a 0deg " + degrees + "deg, #35413b " + degrees + "deg 360deg)";
    }

    /*--- Render Illustrative Weekly Energy Bars ---*/
    const barsContainer = document.getElementById("sh-client-energy-bars");

    if (barsContainer) {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        barsContainer.innerHTML = demo.weeklyEnergy.map(function (value, index) {
            return `
                <div class="sh-client-bar-item">
                    <div class="sh-client-bar ${index === 6 ? "sh-client-bar-today" : ""}"
                         style="height:${value}%"
                         title="${days[index]}: illustrative usage"></div>
                    <span>${days[index]}</span>
                </div>`;
        }).join("");
    }
});
