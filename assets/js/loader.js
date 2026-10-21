/*--- Stackly Loader ---*/
(function() {
    const loader = document.getElementById("sh-ldr-main");
    const message = document.getElementById("sh-ldr-message");
    const particles = document.getElementById("sh-ldr-particles");
    if (!loader) return;
    let messageInterval = null;
    let hideTimeout = null;
    let messageTimeout = null;
    let isHiding = false;
    let loaderStartTime = 0;
    const minimumDisplayTime = 1000;
    const messages = [
        "Connecting your smart experience...",
        "Preparing your intelligent home...",
        "Synchronizing comfort and control...",
        "Activating smarter possibilities...",
        "Almost ready to welcome you..."
    ];
    let messageIndex = 0;
    /*--- Scroll Lock ---*/
    function lockScroll() {
        document.documentElement.classList.add("sh-ldr-scroll-lock");
        document.body.classList.add("sh-ldr-scroll-lock");
    }
    function unlockScroll() {
        document.documentElement.classList.remove("sh-ldr-scroll-lock");
        document.body.classList.remove("sh-ldr-scroll-lock");
    }
    /*--- Create Background Particles ---*/
    function createParticles() {
        if (!particles || particles.querySelector(".sh-ldr-particle")) return;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement("span");
            const size = 2 + Math.random() * 3;
            particle.className = "sh-ldr-particle";
            particle.style.left = Math.random() * 100 + "%";
            particle.style.top = Math.random() * 100 + "%";
            particle.style.width = size + "px";
            particle.style.height = size + "px";
            particle.style.animationDelay = Math.random() * 5 + "s";
            particle.style.animationDuration = 4 + Math.random() * 5 + "s";
            fragment.appendChild(particle);
        }
        particles.appendChild(fragment);
    }
    /*--- Rotate Loading Messages ---*/
    function startMessages() {
        clearInterval(messageInterval);
        clearTimeout(messageTimeout);
        messageIndex = 0;
        if (message) message.textContent = messages[messageIndex];
        messageInterval = setInterval(function() {
            if (isHiding || !message) return;
            message.classList.add("sh-ldr-message-changing");
            messageTimeout = setTimeout(function() {
                messageIndex = (messageIndex + 1) % messages.length;
                message.textContent = messages[messageIndex];
                message.classList.remove("sh-ldr-message-changing");
            }, 220);
        }, 1500);
    }
    /*--- Show Loader ---*/
    function showLoader() {
        clearTimeout(hideTimeout);
        clearTimeout(messageTimeout);
        clearInterval(messageInterval);
        isHiding = false;
        loaderStartTime = Date.now();
        loader.classList.remove("sh-ldr-hidden", "sh-ldr-exit");
        loader.style.display = "flex";
        loader.setAttribute("aria-hidden", "false");
        lockScroll();
        createParticles();
        startMessages();
    }
    /*--- Hide Loader ---*/
    function hideLoader() {
        if (isHiding || loader.classList.contains("sh-ldr-hidden")) return;
        const elapsedTime = Date.now() - loaderStartTime;
        const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(function() {
            isHiding = true;
            clearInterval(messageInterval);
            clearTimeout(messageTimeout);
            loader.classList.add("sh-ldr-exit");
            setTimeout(function() {
                loader.classList.add("sh-ldr-hidden");
                loader.style.display = "none";
                loader.setAttribute("aria-hidden", "true");
                loader.classList.remove("sh-ldr-exit");
                unlockScroll();
                isHiding = false;
            }, 650);
        }, remainingTime);
    }
    /*--- Initial Page Load ---*/
    function initializeLoader() {
        showLoader();
        if (document.readyState === "complete") {
            hideLoader();
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeLoader, {once:true});
    } else {
        initializeLoader();
    }
    /*--- Window Loaded ---*/
    window.addEventListener("load", hideLoader);
    /*--- Browser Back And Forward ---*/
    window.addEventListener("pageshow", function(event) {
        if (event.persisted) {
            showLoader();
            requestAnimationFrame(function() {
                hideLoader();
            });
        }
    });
    /*--- Public Loader Controls ---*/
    window.shShowLoader = showLoader;
    window.shHideLoader = hideLoader;
})();