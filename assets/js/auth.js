/*--- Stackly Login Page ---*/
(function () {
    "use strict";

    /*--- Initialize Login Page ---*/
    function initStacklyLogin() {
        const form = document.getElementById("sh-auth-login-form");
        const emailInput = document.getElementById("sh-auth-login-email");
        const passwordInput = document.getElementById("sh-auth-login-password");
        const passwordToggle = document.getElementById("sh-auth-login-password-toggle");
        const rememberCheckbox = document.getElementById("sh-auth-login-remember");
        const roleInputs = document.querySelectorAll('input[name="account_type"]');
        const roleCards = document.querySelectorAll(".sh-auth-login-role-card");
        const yearElement = document.getElementById("sh-auth-login-year");

        if (!form || !emailInput || !passwordInput || !passwordToggle) {
            return;
        }

        if (form.dataset.initialized === "true") {
            return;
        }

        form.dataset.initialized = "true";

        /*--- Display Current Year ---*/
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        /*--- Restore Previously Remembered Email ---*/
        try {
            const savedEmail = localStorage.getItem("shUserEmail");
            const sessionEmail = sessionStorage.getItem("shUserEmail");
            const savedRole = localStorage.getItem("shUserRole") || sessionStorage.getItem("shUserRole");

            emailInput.value = savedEmail || sessionEmail || "";

            if (savedRole === "admin" || savedRole === "client") {
                const selectedRole = document.querySelector(
                    'input[name="account_type"][value="' + savedRole + '"]'
                );

                if (selectedRole) {
                    selectedRole.checked = true;
                }
            }

            if (savedEmail) {
                rememberCheckbox.checked = true;
            }
        } catch (error) {
            console.warn("Stackly could not restore saved login details.", error);
        }

        /*--- Update Account Type Selection ---*/
        function updateRoleCards() {
            roleCards.forEach(function (card) {
                const input = card.querySelector('input[name="account_type"]');
                card.classList.toggle("is-selected", Boolean(input && input.checked));
            });
        }

        roleInputs.forEach(function (input) {
            input.addEventListener("change", updateRoleCards);
        });

        updateRoleCards();

        /*--- Show or Hide Password ---*/
        passwordToggle.addEventListener("click", function () {
            const showPassword = passwordInput.type === "password";

            passwordInput.type = showPassword ? "text" : "password";
            passwordToggle.innerHTML = showPassword
                ? '<i class="bi bi-eye-slash"></i>'
                : '<i class="bi bi-eye"></i>';

            passwordToggle.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
            passwordToggle.setAttribute("aria-pressed", String(showPassword));
        });

        /*--- Clear Custom Email Validation ---*/
        emailInput.addEventListener("input", function () {
            emailInput.setCustomValidity("");
        });

        /*--- Submit Login Form ---*/
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            /*--- Use Browser-Native Validation ---*/
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const selectedRole = document.querySelector('input[name="account_type"]:checked');

            if (!selectedRole) {
                form.reportValidity();
                return;
            }

            if (!email || !password) {
                form.reportValidity();
                return;
            }

            const role = selectedRole.value;

            /*--- Store Email and Account Type ---*/
            try {
                localStorage.removeItem("shUserEmail");
                localStorage.removeItem("shUserRole");
                sessionStorage.removeItem("shUserEmail");
                sessionStorage.removeItem("shUserRole");

                if (rememberCheckbox.checked) {
                    localStorage.setItem("shUserEmail", email);
                    localStorage.setItem("shUserRole", role);
                } else {
                    sessionStorage.setItem("shUserEmail", email);
                    sessionStorage.setItem("shUserRole", role);
                }
            } catch (error) {
                console.error("Stackly could not save login details.", error);
                alert("Your browser could not save the account details. Please enable browser storage and try again.");
                return;
            }

            /*--- Redirect Based on Account Type ---*/
            if (role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else if (role === "client") {
                window.location.href = "client-dashboard.html";
            }
        });
    }

    /*--- Start Login Page ---*/
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initStacklyLogin);
    } else {
        initStacklyLogin();
    }
})();


