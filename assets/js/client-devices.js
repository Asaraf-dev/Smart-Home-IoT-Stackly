
/*--- Client Devices ---*/
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /*--- Select Page Elements ---*/
    const root = document.getElementById("sh-client-devices");
    if (!root) return;

    const grid = document.getElementById("sh-devices-grid");
    const search = document.getElementById("sh-devices-search");
    const category = document.getElementById("sh-devices-category");
    const status = document.getElementById("sh-devices-status");
    const sort = document.getElementById("sh-devices-sort");
    const empty = document.getElementById("sh-devices-empty");
    const resultCount = document.getElementById("sh-devices-result-count");
    const resetButton = document.getElementById("sh-devices-reset");

    const cards = Array.from(grid.querySelectorAll(".sh-device-card"));

    /*--- Filter And Sort Devices ---*/
    function updateDevices() {
        const query = search.value.trim().toLowerCase();
        const selectedCategory = category.value;
        const selectedStatus = status.value;
        const selectedSort = sort.value;

        let visibleCards = cards.filter(function (card) {
            const name = card.dataset.name.toLowerCase();
            const deviceCategory = card.dataset.category;
            const deviceStatus = card.dataset.status;

            return name.includes(query) &&
                (selectedCategory === "all" || deviceCategory === selectedCategory) &&
                (selectedStatus === "all" || deviceStatus === selectedStatus);
        });

        visibleCards.sort(function (a, b) {
            if (selectedSort === "category") {
                return a.dataset.category.localeCompare(b.dataset.category) ||
                    a.dataset.name.localeCompare(b.dataset.name);
            }

            if (selectedSort === "status") {
                return a.dataset.status.localeCompare(b.dataset.status) ||
                    a.dataset.name.localeCompare(b.dataset.name);
            }

            return a.dataset.name.localeCompare(b.dataset.name);
        });

        /*--- Render Matching Cards ---*/
        visibleCards.forEach(function (card) {
            grid.appendChild(card);
            card.hidden = false;
        });

        cards.filter(function (card) {
            return !visibleCards.includes(card);
        }).forEach(function (card) {
            card.hidden = true;
        });

        /*--- Update Results Count ---*/
        const count = visibleCards.length;
        resultCount.textContent = "Showing " + count + " of " + cards.length + " devices";

        empty.hidden = count !== 0;
        grid.hidden = count === 0;

        /*--- Update Device Statistics ---*/
        document.getElementById("sh-devices-total").textContent = cards.length;
        document.getElementById("sh-devices-online").textContent =
            cards.filter(function (card) {
                return card.dataset.status === "online";
            }).length;
        document.getElementById("sh-devices-offline").textContent =
            cards.filter(function (card) {
                return card.dataset.status === "offline";
            }).length;
        document.getElementById("sh-devices-categories").textContent =
            new Set(cards.map(function (card) {
                return card.dataset.category;
            })).size;
    }

    /*--- Search And Filter Events ---*/
    search.addEventListener("input", updateDevices);
    category.addEventListener("change", updateDevices);
    status.addEventListener("change", updateDevices);
    sort.addEventListener("change", updateDevices);

    /*--- Reset Filters ---*/
    resetButton.addEventListener("click", function () {
        search.value = "";
        category.value = "all";
        status.value = "all";
        sort.value = "name";
        updateDevices();
    });

    /*--- Initial Render ---*/
    updateDevices();

    /*--- Display Registered Account Email ---*/
    const email = localStorage.getItem("shUserEmail") ||
        sessionStorage.getItem("shUserEmail") ||
        "Account";

    document.querySelectorAll("[data-sh-user-email]").forEach(function (element) {
        element.textContent = email;
    });
});
