/*--- Contact Form Section Start ---*/
(function () {
    "use strict";

    /*--- Initialize Contact Form ---*/
    function initStacklyContactForm() {
        const form = document.getElementById("sh-con-form-main");
        const nameInput = document.getElementById("sh-con-form-name");
        const emailInput = document.getElementById("sh-con-form-email");
        const phoneInput = document.getElementById("sh-con-form-phone");
        const modal = document.getElementById("sh-con-form-modal");
        const modalDialog = modal ? modal.querySelector(".sh-con-form-modal-dialog") : null;
        const doneButton = document.getElementById("sh-con-form-modal-done");

        if (!form || !nameInput || !emailInput || !phoneInput || !modal || !modalDialog || !doneButton) {
            return;
        }

        if (form.dataset.initialized === "true") {
            return;
        }

        form.dataset.initialized = "true";

        const closeButtons = modal.querySelectorAll("[data-close-modal]");
        let previousActiveElement = null;

        /*--- Name Field: Allow Letters and Spaces Only ---*/
        nameInput.addEventListener("keydown", function (event) {
            const allowedKeys = [
                "Backspace", "Delete", "Tab", "Escape", "Enter",
                "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
                "Home", "End"
            ];

            if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) {
                return;
            }

            if (!/^[a-zA-Z ]$/.test(event.key)) {
                event.preventDefault();
            }
        });

        /*--- Clean Invalid Name Characters ---*/
        nameInput.addEventListener("input", function () {
            const originalValue = nameInput.value;
            const cursorPosition = nameInput.selectionStart;
            const cleanedValue = originalValue.replace(/[^a-zA-Z ]/g, "");

            if (originalValue !== cleanedValue) {
                const newPosition = originalValue.slice(0, cursorPosition)
                    .replace(/[^a-zA-Z ]/g, "").length;

                nameInput.value = cleanedValue;
                nameInput.setSelectionRange(newPosition, newPosition);
            }
        });

        /*--- Phone Field: Allow Digits Only ---*/
        phoneInput.addEventListener("keydown", function (event) {
            const allowedKeys = [
                "Backspace", "Delete", "Tab", "Escape", "Enter",
                "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
                "Home", "End"
            ];

            if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) {
                return;
            }

            if (!/^[0-9]$/.test(event.key)) {
                event.preventDefault();
                return;
            }

            const selectedLength = phoneInput.selectionEnd - phoneInput.selectionStart;

            if (phoneInput.value.length >= 10 && selectedLength === 0) {
                event.preventDefault();
            }
        });

        /*--- Clean Phone Input and Limit to 10 Digits ---*/
        phoneInput.addEventListener("input", function () {
            const originalValue = phoneInput.value;
            const cursorPosition = phoneInput.selectionStart;
            const cleanedValue = originalValue.replace(/[^0-9]/g, "").slice(0, 10);

            if (originalValue !== cleanedValue) {
                const newPosition = originalValue.slice(0, cursorPosition)
                    .replace(/[^0-9]/g, "").slice(0, 10).length;

                phoneInput.value = cleanedValue;
                phoneInput.setSelectionRange(newPosition, newPosition);
            }
        });

        /*--- Ensure Native Browser Validation Is Enabled ---*/
        form.noValidate = false;
        nameInput.required = true;
        emailInput.required = true;
        phoneInput.required = true;

        nameInput.pattern = "[A-Za-z ]+";
        emailInput.type = "email";
        phoneInput.pattern = "[0-9]{10}";
        phoneInput.minLength = 10;
        phoneInput.maxLength = 10;

        /*--- Validate Email Format ---*/
        emailInput.addEventListener("input", function () {
            emailInput.setCustomValidity("");
        });

        /*--- Open Success Popup ---*/
        function openSuccessPopup() {
            previousActiveElement = document.activeElement;

            modal.classList.add("is-visible");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";

            doneButton.focus();
        }

        /*--- Close Success Popup ---*/
        function closeSuccessPopup() {
            modal.classList.remove("is-visible");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";

            if (previousActiveElement && typeof previousActiveElement.focus === "function") {
                previousActiveElement.focus();
            }
        }

        /*--- Submit Contact Form ---*/
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            openSuccessPopup();

            /*
             * Frontend demonstration only.
             * Connect a backend or form service to deliver messages.
             */
        });

        /*--- Close Popup Buttons ---*/
        closeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                closeSuccessPopup();
            });
        });

        /*--- Continue Button ---*/
        doneButton.addEventListener("click", function () {
            closeSuccessPopup();
            form.reset();
        });

        /*--- Close Popup with Escape Key ---*/
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal.classList.contains("is-visible")) {
                closeSuccessPopup();
            }
        });

        /*--- Keep Keyboard Focus Inside Popup ---*/
        modalDialog.addEventListener("keydown", function (event) {
            if (event.key !== "Tab") {
                return;
            }

            const focusableElements = modalDialog.querySelectorAll(
                'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
            );

            if (!focusableElements.length) {
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        });
    }

    /*--- Start Contact Form ---*/
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initStacklyContactForm);
    } else {
        initStacklyContactForm();
    }
})();
/*--- Contact Form Section End ---*/

/*--- Contact FAQ Section Start ---*/
(function () {
    "use strict";

    function initStacklyContactFAQ() {
        const faqList = document.getElementById("sh-con-faq-list");

        if (!faqList || faqList.dataset.initialized === "true") {
            return;
        }

        faqList.dataset.initialized = "true";

        const faqItems = Array.from(faqList.querySelectorAll(".sh-con-faq-item"));

        /*--- Initialize FAQ Item State ---*/
        faqItems.forEach(function (item) {
            const button = item.querySelector(".sh-con-faq-question");
            const answer = item.querySelector(".sh-con-faq-answer");

            if (!button || !answer) {
                return;
            }

            const isActive = item.classList.contains("is-active");

            button.setAttribute("aria-expanded", String(isActive));
            answer.setAttribute("aria-hidden", String(!isActive));
            answer.inert = !isActive;
        });

        /*--- Toggle FAQ Accordion ---*/
        faqItems.forEach(function (item) {
            const button = item.querySelector(".sh-con-faq-question");
            const answer = item.querySelector(".sh-con-faq-answer");

            if (!button || !answer) {
                return;
            }

            button.addEventListener("click", function () {
                const shouldOpen = !item.classList.contains("is-active");

                faqItems.forEach(function (otherItem) {
                    const otherButton = otherItem.querySelector(".sh-con-faq-question");
                    const otherAnswer = otherItem.querySelector(".sh-con-faq-answer");

                    otherItem.classList.remove("is-active");

                    if (otherButton) {
                        otherButton.setAttribute("aria-expanded", "false");
                    }

                    if (otherAnswer) {
                        otherAnswer.setAttribute("aria-hidden", "true");
                        otherAnswer.inert = true;
                    }
                });

                if (shouldOpen) {
                    item.classList.add("is-active");
                    button.setAttribute("aria-expanded", "true");
                    answer.setAttribute("aria-hidden", "false");
                    answer.inert = false;
                }
            });
        });
    }

    /*--- Start Contact FAQ ---*/
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initStacklyContactFAQ);
    } else {
        initStacklyContactFAQ();
    }
})();
/*--- Contact FAQ Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/