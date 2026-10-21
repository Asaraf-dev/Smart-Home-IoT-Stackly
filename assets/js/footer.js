
/*--- Stackly Footer ---*/
function initStacklyFooter() {
    const footer = document.getElementById("sh-ftr-main");
    if (!footer || footer.dataset.initialized === "true") return;
    footer.dataset.initialized = "true";
    /*--- Dynamic Copyright Year ---*/
    const yearElement = document.getElementById("sh-ftr-year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    /*--- Back To Top ---*/
    const backToTop = document.getElementById("sh-ftr-back-top");
    if (backToTop) {
        backToTop.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
            });
        });
    }
    /*--- Footer Reveal ---*/
    if ("IntersectionObserver" in window) {
        const footerObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("sh-ftr-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold:0.05});
        footerObserver.observe(footer);
    } else {
        footer.classList.add("sh-ftr-visible");
    }
}
/*--- Footer Initialization ---*/
document.addEventListener("DOMContentLoaded", initStacklyFooter);
