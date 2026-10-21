/*--- All Articles Catalogue Section Start ---*/
(function () {
    "use strict";
    /*--- Article Data ---*/
    const articles = [
        {
            id: 1,
            slug: "smart-home-guide",
            title: "The Complete Guide to Building a Smarter Home",
            category: "smart-home",
            categoryLabel: "Smart Home",
            date: "2026-10-12",
            displayDate: "Oct 12, 2026",
            readingTime: 8,
            author: "Stackly Editorial",
            description: "Discover how to plan your smart home, choose compatible devices, and build connected routines that fit your everyday lifestyle.",
            image: "assets/images/home-hero-img.webp",
            keywords: "beginner connected living home devices setup ecosystem"
        },
        {
            id: 2,
            slug: "iot-explained",
            title: "IoT Explained: How Connected Devices Communicate",
            category: "iot",
            categoryLabel: "IoT Technology",
            date: "2026-10-09",
            displayDate: "Oct 9, 2026",
            readingTime: 6,
            author: "Stackly Editorial",
            description: "Understand the Internet of Things, the role of sensors, and how connected devices exchange information.",
            image: "assets/images/blog-1.webp",
            keywords: "internet things sensors networks data communication technology"
        },
        {
            id: 3,
            slug: "smart-home-security",
            title: "Essential Smart Home Security Practices",
            category: "security",
            categoryLabel: "Home Security",
            date: "2026-10-06",
            displayDate: "Oct 6, 2026",
            readingTime: 7,
            author: "Stackly Editorial",
            description: "Learn practical ways to protect connected devices with stronger passwords, updates, and thoughtful privacy settings.",
            image: "assets/images/iot-1.webp",
            keywords: "camera protection privacy passwords secure network surveillance"
        },
        {
            id: 4,
            slug: "everyday-automation",
            title: "5 Smart Automation Ideas for Everyday Living",
            category: "automation",
            categoryLabel: "Automation",
            date: "2026-10-03",
            displayDate: "Oct 3, 2026",
            readingTime: 5,
            author: "Stackly Editorial",
            description: "Explore useful morning, evening, and away-from-home routines that can make daily tasks more convenient.",
            image: "assets/images/iot-3.webp",
            keywords: "routines scenes schedule lighting comfort daily tasks"
        },
        {
            id: 5,
            slug: "smart-lighting-energy",
            title: "Can Smart Lighting Help Reduce Energy Use?",
            category: "energy",
            categoryLabel: "Energy Efficiency",
            date: "2026-09-28",
            displayDate: "Sep 28, 2026",
            readingTime: 6,
            author: "Stackly Editorial",
            description: "Explore lighting schedules, occupancy-based controls, and practical habits that may reduce unnecessary energy use.",
            image: "assets/images/iot-4.webp",
            keywords: "electricity consumption efficient bulbs led sustainability savings"
        },
        {
            id: 6,
            slug: "choosing-smart-devices",
            title: "How to Choose the Right Smart Home Devices",
            category: "guides",
            categoryLabel: "Product Guides",
            date: "2026-09-24",
            displayDate: "Sep 24, 2026",
            readingTime: 9,
            author: "Stackly Editorial",
            description: "Compare device requirements, connectivity, installation needs, and compatibility before making a purchase.",
            image: "assets/images/iot-2.webp",
            keywords: "buying guide compare products budget compatibility features"
        },
        {
            id: 7,
            slug: "wifi-zigbee-matter",
            title: "Wi-Fi vs Zigbee vs Matter: What Should You Know?",
            category: "iot",
            categoryLabel: "IoT Technology",
            date: "2026-09-20",
            displayDate: "Sep 20, 2026",
            readingTime: 8,
            author: "Stackly Editorial",
            description: "Understand the differences between common smart-home connectivity options and why compatibility matters.",
            image: "assets/images/blog-6.webp",
            keywords: "wireless protocol mesh bluetooth network interoperability"
        },
        {
            id: 8,
            slug: "smart-thermostat-basics",
            title: "Smart Thermostats and Comfortable Indoor Living",
            category: "smart-home",
            categoryLabel: "Smart Home",
            date: "2026-09-16",
            displayDate: "Sep 16, 2026",
            readingTime: 5,
            author: "Stackly Editorial",
            description: "Learn what smart thermostats do, which systems they support, and what to check before installation.",
            image: "assets/images/blog-2.webp",
            keywords: "climate control temperature heating cooling hvac"
        },
        {
            id: 9,
            slug: "secure-your-iot-network",
            title: "Simple Ways to Secure Your IoT Network",
            category: "security",
            categoryLabel: "Home Security",
            date: "2026-09-12",
            displayDate: "Sep 12, 2026",
            readingTime: 7,
            author: "Stackly Editorial",
            description: "Discover network security basics for connected homes, from router settings to device updates and guest networks.",
            image: "assets/images/blog-4.webp",
            keywords: "cybersecurity router encryption wifi privacy updates"
        },
        {
            id: 10,
            slug: "smart-home-beginner-checklist",
            title: "Your First Smart Home: A Beginner's Checklist",
            category: "guides",
            categoryLabel: "Product Guides",
            date: "2026-09-08",
            displayDate: "Sep 8, 2026",
            readingTime: 4,
            author: "Stackly Editorial",
            description: "Start with a clear plan for your network, first devices, compatibility requirements, and preferred controls.",
            image: "assets/images/blog-5.webp",
            keywords: "starter beginner checklist setup first devices planning"
        },
        {
            id: 11,
            slug: "automation-vs-manual-control",
            title: "Automation or Manual Control: Finding the Balance",
            category: "automation",
            categoryLabel: "Automation",
            date: "2026-09-04",
            displayDate: "Sep 4, 2026",
            readingTime: 6,
            author: "Stackly Editorial",
            description: "Find a practical balance between scheduled routines, sensor-triggered actions, and direct device control.",
            image: "assets/images/blog-3.webp",
            keywords: "smart switches motion triggers manual routines controls"
        },
        {
            id: 12,
            slug: "energy-conscious-smart-home",
            title: "Designing a More Energy-Conscious Smart Home",
            category: "energy",
            categoryLabel: "Energy Efficiency",
            date: "2026-08-30",
            displayDate: "Aug 30, 2026",
            readingTime: 7,
            author: "Stackly Editorial",
            description: "Explore practical energy-monitoring ideas and ways to make more informed decisions about household usage.",
            image: "assets/images/blog-7.webp",
            keywords: "power monitoring electricity consumption efficiency sustainability"
        }
    ];
    /*--- Catalogue Settings ---*/
    const pageSize = 6;
    let initialized = false;
    let activeCategory = "all";
    let searchQuery = "";
    let sortMode = "newest";
    let visibleCount = pageSize;
    let grid;
    let searchInput;
    let sortSelect;
    let totalElement;
    let categoriesElement;
    let resultsElement;
    let emptyElement;
    let loadWrap;
    let loadButton;
    let resetButton;
    let clearSearchButton;
    /*--- Initialize Articles Catalogue ---*/
    function initBlogArticlesCatalogue() {
        if (initialized) return;
        grid = document.getElementById("sh-blog-articles-grid");
        if (!grid) return;
        searchInput = document.getElementById("sh-blog-articles-search");
        sortSelect = document.getElementById("sh-blog-articles-sort");
        totalElement = document.getElementById("sh-blog-articles-total");
        categoriesElement = document.getElementById("sh-blog-articles-categories");
        resultsElement = document.getElementById("sh-blog-articles-results-text");
        emptyElement = document.getElementById("sh-blog-articles-empty");
        loadWrap = document.getElementById("sh-blog-articles-load-wrap");
        loadButton = document.getElementById("sh-blog-articles-load");
        resetButton = document.getElementById("sh-blog-articles-reset");
        clearSearchButton = document.getElementById("sh-blog-articles-search-clear");
        if (!searchInput || !sortSelect || !categoriesElement || !emptyElement || !loadButton) return;
        searchInput.addEventListener("input", function () {
            searchQuery = this.value.trim().toLowerCase();
            visibleCount = pageSize;
            clearSearchButton.hidden = !this.value;
            renderArticles();
        });
        clearSearchButton.addEventListener("click", function () {
            searchInput.value = "";
            searchQuery = "";
            clearSearchButton.hidden = true;
            visibleCount = pageSize;
            renderArticles();
            searchInput.focus();
        });
        sortSelect.addEventListener("change", function () {
            sortMode = this.value;
            visibleCount = pageSize;
            renderArticles();
        });
        categoriesElement.addEventListener("click", function (event) {
            const button = event.target.closest("[data-category]");
            if (!button) return;
            activeCategory = button.dataset.category;
            visibleCount = pageSize;
            updateCategoryButtons();
            renderArticles();
        });
        loadButton.addEventListener("click", function () {
            visibleCount += pageSize;
            renderArticles();
        });
        resetButton.addEventListener("click", resetFilters);
        document.getElementById("sh-blog-articles-empty-reset").addEventListener("click", resetFilters);
        initialized = true;
        updateCategoryButtons();
        renderArticles();
    }
    /*--- Filter and Sort Articles ---*/
    function getFilteredArticles() {
        const filtered = articles.filter(function (article) {
            const matchesCategory = activeCategory === "all" || article.category === activeCategory;
            const searchableText = [
                article.title,
                article.categoryLabel,
                article.description,
                article.author,
                article.keywords
            ].join(" ").toLowerCase();
            return matchesCategory && (!searchQuery || searchableText.includes(searchQuery));
        });
        filtered.sort(function (a, b) {
            if (sortMode === "oldest") return a.date.localeCompare(b.date);
            if (sortMode === "title-asc") return a.title.localeCompare(b.title);
            if (sortMode === "title-desc") return b.title.localeCompare(a.title);
            if (sortMode === "reading-asc") return a.readingTime - b.readingTime;
            if (sortMode === "reading-desc") return b.readingTime - a.readingTime;
            return b.date.localeCompare(a.date);
        });
        return filtered;
    }
    /*--- Render Article Cards ---*/
    function renderArticles() {
        const filtered = getFilteredArticles();
        const visibleArticles = filtered.slice(0, visibleCount);
        grid.innerHTML = visibleArticles.map(function (article) {
            const articleUrl = "blog-details.html?article=" + encodeURIComponent(article.slug);
            return `
                <article class="sh-blog-articles-card">
                    <a class="sh-blog-articles-image"  aria-label="Read ${article.title}">
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                        <span class="sh-blog-articles-image-category">${article.categoryLabel}</span>
                        <span class="sh-blog-articles-image-time"><i class="bi bi-clock"></i> ${article.readingTime} min read</span>
                    </a>
                    <div class="sh-blog-articles-card-content">
                        <div class="sh-blog-articles-card-meta">
                            <span>${article.displayDate}</span>
                            <span>Stackly Journal</span>
                        </div>
                        <h3><a>${article.title}</a></h3>
                        <p class="sh-blog-articles-card-description">${article.description}</p>
                        <div class="sh-blog-articles-card-footer">
                            <div class="sh-blog-articles-author">
                                <span class="sh-blog-articles-author-icon"><i class="bi bi-journal-richtext"></i></span>
                                <span class="sh-blog-articles-author-info"><strong>${article.author}</strong><small>Editorial Team</small></span>
                            </div>
                            <a class="sh-blog-articles-read" href="404.html">Read Article <i class="bi bi-arrow-up-right"></i></a>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
        totalElement.textContent = filtered.length;
        resultsElement.innerHTML = `Showing <strong>${visibleArticles.length}</strong> of <strong>${filtered.length}</strong> matching articles`;
        emptyElement.hidden = filtered.length !== 0;
        grid.hidden = filtered.length === 0;
        loadWrap.hidden = filtered.length === 0 || visibleArticles.length >= filtered.length;
        resetButton.hidden = activeCategory === "all" && !searchQuery && sortMode === "newest";
        updateCategoryCounts();
    }
    /*--- Update Category Selection ---*/
    function updateCategoryButtons() {
        categoriesElement.querySelectorAll("[data-category]").forEach(function (button) {
            const active = button.dataset.category === activeCategory;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }
    /*--- Update Category Counts ---*/
    function updateCategoryCounts() {
        categoriesElement.querySelectorAll("[data-category]").forEach(function (button) {
            const category = button.dataset.category;
            const count = category === "all" ? articles.length : articles.filter(article => article.category === category).length;
            let countElement = button.querySelector("span");
            if (!countElement) {
                countElement = document.createElement("span");
                button.appendChild(countElement);
            }
            countElement.textContent = count;
        });
    }
    /*--- Reset Catalogue Filters ---*/
    function resetFilters() {
        activeCategory = "all";
        searchQuery = "";
        sortMode = "newest";
        visibleCount = pageSize;
        searchInput.value = "";
        sortSelect.value = "newest";
        clearSearchButton.hidden = true;
        updateCategoryButtons();
        renderArticles();
    }
    /*--- Initialize Catalogue ---*/
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initBlogArticlesCatalogue);
    } else {
        initBlogArticlesCatalogue();
    }
    window.initStacklyBlogArticlesCatalogue = initBlogArticlesCatalogue;
})();
/*--- All Articles Catalogue Section End ---*/
