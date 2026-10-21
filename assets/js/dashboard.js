/*--- Stackly Dashboard ---*/
document.addEventListener("DOMContentLoaded", function () {
    initStacklyDashboard();
});

/*--- Initialize Dashboard ---*/
function initStacklyDashboard() {
    const sidebar = document.getElementById("sh-dashboard-sidebar");
    const overlay = document.getElementById("sh-dashboard-overlay");
    const menuToggle = document.getElementById("sh-dashboard-menu-toggle");
    const closeButton = document.getElementById("sh-dashboard-close");
    const logoutButton = document.getElementById("sh-dashboard-logout");
    const profileButton = document.getElementById("sh-dashboard-profile-button");

    if (!sidebar) return;

    /*--- Read Saved User Data ---*/
    let profile = {};
    try {
        profile = JSON.parse(localStorage.getItem("shUserProfile") || "{}");
    } catch (error) {
        console.warn("Unable to read saved Stackly profile.", error);
    }

    const email = profile.email || localStorage.getItem("shUserEmail") || sessionStorage.getItem("shUserEmail") || "";
    const name = profile.name || localStorage.getItem("shUserName") || sessionStorage.getItem("shUserName") || "";
    const role = profile.role || localStorage.getItem("shUserRole") || sessionStorage.getItem("shUserRole") || "client";
    const phone = profile.phone || localStorage.getItem("shUserPhone") || sessionStorage.getItem("shUserPhone") || "";
    const profileImage = localStorage.getItem("shUserProfileImage") || sessionStorage.getItem("shUserProfileImage") || "assets/images/profile.png";

    /*--- Display Account Details ---*/
    document.querySelectorAll("[data-sh-user-email]").forEach(function (element) {
        element.textContent = email || "No email available";
        element.title = email;
    });

    document.querySelectorAll("[data-sh-user-name]").forEach(function (element) {
        element.textContent = name || "there";
    });

    document.querySelectorAll("[data-sh-user-role]").forEach(function (element) {
        element.textContent = role === "admin" ? "Administrator" : "Smart Home User";
    });

    document.querySelectorAll("[data-sh-profile-image]").forEach(function (image) {
        image.src = profileImage;
        image.onerror = function () {
            image.onerror = null;
            image.src = "assets/images/profile.png";
        };
    });

    /*--- Dashboard Page Title ---*/
    const pageTitle = document.getElementById("sh-dashboard-page-title");
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const pageMap = {
        "admin-dashboard.html": { title: "Dashboard", nav: "dashboard" },
        "client-dashboard.html": { title: "Dashboard", nav: "dashboard" },
        "admin-products.html": { title: "Products", nav: "devices" },
        "client-devices.html": { title: "My Devices", nav: "devices" },
        "admin-analytics.html": { title: "Analytics", nav: "analytics" },
        "client-analytics.html": { title: "Analytics", nav: "analytics" },
         "admin-profile.html": { title: "Profile", nav: "profile" },
        "client-profile.html": { title: "Profile", nav: "profile" }
    };
    const page = pageMap[currentPage] || pageMap["client-dashboard.html"];

    if (pageTitle) pageTitle.textContent = page.title;

    document.querySelectorAll("[data-sh-nav]").forEach(function (link) {
        const isActive = link.dataset.shNav === page.nav;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    /*--- Open Sidebar ---*/
    function openSidebar() {
        sidebar.classList.add("is-open");
        if (overlay) overlay.classList.add("is-visible");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("sh-dashboard-menu-open");
    }

    /*--- Close Sidebar ---*/
    function closeSidebar() {
        sidebar.classList.remove("is-open");
        if (overlay) overlay.classList.remove("is-visible");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("sh-dashboard-menu-open");
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            if (sidebar.classList.contains("is-open")) closeSidebar();
            else openSidebar();
        });
    }

    if (closeButton) closeButton.addEventListener("click", closeSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);

    /*--- Close Menu After Navigation ---*/
    sidebar.querySelectorAll(".sh-dashboard-nav-link[href]").forEach(function (link) {
        link.addEventListener("click", closeSidebar);
    });

    /*--- Escape Key ---*/
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeSidebar();
    });

    /*--- Responsive Sidebar Reset ---*/
    window.addEventListener("resize", function () {
        if (window.innerWidth > 991) closeSidebar();
    });

    /*--- Profile Button ---*/
    if (profileButton) {
        profileButton.addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }

    /*--- Logout ---*/
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            const shouldLogout = window.confirm("Are you sure you want to log out?");
            if (!shouldLogout) return;

            sessionStorage.removeItem("shUserEmail");
            sessionStorage.removeItem("shUserRole");
            sessionStorage.removeItem("shUserName");
            sessionStorage.removeItem("shUserPhone");
            sessionStorage.removeItem("shUserProfileImage");

            localStorage.removeItem("shUserEmail");
            localStorage.removeItem("shUserRole");
            localStorage.removeItem("shUserName");
            localStorage.removeItem("shUserPhone");
            localStorage.removeItem("shUserProfileImage");
            localStorage.removeItem("shUserProfile");

            window.location.replace("login.html");
        });
    }

    /*--- Footer Year ---*/
    const yearElement = document.getElementById("sh-dashboard-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    /*--- Contact Data For Other Dashboard Features ---*/
    window.shDashboardUser = {
        name: name,
        email: email,
        phone: phone,
        role: role
    };
}


const ssIndBlogReadButtons = document.querySelectorAll(".sh-dashboard-brand-icon,.sh-dashboard-brand-text");
    if (ssIndBlogReadButtons.length) {
        ssIndBlogReadButtons.forEach(function (ssButton) {
            ssButton.addEventListener("click", function (ssEvent) {
                ssEvent.preventDefault();
                ssEvent.stopPropagation();
                window.location.href = "index.html";
            });
        });
    }

