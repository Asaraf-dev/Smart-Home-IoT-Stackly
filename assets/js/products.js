/*--- All Products Catalogue Section Start ---*/
(function () {
    "use strict";
    /*--- Product Data ---*/
    const products = [
        {
            id: 1,
            name: "Luma Smart Bulb",
            category: "lighting",
            categoryLabel: "Smart Lighting",
            price: 1299,
            badge: "POPULAR",
            icon: "bi-lightbulb",
            image: "assets/images/iot-4.webp",
            description: "Set the mood with convenient smart lighting and customizable everyday ambience.",
            features: ["Adjustable lighting ambience", "Designed for connected-home setups", "Simple everyday lighting control"],
            searchTerms: "bulb led brightness lamp lights"
        },
        {
            id: 2,
            name: "Aura Light Strip",
            category: "lighting",
            categoryLabel: "Smart Lighting",
            price: 1899,
            badge: "AMBIENCE",
            icon: "bi-rainbow",
            image: "assets/images/iot-5.webp",
            description: "Add a modern accent to shelves, desks, and entertainment spaces with decorative lighting.",
            features: ["Accent lighting for interiors", "Flexible room styling", "Pairs with compatible lighting controls"],
            searchTerms: "rgb strip ambient decorative desk shelf"
        },
        {
            id: 3,
            name: "Halo Smart Switch",
            category: "lighting",
            categoryLabel: "Smart Lighting",
            price: 1599,
            badge: "ESSENTIAL",
            icon: "bi-toggle-on",
            image: "assets/images/iot-1.webp",
            description: "Bring a cleaner, more convenient control experience to compatible lighting circuits.",
            features: ["Convenient light switching", "Designed for compatible installations", "Check electrical requirements before setup"],
            searchTerms: "wall switch electrical smart home control"
        },
        {
            id: 4,
            name: "Sentinel Smart Camera",
            category: "security",
            categoryLabel: "Home Security",
            price: 3499,
            badge: "SECURITY",
            icon: "bi-camera-video",
            image: "assets/images/iot-6.webp",
            description: "Explore a connected camera concept designed for greater awareness around your home.",
            features: ["Camera-based monitoring concept", "Check storage and network requirements", "Review privacy settings before installation"],
            searchTerms: "cctv surveillance video camera monitoring"
        },
        {
            id: 5,
            name: "Guardian Door Sensor",
            category: "security",
            categoryLabel: "Home Security",
            price: 999,
            badge: "COMPACT",
            icon: "bi-door-closed",
            image: "assets/images/iot-7.webp",
            description: "A compact sensor concept for tracking door or window state in a compatible smart-home setup.",
            features: ["Door and window state sensing concept", "Compact installation design", "Requires a compatible connection method"],
            searchTerms: "door window magnetic contact entry alarm"
        },
        {
            id: 6,
            name: "Vision Smart Doorbell",
            category: "security",
            categoryLabel: "Home Security",
            price: 4299,
            badge: "SMART ACCESS",
            icon: "bi-bell",
            image: "assets/images/iot-8.webp",
            description: "Explore a connected entryway solution built around more convenient visitor awareness.",
            features: ["Connected entryway concept", "Check video and notification capabilities", "Confirm installation and connectivity requirements"],
            searchTerms: "video door bell visitor entrance smart access"
        },
        {
            id: 7,
            name: "Clima Smart Thermostat",
            category: "climate",
            categoryLabel: "Climate Control",
            price: 2999,
            badge: "COMFORT",
            icon: "bi-thermometer-half",
            image: "assets/images/iot-9.webp",
            description: "Explore a more intuitive way to manage your indoor comfort with compatible climate equipment.",
            features: ["Centralized temperature control concept", "Designed around daily comfort preferences", "Verify HVAC compatibility before purchase"],
            searchTerms: "temperature thermostat heating cooling hvac"
        },
        {
            id: 8,
            name: "Breeze Climate Controller",
            category: "climate",
            categoryLabel: "Climate Control",
            price: 2199,
            badge: "COMFORT",
            icon: "bi-wind",
            image: "assets/images/iot-10.webp",
            description: "Discover a connected control concept for compatible cooling and ventilation equipment.",
            features: ["Climate control concept", "Designed for compatible equipment", "Check supported protocols and appliances"],
            searchTerms: "air conditioner fan ac ventilation controller"
        },
        {
            id: 9,
            name: "AirSense Environment Sensor",
            category: "sensors",
            categoryLabel: "Smart Sensors",
            price: 1499,
            badge: "AWARENESS",
            icon: "bi-moisture",
            image: "assets/images/iot-11.webp",
            description: "Explore environmental sensing for a home setup designed around useful indoor insights.",
            features: ["Environmental sensing concept", "Check supported measurements before choosing", "Works with compatible monitoring systems"],
            searchTerms: "air quality humidity environment temperature sensor"
        },
        {
            id: 10,
            name: "MotionSense Detector",
            category: "sensors",
            categoryLabel: "Smart Sensors",
            price: 1199,
            badge: "RESPONSIVE",
            icon: "bi-broadcast",
            image: "assets/images/iot-12.webp",
            description: "Explore motion detection as a trigger for compatible lighting and automation routines.",
            features: ["Motion-trigger concept", "Can support routines when properly integrated", "Verify detection range and compatibility"],
            searchTerms: "movement presence occupancy detector pir"
        },
        {
            id: 11,
            name: "Nexus Smart Hub",
            category: "automation",
            categoryLabel: "Home Automation",
            price: 4999,
            badge: "CONNECTED",
            icon: "bi-diagram-3",
            image: "assets/images/iot-2.webp",
            description: "Explore a central hub concept for coordinating supported devices and smart-home routines.",
            features: ["Centralized device coordination concept", "Protocol compatibility must be verified", "Check supported device limits and network needs"],
            searchTerms: "gateway bridge controller network hub wifi"
        },
        {
            id: 12,
            name: "Routine Automation Kit",
            category: "automation",
            categoryLabel: "Home Automation",
            price: 3799,
            badge: "SMART ROUTINES",
            icon: "bi-lightning-charge",
            image: "assets/images/iot-14.webp",
            description: "Explore a starter collection of compatible devices for building personalized home routines.",
            features: ["Designed around everyday routines", "Choose devices compatible with your setup", "Final contents depend on the selected bundle"],
            searchTerms: "starter kit scenes routine automation bundle package"
        }
    ];
    /*--- Catalogue Elements ---*/
    let initialized = false;
    let activeCategory = "all";
    let searchQuery = "";
    let sortMode = "featured";
    let productModal = null;
    let catalogueGrid;
    let catalogueSearch;
    let catalogueSort;
    let catalogueTotal;
    let catalogueResults;
    let catalogueCategories;
    let catalogueEmpty;
    let catalogueReset;
    let searchClear;
    let modalBody;
    /*--- Initialize Catalogue ---*/
    function initProductsCatalogue() {
        if (initialized) return;
        catalogueGrid = document.getElementById("sh-prd-catalog-grid");
        if (!catalogueGrid) return;
        catalogueSearch = document.getElementById("sh-prd-catalog-search");
        catalogueSort = document.getElementById("sh-prd-catalog-sort");
        catalogueTotal = document.getElementById("sh-prd-catalog-total");
        catalogueResults = document.getElementById("sh-prd-catalog-results-text");
        catalogueCategories = document.getElementById("sh-prd-catalog-categories");
        catalogueEmpty = document.getElementById("sh-prd-catalog-empty");
        catalogueReset = document.getElementById("sh-prd-catalog-reset");
        searchClear = document.getElementById("sh-prd-catalog-search-clear");
        modalBody = document.getElementById("sh-prd-modal-body");
        const modalElement = document.getElementById("sh-prd-catalog-modal");
        if (modalElement && window.bootstrap && window.bootstrap.Modal) {
            productModal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        }
        catalogueSearch.addEventListener("input", function () {
            searchQuery = this.value.trim().toLowerCase();
            searchClear.hidden = !this.value;
            renderProducts();
        });
        searchClear.addEventListener("click", function () {
            catalogueSearch.value = "";
            searchQuery = "";
            searchClear.hidden = true;
            catalogueSearch.focus();
            renderProducts();
        });
        catalogueSort.addEventListener("change", function () {
            sortMode = this.value;
            renderProducts();
        });
        catalogueCategories.addEventListener("click", function (event) {
            const categoryButton = event.target.closest("[data-category]");
            if (!categoryButton) return;
            activeCategory = categoryButton.dataset.category;
            updateCategoryButtons();
            renderProducts();
        });
        catalogueReset.addEventListener("click", resetFilters);
        document.getElementById("sh-prd-catalog-empty-reset").addEventListener("click", resetFilters);
        catalogueGrid.addEventListener("click", function (event) {
            const detailsButton = event.target.closest("[data-product-details]");
            if (!detailsButton) return;
            openProductDetails(Number(detailsButton.dataset.productDetails));
        });
        initialized = true;
        updateCategoryButtons();
        renderProducts();
    }
    /*--- Get Filtered Products ---*/
    function getFilteredProducts() {
        const filteredProducts = products.filter(function (product) {
            const matchesCategory = activeCategory === "all" || product.category === activeCategory;
            const searchableText = [
                product.name,
                product.categoryLabel,
                product.description,
                product.searchTerms,
                product.features.join(" ")
            ].join(" ").toLowerCase();
            const matchesSearch = !searchQuery || searchableText.includes(searchQuery);
            return matchesCategory && matchesSearch;
        });
        if (sortMode === "name-asc") filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        if (sortMode === "name-desc") filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        if (sortMode === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
        if (sortMode === "price-desc") filteredProducts.sort((a, b) => b.price - a.price);
        if (sortMode === "featured") filteredProducts.sort((a, b) => a.id - b.id);
        return filteredProducts;
    }
    /*--- Render Product Cards ---*/
    function renderProducts() {
        const filteredProducts = getFilteredProducts();
        catalogueGrid.innerHTML = filteredProducts.map(function (product) {
            return `
                <article class="sh-prd-catalog-card">
                    <div class="sh-prd-catalog-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/800x600/10151b/B6FF4A?text=Stackly+Smart+Home';">
                        <span class="sh-prd-catalog-badge">${product.badge}</span>
                        <span class="sh-prd-catalog-product-icon"><i class="bi ${product.icon}" aria-hidden="true"></i></span>
                    </div>
                    <div class="sh-prd-catalog-card-content">
                        <span class="sh-prd-catalog-card-category">${product.categoryLabel}</span>
                        <h3>${product.name}</h3>
                        <p class="sh-prd-catalog-card-description">${product.description}</p>
                        <div class="sh-prd-catalog-card-meta">
                            <div class="sh-prd-catalog-card-price"><small>Indicative price</small>${formatPrice(product.price)}</div>
                            <button type="button" class="sh-prd-catalog-card-details" data-product-details="${product.id}" aria-label="View details for ${product.name}">View Details <i class="bi bi-arrow-up-right"></i></button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
        catalogueTotal.textContent = filteredProducts.length;
        catalogueResults.innerHTML = `Showing <strong>${filteredProducts.length}</strong> of <strong>${products.length}</strong> products`;
        catalogueEmpty.hidden = filteredProducts.length !== 0;
        catalogueGrid.hidden = filteredProducts.length === 0;
        catalogueReset.hidden = activeCategory === "all" && !searchQuery && sortMode === "featured";
        updateCategoryCounts();
    }
    /*--- Update Category Buttons ---*/
    function updateCategoryButtons() {
        catalogueCategories.querySelectorAll("[data-category]").forEach(function (button) {
            const isActive = button.dataset.category === activeCategory;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }
    /*--- Update Category Counts ---*/
    function updateCategoryCounts() {
        catalogueCategories.querySelectorAll("[data-category]").forEach(function (button) {
            const category = button.dataset.category;
            const count = category === "all" ? products.length : products.filter(product => product.category === category).length;
            let countElement = button.querySelector("span");
            if (countElement) {
                countElement.textContent = count;
            } else {
                countElement = document.createElement("span");
                countElement.textContent = count;
                button.appendChild(countElement);
            }
        });
    }
    /*--- Open Product Details ---*/
    function openProductDetails(productId) {
        const product = products.find(item => item.id === productId);
        if (!product || !modalBody) return;
        modalBody.innerHTML = `
            <div class="sh-prd-modal-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/800x800/10151b/B6FF4A?text=Stackly+Smart+Home';">
            </div>
            <div class="sh-prd-modal-content">
                <span class="sh-prd-modal-category">${product.categoryLabel} / ${product.badge}</span>
                <h3 id="sh-prd-modal-title">${product.name}</h3>
                <p class="sh-prd-modal-description">${product.description}</p>
                <div class="sh-prd-modal-price"><small>Indicative price in INR</small>${formatPrice(product.price)}</div>
                <ul class="sh-prd-modal-features">${product.features.map(feature => `<li><i class="bi bi-check-circle-fill" aria-hidden="true"></i><span>${feature}</span></li>`).join("")}</ul>
                <a class="sh-prd-modal-cta" href="404.html">Enquire About This Product <i class="bi bi-arrow-up-right"></i></a>
            </div>
        `;
        if (productModal) {
            productModal.show();
        } else {
            window.location.href = "contact.html?product=" + encodeURIComponent(product.name);
        }
    }
    /*--- Reset Catalogue Filters ---*/
    function resetFilters() {
        activeCategory = "all";
        searchQuery = "";
        sortMode = "featured";
        catalogueSearch.value = "";
        catalogueSort.value = "featured";
        searchClear.hidden = true;
        updateCategoryButtons();
        renderProducts();
    }
    /*--- Format Product Price ---*/
    function formatPrice(price) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(price);
    }
    /*--- Start Catalogue ---*/
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProductsCatalogue);
    } else {
        initProductsCatalogue();
    }
    window.initStacklyProductsCatalogue = initProductsCatalogue;
})();
/*--- All Products Catalogue Section End ---*/
