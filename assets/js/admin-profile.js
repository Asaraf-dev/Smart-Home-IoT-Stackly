
/*--- Stackly Admin Profile ---*/
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /*--- Read Saved Registration Profile ---*/
    let profile = {};

    try {
        profile = JSON.parse(localStorage.getItem("shUserProfile") || "{}") || {};
    } catch (error) {
        console.warn("Unable to read saved profile.", error);
    }

    /*--- Read Saved Account Details ---*/
    const name = profile.name || localStorage.getItem("shUserName") || sessionStorage.getItem("shUserName") || "Name not available";
    const phone = profile.phone || localStorage.getItem("shUserPhone") || sessionStorage.getItem("shUserPhone") || "Not provided";
    const email = profile.email || localStorage.getItem("shUserEmail") || sessionStorage.getItem("shUserEmail") || "Email not available";
    const role = profile.role || localStorage.getItem("shUserRole") || sessionStorage.getItem("shUserRole") || "admin";

    /*--- Display Profile Summary ---*/
    document.getElementById("sh-admin-profile-name").textContent = name;
    document.getElementById("sh-admin-profile-email").textContent = email;

    /*--- Display Personal Information ---*/
    document.getElementById("sh-admin-profile-detail-name").textContent = name;
    document.getElementById("sh-admin-profile-phone").textContent = phone;
    document.getElementById("sh-admin-profile-detail-email").textContent = email;
    document.getElementById("sh-admin-profile-detail-role").textContent = role.charAt(0).toUpperCase() + role.slice(1);
    document.getElementById("sh-admin-profile-role").innerHTML = '<i class="bi bi-shield-check"></i> ' + (role.charAt(0).toUpperCase() + role.slice(1));

    /*--- Update Shared Dashboard Account Details ---*/
    document.querySelectorAll("[data-sh-user-email]").forEach(function (element) {
        element.textContent = email;
    });

    document.querySelectorAll("[data-sh-user-role]").forEach(function (element) {
        element.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    });
});