/*--- Stackly Register Page ---*/
(function () {
    "use strict";

    /*--- Initialize Register Page ---*/
    function initStacklyRegister() {
        const form = document.getElementById("sh-auth-register-form");

        if (!form || form.dataset.initialized === "true") {
            return;
        }

        const nameInput = document.getElementById("sh-auth-register-name");
        const phoneInput = document.getElementById("sh-auth-register-phone");
        const emailInput = document.getElementById("sh-auth-register-email");
        const passwordInput = document.getElementById("sh-auth-register-password");
        const confirmInput = document.getElementById("sh-auth-register-confirm-password");
        const roleInputs = form.querySelectorAll('input[name="account_type"]');
        const roleCards = form.querySelectorAll(".sh-auth-login-role-card");
        const passwordToggles = form.querySelectorAll("[data-password-toggle]");
        const yearElement = document.getElementById("sh-auth-register-year");

        if (!nameInput || !phoneInput || !emailInput || !passwordInput || !confirmInput) {
            return;
        }

        form.dataset.initialized = "true";

        /*--- Display Current Year ---*/
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        /*--- Allow Only Letters and Spaces in Name ---*/
        nameInput.addEventListener("input", function () {
            const start = nameInput.selectionStart;
            const originalValue = nameInput.value;
            const cleanedValue = originalValue.replace(/[^a-zA-Z ]/g, "");
            const newPosition = originalValue.slice(0, start).replace(/[^a-zA-Z ]/g, "").length;

            if (originalValue !== cleanedValue) {
                nameInput.value = cleanedValue;
                nameInput.setSelectionRange(newPosition, newPosition);
            }

            nameInput.setCustomValidity("");
        });

        /*--- Allow Only 10 Numeric Digits in Phone ---*/
        phoneInput.addEventListener("input", function () {
            const start = phoneInput.selectionStart;
            const originalValue = phoneInput.value;
            const cleanedValue = originalValue.replace(/\D/g, "").slice(0, 10);
            const newPosition = originalValue.slice(0, start).replace(/\D/g, "").slice(0, 10).length;

            if (originalValue !== cleanedValue) {
                phoneInput.value = cleanedValue;
                phoneInput.setSelectionRange(newPosition, newPosition);
            }

            phoneInput.setCustomValidity("");
        });

        /*--- Password Requirement Rules ---*/
        const passwordRules = {
            length: function (value) {
                return value.length >= 8;
            },
            uppercase: function (value) {
                return /[A-Z]/.test(value);
            },
            lowercase: function (value) {
                return /[a-z]/.test(value);
            },
            number: function (value) {
                return /[0-9]/.test(value);
            },
            special: function (value) {
                return /[^A-Za-z0-9\s]/.test(value);
            }
        };

        /*--- Update Password Rule Indicators ---*/
        function updatePasswordRules() {
            const password = passwordInput.value;

            Object.keys(passwordRules).forEach(function (ruleName) {
                const ruleElement = form.querySelector('[data-rule="' + ruleName + '"]');

                if (!ruleElement) {
                    return;
                }

                const valid = passwordRules[ruleName](password);
                ruleElement.classList.toggle("is-valid", valid);

                const icon = ruleElement.querySelector("i");

                if (icon) {
                    icon.className = valid ? "bi bi-check-circle-fill" : "bi bi-circle";
                }
            });
        }

        /*--- Validate Password Strength ---*/
        function isPasswordStrong(password) {
            return Object.keys(passwordRules).every(function (ruleName) {
                return passwordRules[ruleName](password);
            });
        }

        /*--- Validate Password Match ---*/
        function validatePasswordMatch() {
            if (confirmInput.value && passwordInput.value !== confirmInput.value) {
                confirmInput.setCustomValidity("Passwords do not match.");
            } else {
                confirmInput.setCustomValidity("");
            }
        }

        passwordInput.addEventListener("input", function () {
            passwordInput.setCustomValidity(
                passwordInput.value && !isPasswordStrong(passwordInput.value)
                    ? "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
                    : ""
            );

            updatePasswordRules();
            validatePasswordMatch();
        });

        confirmInput.addEventListener("input", validatePasswordMatch);

        /*--- Show or Hide Password Fields ---*/
        passwordToggles.forEach(function (button) {
            button.addEventListener("click", function () {
                const inputId = button.getAttribute("data-password-toggle");
                const input = document.getElementById(inputId);

                if (!input) {
                    return;
                }

                const showPassword = input.type === "password";

                input.type = showPassword ? "text" : "password";
                button.innerHTML = showPassword
                    ? '<i class="bi bi-eye-slash"></i>'
                    : '<i class="bi bi-eye"></i>';

                button.setAttribute(
                    "aria-label",
                    showPassword ? "Hide password" : "Show password"
                );

                button.setAttribute("aria-pressed", String(showPassword));
            });
        });

        /*--- Update Selected Account Type ---*/
        function updateRoleCards() {
            roleCards.forEach(function (card) {
                const input = card.querySelector('input[name="account_type"]');
                card.classList.toggle("is-selected", Boolean(input && input.checked));
            });
        }

        roleInputs.forEach(function (input) {
            input.addEventListener("change", updateRoleCards);
        });

        updateRoleCards();
        updatePasswordRules();

        /*--- Submit Registration Form ---*/
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            validatePasswordMatch();

            if (!isPasswordStrong(passwordInput.value)) {
                passwordInput.setCustomValidity(
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
                );
            } else {
                passwordInput.setCustomValidity("");
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const name = nameInput.value.trim().replace(/\s+/g, " ");
            const phone = phoneInput.value;
            const email = emailInput.value.trim();
            const selectedRole = form.querySelector('input[name="account_type"]:checked');

            if (!selectedRole) {
                form.reportValidity();
                return;
            }

            /*--- Save Profile Details Without Storing Password ---*/
            const profile = {
                name: name,
                phone: phone,
                email: email,
                role: selectedRole.value
            };

            try {
                localStorage.setItem("shUserProfile", JSON.stringify(profile));
                localStorage.setItem("shUserName", name);
                localStorage.setItem("shUserPhone", phone);
                localStorage.setItem("shUserEmail", email);
                localStorage.setItem("shUserRole", selectedRole.value);

                /*--- Save Login Prefill Details for This Browser Session ---*/
                sessionStorage.setItem("shUserName", name);
                sessionStorage.setItem("shUserPhone", phone);
                sessionStorage.setItem("shUserEmail", email);
                sessionStorage.setItem("shUserRole", selectedRole.value);

                /*--- Redirect to Login ---*/
                window.location.href = "login.html";
            } catch (error) {
                console.error("Stackly registration storage failed:", error);
                alert("Unable to save your details in this browser. Please enable browser storage and try again.");
            }
        });
    }

    /*--- Start Register Page ---*/
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initStacklyRegister);
    } else {
        initStacklyRegister();
    }
})();