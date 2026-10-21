/*--- Hero Section Start ---*/
document.addEventListener("DOMContentLoaded", function() {
    initHomeHero();
});
/*--- Initialize Home Hero ---*/
function initHomeHero() {
    const hero = document.getElementById("sh-ind-hero");
    if (!hero || hero.dataset.initialized === "true") return;
    hero.dataset.initialized = "true";
    const visualItems = hero.querySelectorAll(".sh-ind-hero-device-card, .sh-ind-hero-climate-card, .sh-ind-hero-connect-card");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        visualItems.forEach(function(item) {
            item.style.opacity = "1";
        });
        return;
    }
    visualItems.forEach(function(item, index) {
        item.style.opacity = "0";
        item.style.transition = "opacity .6s ease, transform .6s ease";
        item.style.transform = "translateY(12px)";
        item.style.transitionDelay = index * 120 + "ms";
    });
    const heroObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            visualItems.forEach(function(item) {
                item.style.opacity = "1";
                item.style.transform = "";
            });
            observer.unobserve(entry.target);
        });
    }, {threshold:0.15});
    heroObserver.observe(hero);
}
/*--- Hero Section End ---*/

/*--- Testimonial Section Start ---*/
function initHomeTestimonials() {
    const viewport = document.getElementById("sh-ind-testimonials-viewport");
    const track = document.getElementById("sh-ind-testimonials-track");
    const previousButton = document.getElementById("sh-ind-testimonials-prev");
    const nextButton = document.getElementById("sh-ind-testimonials-next");
    const currentCounter = document.getElementById("sh-ind-testimonials-current");
    const totalCounter = document.getElementById("sh-ind-testimonials-total");
    const progress = document.getElementById("sh-ind-testimonials-progress");
    if (!viewport || !track || !previousButton || !nextButton) return;
    const cards = Array.from(track.querySelectorAll(".sh-ind-testimonial-card"));
    if (!cards.length) return;
    let currentIndex = 0;
    let visibleCards = 3;
    let maxIndex = 0;
    let resizeTimer;
    /*--- Calculate Visible Cards ---*/
    function calculateVisibleCards() {
        if (window.innerWidth <= 575) {
            visibleCards = 1;
        } else if (window.innerWidth <= 991) {
            visibleCards = 2;
        } else {
            visibleCards = 3;
        }
        maxIndex = Math.max(0, cards.length - visibleCards);
        currentIndex = Math.min(currentIndex, maxIndex);
        updateSlider();
    }
    /*--- Update Slider Position ---*/
    function updateSlider() {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const trackStyles = window.getComputedStyle(track);
        const gap = parseFloat(trackStyles.columnGap) || parseFloat(trackStyles.gap) || 0;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = "translateX(-" + offset + "px)";
        previousButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;
        previousButton.setAttribute("aria-label", "Previous testimonials");
        nextButton.setAttribute("aria-label", "Next testimonials");
        if (currentCounter) {
            currentCounter.textContent = String(currentIndex + 1).padStart(2, "0");
        }
        if (totalCounter) {
            totalCounter.textContent = String(maxIndex + 1).padStart(2, "0");
        }
        if (progress) {
            progress.style.width = ((currentIndex + 1) / (maxIndex + 1) * 100) + "%";
        }
    }
    /*--- Slider Controls ---*/
    previousButton.addEventListener("click", function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    nextButton.addEventListener("click", function() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });
    /*--- Touch Swipe Support ---*/
    let touchStartX = 0;
    viewport.addEventListener("touchstart", function(event) {
        touchStartX = event.changedTouches[0].screenX;
    }, {passive:true});
    viewport.addEventListener("touchend", function(event) {
        const touchEndX = event.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) < 45) return;
        if (difference > 0 && currentIndex < maxIndex) {
            currentIndex++;
        } else if (difference < 0 && currentIndex > 0) {
            currentIndex--;
        }
        updateSlider();
    }, {passive:true});
    /*--- Responsive Slider ---*/
    window.addEventListener("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(calculateVisibleCards, 120);
    });
    calculateVisibleCards();
}
/*--- Initialize Testimonials ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomeTestimonials);
} else {
    initHomeTestimonials();
}
/*--- Testimonial Section End ---*/