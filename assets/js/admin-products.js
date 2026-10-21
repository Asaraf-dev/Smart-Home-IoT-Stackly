/*--- Admin Products Management ---*/
document.addEventListener("DOMContentLoaded", function () {
    initAdminProducts();
});

/*--- Initialize Products ---*/
function initAdminProducts() {
    const root = document.querySelector(".sh-admin-products");
    if (!root || root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    const $ = function (id) {
        return document.getElementById(id);
    };

    const storageKey = "shAdminProductsDemo";
    const productModalElement = $("sh-admin-products-modal");
    const deleteModalElement = $("sh-admin-products-delete-modal");

    if (!productModalElement || !deleteModalElement || !window.bootstrap) {
        console.error("Admin Products requires Bootstrap 5 and its modal component.");
        return;
    }

    const productModal = bootstrap.Modal.getOrCreateInstance(productModalElement);
    const deleteModal = bootstrap.Modal.getOrCreateInstance(deleteModalElement);

    /*--- Sample Inventory ---*/
    const sampleProducts = [
        {id:1,name:"Smart LED Bulb",sku:"STK-LGT-001",category:"Lighting",price:899,stock:45,description:"Energy-efficient smart lighting.",icon:"bi-lightbulb"},
        {id:2,name:"Smart Door Lock",sku:"STK-SEC-002",category:"Security",price:6499,stock:12,description:"Connected door access control.",icon:"bi-lock"},
        {id:3,name:"Smart Thermostat",sku:"STK-CLM-003",category:"Climate",price:4299,stock:8,description:"Smart indoor temperature control.",icon:"bi-thermometer-half"},
        {id:4,name:"Motion Sensor",sku:"STK-SNS-004",category:"Sensors",price:1299,stock:26,description:"Motion detection for automation.",icon:"bi-broadcast"},
        {id:5,name:"Smart Home Hub",sku:"STK-CTL-005",category:"Controllers",price:5999,stock:0,description:"Central controller for compatible devices.",icon:"bi-router"},
        {id:6,name:"Smart Plug",sku:"STK-CTL-006",category:"Controllers",price:1199,stock:34,description:"Remote control for connected appliances.",icon:"bi-plug"},
        {id:7,name:"Outdoor Security Camera",sku:"STK-SEC-007",category:"Security",price:3899,stock:5,description:"Outdoor monitoring camera.",icon:"bi-camera-video"},
        {id:8,name:"Smart Light Strip",sku:"STK-LGT-008",category:"Lighting",price:1799,stock:19,description:"Customizable ambient smart lighting.",icon:"bi-stars"},
        {id:9,name:"Temperature Sensor",sku:"STK-SNS-009",category:"Sensors",price:999,stock:0,description:"Temperature monitoring sensor.",icon:"bi-thermometer"},
        {id:10,name:"Smart Fan Controller",sku:"STK-CLM-010",category:"Climate",price:2499,stock:16,description:"Smart control for compatible fans.",icon:"bi-fan"}
    ];

    /*--- Load Demo Inventory ---*/
    let products = sampleProducts.map(function (product) {
        return {...product};
    });

    try {
        const savedProducts = localStorage.getItem(storageKey);
        if (savedProducts !== null) {
            const parsedProducts = JSON.parse(savedProducts);
            if (Array.isArray(parsedProducts) && parsedProducts.every(isValidProduct)) {
                products = parsedProducts;
            }
        }
    } catch (error) {
        console.warn("Unable to load demo products:", error);
    }

    let nextId = products.reduce(function (highest, product) {
        return Math.max(highest, product.id);
    }, 0) + 1;

    let pendingDeleteId = null;
    let toastTimeout = null;

    /*--- Product Validation ---*/
    function isValidProduct(product) {
        return product &&
            Number.isInteger(product.id) &&
            typeof product.name === "string" &&
            typeof product.sku === "string" &&
            typeof product.category === "string" &&
            Number.isFinite(product.price) &&
            product.price > 0 &&
            Number.isInteger(product.stock) &&
            product.stock >= 0 &&
            typeof product.description === "string";
    }

    /*--- Escape HTML ---*/
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                "&":"&amp;",
                "<":"&lt;",
                ">":"&gt;",
                '"':"&quot;",
                "'":"&#39;"
            }[character];
        });
    }

    /*--- Format Currency ---*/
    function formatPrice(price) {
        return new Intl.NumberFormat("en-IN", {
            style:"currency",
            currency:"INR",
            maximumFractionDigits:0
        }).format(price);
    }

    /*--- Stock Status ---*/
    function getStockStatus(stock) {
        if (stock === 0) {
            return {label:"Out of stock",className:"sh-admin-products-status-out"};
        }
        if (stock <= 10) {
            return {label:"Low stock",className:"sh-admin-products-status-low"};
        }
        return {label:"In stock",className:""};
    }

    /*--- Save Demo Inventory ---*/
    function saveProducts() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(products));
            return true;
        } catch (error) {
            console.error("Unable to save demo products:", error);
            showToast("Browser storage unavailable. Changes may not persist.");
            return false;
        }
    }

    /*--- Render Statistics ---*/
    function renderStats() {
        $("sh-admin-products-total").textContent = products.length.toLocaleString("en-IN");
        $("sh-admin-products-in-stock").textContent = products.filter(function (product) {
            return product.stock > 10;
        }).length.toLocaleString("en-IN");
        $("sh-admin-products-low-stock").textContent = products.filter(function (product) {
            return product.stock > 0 && product.stock <= 10;
        }).length.toLocaleString("en-IN");
        $("sh-admin-products-out-stock").textContent = products.filter(function (product) {
            return product.stock === 0;
        }).length.toLocaleString("en-IN");
    }

    /*--- Filter And Sort Products ---*/
    function getFilteredProducts() {
        const searchTerm = $("sh-admin-products-search").value.trim().toLowerCase();
        const category = $("sh-admin-products-category").value;
        const sort = $("sh-admin-products-sort").value;

        let filtered = products.filter(function (product) {
            const searchableText = [
                product.name,
                product.sku,
                product.category,
                product.description
            ].join(" ").toLowerCase();

            return searchableText.includes(searchTerm) &&
                (category === "all" || product.category === category);
        });

        filtered.sort(function (a, b) {
            switch (sort) {
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "stock-low":
                    return a.stock - b.stock;
                default:
                    return b.id - a.id;
            }
        });

        return filtered;
    }

    /*--- Render Product Table ---*/
    function renderProducts() {
        const tbody = $("sh-admin-products-table-body");
        const emptyState = $("sh-admin-products-empty");
        const filtered = getFilteredProducts();

        tbody.innerHTML = filtered.map(function (product) {
            const stockStatus = getStockStatus(product.stock);
            const stockClass = product.stock === 0
                ? "sh-admin-products-stock-out"
                : product.stock <= 10
                    ? "sh-admin-products-stock-low"
                    : "";

            return `
                <tr>
                    <td>
                        <div class="sh-admin-products-product">
                            <span class="sh-admin-products-product-icon">
                                <i class="bi ${escapeHTML(product.icon || "bi-box-seam")}"></i>
                            </span>
                            <div class="sh-admin-products-product-info">
                                <strong>${escapeHTML(product.name)}</strong>
                                <span>SKU: ${escapeHTML(product.sku)}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="sh-admin-products-category">${escapeHTML(product.category)}</span></td>
                    <td><span class="sh-admin-products-price">${formatPrice(product.price)}</span></td>
                    <td><span class="sh-admin-products-stock ${stockClass}">${product.stock.toLocaleString("en-IN")} units</span></td>
                    <td><span class="sh-admin-products-status ${stockStatus.className}">${stockStatus.label}</span></td>
                    <td>
                        <div class="sh-admin-products-actions">
                            <button type="button" class="sh-admin-products-action" data-product-action="edit" data-product-id="${product.id}" aria-label="Edit ${escapeHTML(product.name)}" title="Edit product">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button type="button" class="sh-admin-products-action sh-admin-products-action-delete" data-product-action="delete" data-product-id="${product.id}" aria-label="Delete ${escapeHTML(product.name)}" title="Delete product">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        }).join("");

        emptyState.hidden = filtered.length !== 0;
        $("sh-admin-products-result-count").textContent =
            "Showing " + filtered.length + " of " + products.length + " products";
        $("sh-admin-products-showing").textContent = filtered.length.toLocaleString("en-IN");

        renderStats();
    }

    /*--- Toast Feedback ---*/
    function showToast(message) {
        const toast = $("sh-admin-products-toast");
        $("sh-admin-products-toast-message").textContent = message;
        toast.classList.add("is-visible");

        window.clearTimeout(toastTimeout);
        toastTimeout = window.setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 2800);
    }

    /*--- Reset Product Form ---*/
    function resetProductForm() {
        $("sh-admin-products-form").reset();
        $("sh-admin-products-id").value = "";
        $("sh-admin-products-modal-title").textContent = "Add Product";
        $("sh-admin-products-save").innerHTML = '<i class="bi bi-check2"></i> Save Product';
    }

    /*--- Open Add Product Modal ---*/
    $("sh-admin-products-add").addEventListener("click", function () {
        resetProductForm();
        productModal.show();
    });

    /*--- Open Edit Or Delete Modal ---*/
    $("sh-admin-products-table-body").addEventListener("click", function (event) {
        const button = event.target.closest("[data-product-action]");
        if (!button) return;

        const productId = Number(button.dataset.productId);
        const product = products.find(function (item) {
            return item.id === productId;
        });

        if (!product) return;

        if (button.dataset.productAction === "edit") {
            $("sh-admin-products-id").value = product.id;
            $("sh-admin-products-name").value = product.name;
            $("sh-admin-products-sku").value = product.sku;
            $("sh-admin-products-form-category").value = product.category;
            $("sh-admin-products-price").value = product.price;
            $("sh-admin-products-stock").value = product.stock;
            $("sh-admin-products-description").value = product.description;
            $("sh-admin-products-modal-title").textContent = "Edit Product";
            $("sh-admin-products-save").innerHTML = '<i class="bi bi-check2"></i> Update Product';
            productModal.show();
        }

        if (button.dataset.productAction === "delete") {
            pendingDeleteId = product.id;
            $("sh-admin-products-delete-name").textContent = product.name;
            deleteModal.show();
        }
    });

    /*--- Add Or Update Product ---*/
    $("sh-admin-products-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const idValue = $("sh-admin-products-id").value;
        const name = $("sh-admin-products-name").value.trim();
        const sku = $("sh-admin-products-sku").value.trim().toUpperCase();
        const category = $("sh-admin-products-form-category").value;
        const price = Number($("sh-admin-products-price").value);
        const stock = Number($("sh-admin-products-stock").value);
        const description = $("sh-admin-products-description").value.trim();

        if (!this.reportValidity()) return;

        if (!name || !sku || !category ||
            !Number.isFinite(price) || price <= 0 ||
            !Number.isInteger(stock) || stock < 0) {
            showToast("Please enter valid product details.");
            return;
        }

        const duplicateSKU = products.some(function (product) {
            return product.sku.toLowerCase() === sku.toLowerCase() &&
                product.id !== Number(idValue);
        });

        if (duplicateSKU) {
            $("sh-admin-products-sku").setCustomValidity("This SKU already exists.");
            $("sh-admin-products-sku").reportValidity();
            $("sh-admin-products-sku").setCustomValidity("");
            return;
        }

        const existingProduct = idValue
            ? products.find(function (product) {
                return product.id === Number(idValue);
            })
            : null;

        const product = {
            id: existingProduct ? existingProduct.id : nextId++,
            name:name,
            sku:sku,
            category:category,
            price:price,
            stock:stock,
            description:description,
            icon:existingProduct ? existingProduct.icon : getCategoryIcon(category)
        };

        if (existingProduct) {
            products = products.map(function (item) {
                return item.id === existingProduct.id ? product : item;
            });
        } else {
            products.push(product);
        }

        saveProducts();
        renderProducts();
        productModal.hide();
        showToast(existingProduct ? "Product updated successfully." : "Product added successfully.");
    });

    /*--- Category Icon ---*/
    function getCategoryIcon(category) {
        const icons = {
            Lighting:"bi-lightbulb",
            Security:"bi-shield-lock",
            Climate:"bi-thermometer-half",
            Sensors:"bi-broadcast",
            Controllers:"bi-cpu"
        };
        return icons[category] || "bi-box-seam";
    }

    /*--- Confirm Product Deletion ---*/
    $("sh-admin-products-delete-confirm").addEventListener("click", function () {
        if (pendingDeleteId === null) return;

        const product = products.find(function (item) {
            return item.id === pendingDeleteId;
        });

        if (!product) {
            deleteModal.hide();
            pendingDeleteId = null;
            return;
        }

        products = products.filter(function (item) {
            return item.id !== pendingDeleteId;
        });

        saveProducts();
        renderProducts();
        deleteModal.hide();
        showToast("Product deleted successfully.");
        pendingDeleteId = null;
    });

    deleteModalElement.addEventListener("hidden.bs.modal", function () {
        pendingDeleteId = null;
    });

    /*--- Search And Filters ---*/
    $("sh-admin-products-search").addEventListener("input", renderProducts);
    $("sh-admin-products-category").addEventListener("change", renderProducts);
    $("sh-admin-products-sort").addEventListener("change", renderProducts);

    $("sh-admin-products-reset").addEventListener("click", function () {
        $("sh-admin-products-search").value = "";
        $("sh-admin-products-category").value = "all";
        $("sh-admin-products-sort").value = "newest";
        renderProducts();
        showToast("Filters have been reset.");
    });


/*--- Preserve Dashboard Scroll Position During Modal ---*/
let shDashboardScrollY = 0;

[productModalElement, deleteModalElement].forEach(function (modalElement) {
    modalElement.addEventListener("show.bs.modal", function () {
        if (!document.body.classList.contains("modal-open")) {
            shDashboardScrollY = window.scrollY;
            document.body.style.top = `-${shDashboardScrollY}px`;
            document.body.classList.add("sh-dashboard-modal-locked");
        }
    });

    modalElement.addEventListener("hidden.bs.modal", function () {
        if (!document.querySelector(".sh-admin-products-modal.show")) {
            document.body.classList.remove("sh-dashboard-modal-locked");
            document.body.style.removeProperty("top");
            window.scrollTo(0, shDashboardScrollY);
        }
    });
});


    /*--- Initial Render ---*/
    renderProducts();
}