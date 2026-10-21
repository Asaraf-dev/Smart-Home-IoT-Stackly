
/*--- Stackly Navbar Interactions ---*/
window.initStacklyNavbar = function() {
    const header = document.getElementById("sh-nav-header");
    const menu = document.getElementById("sh-nav-menu");
    const toggle = document.getElementById("sh-nav-toggle");
    const closeButton = document.getElementById("sh-nav-close");
    if (!header || !menu || !toggle || header.dataset.initialized === "true") return;
    header.dataset.initialized = "true";
    /*--- Mobile Menu Controls ---*/
    function openMenu() {
        menu.classList.add("sh-nav-menu-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation");
        if (closeButton) closeButton.focus();
    }
    function closeMenu(returnFocus = false) {
        menu.classList.remove("sh-nav-menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
        if (returnFocus) toggle.focus();
    }
    toggle.addEventListener("click", function() {
        if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
        else openMenu();
    });
    if (closeButton) closeButton.addEventListener("click", function() {
        closeMenu(true);
    });
    /*--- Active Page Link ---*/
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    menu.querySelectorAll(".sh-nav-link").forEach(function(link) {
        const active = link.dataset.page === currentPage;
        link.classList.toggle("sh-nav-active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
        link.addEventListener("click", function() {
            closeMenu();
        });
    });
    /*--- Header Scroll Effect ---*/
    function updateHeader() {
        header.classList.toggle("sh-nav-scrolled", window.scrollY > 25);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, {passive:true});
    /*--- Outside Click And Keyboard ---*/
    document.addEventListener("click", function(event) {
        if (toggle.getAttribute("aria-expanded") === "true" && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") closeMenu(true);
    });
    window.addEventListener("resize", function() {
        if (window.innerWidth > 991) closeMenu();
    });
};
/*--- Navbar Initialization ---*/
document.addEventListener("DOMContentLoaded", function() {
    window.initStacklyNavbar();
});
