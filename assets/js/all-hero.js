/*--- Stackly Inner Page Hero ---*/
(function() {
    /*--- Page Content Configuration ---*/
    const heroPages = {
        about: {
            breadcrumb: "About Us",
            eyebrow: "GET TO KNOW STACKLY",
            title: "Technology that makes <span>home feel smarter.</span>",
            description: "Discover a more connected way of living with intelligent solutions designed around your comfort, security, and everyday routines.",
            primaryText: "Explore Solutions",
            primaryUrl: "404.html",
            secondaryText: "Let's Talk",
            secondaryUrl: "404.html"
        },
        products: {
            breadcrumb: "Our Products",
            eyebrow: "DISCOVER SMART SOLUTIONS",
            title: "Every device has a purpose. <span>Every space has potential.</span>",
            description: "Explore connected devices and intelligent home solutions designed to bring comfort, awareness, and control into your everyday life.",
            primaryText: "Explore Products",
            primaryUrl: "404.html",
            secondaryText: "Find Your Solution",
            secondaryUrl: "404.html"
        },
        blog: {
            breadcrumb: "Our Blog",
            eyebrow: "IDEAS FOR INTELLIGENT LIVING",
            title: "Fresh ideas for a <span>smarter everyday.</span>",
            description: "Explore practical guides, smart home inspiration, connected technology trends, and ideas to help you make more of your living space.",
            primaryText: "Read Articles",
            primaryUrl: "404.html",
            secondaryText: "Explore Solutions",
            secondaryUrl: "404.html"
        },
        contact: {
            breadcrumb: "Contact Us",
            eyebrow: "LET'S CONNECT",
            title: "Your smarter home <span>starts with a conversation.</span>",
            description: "Have a question or planning a connected home? Talk to our team and explore the possibilities for your space.",
            primaryText: "Send an Enquiry",
            primaryUrl: "404.html",
            secondaryText: "Explore Solutions",
            secondaryUrl: "404.html"
        }
    };
    /*--- Device Information ---*/
    const deviceDetails = {
        lighting: {
            title: "Smart Lighting",
            description: "Explore connected lighting concepts for ambience, convenience, and personalized routines.",
            status: "Ambient mode"
        },
        security: {
            title: "Home Security",
            description: "Explore connected security concepts for greater awareness and a more informed home.",
            status: "Connected concept"
        },
        climate: {
            title: "Climate Control",
            description: "Explore temperature-control concepts designed around comfort and daily preferences.",
            status: "Comfort settings"
        },
        sensors: {
            title: "Smart Sensors",
            description: "Explore sensors that can support connected routines and device interactions.",
            status: "Sensor concept"
        }
    };
    /*--- Update Hero Content ---*/
    function setHeroContent(hero, page) {
        const content = heroPages[page] || heroPages.about;
        const setText = function(id, value) {
            const element = hero.querySelector("#" + id);
            if (element) element.textContent = value;
        };
        const setHTML = function(id, value) {
            const element = hero.querySelector("#" + id);
            if (element) element.innerHTML = value;
        };
        setText("sh-all-hero-breadcrumb-current", content.breadcrumb);
        setText("sh-all-hero-eyebrow-text", content.eyebrow);
        setHTML("sh-all-hero-title", content.title);
        setText("sh-all-hero-description", content.description);
        const primary = hero.querySelector("#sh-all-hero-primary");
        const secondary = hero.querySelector("#sh-all-hero-secondary");
        if (primary) {
            primary.childNodes[0].textContent = content.primaryText + " ";
            primary.href = content.primaryUrl;
        }
        if (secondary) {
            const icon = secondary.querySelector(".sh-all-hero-play");
            secondary.textContent = "";
            if (icon) secondary.appendChild(icon);
            secondary.appendChild(document.createTextNode(" " + content.secondaryText));
            secondary.href = content.secondaryUrl;
        }
    }
    /*--- Initialize Interactive Device Nodes ---*/
    function initDeviceNodes(hero) {
        const info = hero.querySelector("#sh-all-hero-device-info");
        const nodes = hero.querySelectorAll(".sh-all-hero-node[data-device]");
        const lightStatus = hero.querySelector("#sh-all-hero-light-status");
        const securityStatus = hero.querySelector("#sh-all-hero-security-status");
        if (!info || !nodes.length) return;
        nodes.forEach(function(node) {
            node.addEventListener("click", function() {
                const device = deviceDetails[node.dataset.device];
                if (!device) return;
                const wasActive = node.classList.contains("is-active");
                nodes.forEach(function(item) {
                    item.classList.remove("is-active");
                    item.setAttribute("aria-pressed", "false");
                });
                if (wasActive) {
                    info.classList.remove("is-visible");
                    return;
                }
                node.classList.add("is-active");
                node.setAttribute("aria-pressed", "true");
                info.textContent = device.title + " — " + device.description;
                info.classList.add("is-visible");
                if (node.dataset.device === "lighting" && lightStatus) {
                    lightStatus.textContent = device.status;
                }
                if (node.dataset.device === "security" && securityStatus) {
                    securityStatus.textContent = device.status;
                }
            });
        });
    }
    /*--- Initialize Inner Page Hero ---*/
    window.initStacklyPageHero = function(container) {
        if (!container) return;
        const hero = container.querySelector(".sh-all-hero");
        if (!hero || hero.dataset.initialized === "true") return;
        const page = container.dataset.page || hero.dataset.page || "about";
        hero.dataset.initialized = "true";
        setHeroContent(hero, page);
        initDeviceNodes(hero);
    };
    /*--- Initialize Existing Hero Markup ---*/
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll(".sh-all-hero").forEach(function(hero) {
            const container = hero.closest("[data-page]") || hero;
            window.initStacklyPageHero(container);
        });
    });
})();