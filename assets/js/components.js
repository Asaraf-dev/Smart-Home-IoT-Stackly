
/*--- Stackly Shared Components ---*/
document.addEventListener("DOMContentLoaded", function() {
    initStacklyComponents();
});
/*--- Initialize Shared Components ---*/
async function initStacklyComponents() {
    await Promise.all([
        loadStacklyComponent("sh-navbar-component", "assets/components/navbar.html", initNavbarComponent),
        loadStacklyComponent("sh-page-hero-component", "assets/components/page-hero.html", initPageHeroComponent),
        loadStacklyComponent("sh-footer-component", "assets/components/footer.html", initFooterComponent)
    ]);
}
/*--- Initialize Page Hero Component ---*/
function initPageHeroComponent() {
    const container = document.getElementById("sh-page-hero-component");
    if (typeof window.initStacklyPageHero === "function") {
        window.initStacklyPageHero(container);
    } else {
        console.warn("Stackly page hero initializer is unavailable. Check assets/js/all-hero.js.");
    }
}

/*--- Load HTML Component ---*/
async function loadStacklyComponent(containerId, componentPath, initializeComponent) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const response = await fetch(componentPath, {cache:"no-cache"});
        if (!response.ok) {
            throw new Error("HTTP " + response.status + " while loading " + componentPath);
        }
        const componentHTML = await response.text();
        container.innerHTML = componentHTML;
        if (typeof initializeComponent === "function") {
            initializeComponent();
        }
        container.dispatchEvent(new CustomEvent("sh:component-loaded", {
            bubbles:true,
            detail:{containerId:containerId, componentPath:componentPath}
        }));
    } catch (error) {
        console.error("Stackly component loading failed:", componentPath, error);
        container.dispatchEvent(new CustomEvent("sh:component-error", {
            bubbles:true,
            detail:{containerId:containerId, componentPath:componentPath, error:error}
        }));
    }
}
/*--- Initialize Navbar Component ---*/
function initNavbarComponent() {
    if (typeof window.initStacklyNavbar === "function") {
        window.initStacklyNavbar();
    } else {
        console.warn("Stackly navbar initializer is unavailable. Check assets/js/navbar.js.");
    }
}
/*--- Initialize Footer Component ---*/
function initFooterComponent() {
    if (typeof window.initStacklyFooter === "function") {
        window.initStacklyFooter();
    } else {
        console.warn("Stackly footer initializer is unavailable. Check assets/js/footer.js.");
    }
}
