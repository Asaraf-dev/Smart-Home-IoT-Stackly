/*--- Our Story — Who We Are Section Start ---*/
function initAboutStoryReveal() {
    const elements = document.querySelectorAll(".sh-abt-story-reveal");
    if (!elements.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        elements.forEach(function(element) {
            element.classList.add("is-visible");
        });
        return;
    }
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold:0.12,
        rootMargin:"0px 0px -35px 0px"
    });
    elements.forEach(function(element, index) {
        element.style.transitionDelay = index === 0 ? "0ms" : "120ms";
        observer.observe(element);
    });
}
/*--- Initialize About Story ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAboutStoryReveal);
} else {
    initAboutStoryReveal();
}
/*--- Our Story — Who We Are Section End ---*/