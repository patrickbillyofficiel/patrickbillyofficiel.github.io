/* Menu de navigation mobile accessible — amélioration progressive */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".nav-toggle");

    buttons.forEach(function (button, index) {
      const explicitId = button.getAttribute("aria-controls");
      let navigation = explicitId ? document.getElementById(explicitId) : null;

      if (!navigation) {
        navigation = button.parentElement
          ? button.parentElement.querySelector(".site-nav, nav")
          : null;
      }

      if (!navigation) return;

      if (!navigation.id) navigation.id = "site-navigation-" + (index + 1);
      button.setAttribute("aria-controls", navigation.id);
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("type", "button");

      const closeMenu = function () {
        navigation.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      };

      button.addEventListener("click", function () {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        navigation.classList.toggle("is-open", !isOpen);
        button.setAttribute("aria-expanded", String(!isOpen));
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
          closeMenu();
          button.focus();
        }
      });

      navigation.addEventListener("click", function (event) {
        if (event.target.closest("a") && window.matchMedia("(max-width: 640px)").matches) {
          closeMenu();
        }
      });
    });
  });
})();
