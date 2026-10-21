/*--- Stackly 404 Page ---*/
document.addEventListener("DOMContentLoaded", function() {
    initStackly404();
});
/*--- Initialize 404 Page ---*/
function initStackly404() {
    const backButton = document.getElementById("sh-err-back");
    if (!backButton) return;
    /*--- Go Back To Previous Page ---*/
    backButton.addEventListener("click", function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "index.html";
        }
    });
    /*--- Button Keyboard Accessibility ---*/
    backButton.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            backButton.click();
        }
    });
}