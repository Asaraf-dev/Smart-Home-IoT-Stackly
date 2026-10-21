/*--- Admin Overview Initialization ---*/
document.addEventListener("DOMContentLoaded", function () {
    initAdminOverview();
});

/*--- Initialize Admin Overview ---*/
function initAdminOverview() {
    const overview = document.querySelector(".sh-admin-overview");
    if (!overview) return;

    /*--- Current Date ---*/
    const dateElement = document.getElementById("sh-admin-overview-date");
    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

    /*--- Sample Chart Tooltips ---*/
    overview.querySelectorAll(".sh-admin-overview-bar").forEach(function (bar) {
        const value = bar.dataset.value;
        if (value) {
            bar.title = "Sample activity index: " + value;
            bar.setAttribute("aria-label", "Sample activity index " + value);
            bar.setAttribute("role", "img");
        }
    });

    /*--- Update Overview Statistics ---*/
    window.updateAdminOverviewStats = function (stats) {
        if (!stats || typeof stats !== "object") return;

        Object.keys(stats).forEach(function (key) {
            const element = overview.querySelector('[data-admin-stat="' + key + '"]');
            if (!element) return;

            const value = stats[key];
            if (typeof value === "number" && Number.isFinite(value)) {
                element.textContent = value.toLocaleString("en-IN");
            }
        });
    };
}