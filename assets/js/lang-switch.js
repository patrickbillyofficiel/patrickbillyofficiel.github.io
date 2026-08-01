/* Sélecteur de langues — amélioration progressive et liens explicites */
(function () {
  "use strict";

  function loadAccessibilityOptions() {
    if (document.querySelector('script[data-a11y-options-loader], script[src$="accessibility-options.js"]')) return;
    const script = document.createElement("script");
    script.src = "/assets/js/accessibility-options.js";
    script.defer = true;
    script.dataset.a11yOptionsLoader = "true";
    document.head.appendChild(script);
  }

  loadAccessibilityOptions();

  document.addEventListener("DOMContentLoaded", function () {
    const switchLinks = document.querySelectorAll(".lang-switch a[data-lang]");
    if (!switchLinks.length) return;

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const isLanguagePath = pathParts[0] === "lang" && pathParts.length >= 2;
    const currentLang = isLanguagePath ? pathParts[1] : document.documentElement.lang || "fr";
    const currentPage = isLanguagePath ? pathParts.slice(2).join("/") || "index.html" : "index.html";

    switchLinks.forEach(function (link) {
      const targetLang = link.getAttribute("data-lang");
      if (!targetLang) return;

      link.setAttribute("href", "/lang/" + targetLang + "/" + currentPage);
      link.setAttribute("hreflang", targetLang);
      link.setAttribute("lang", targetLang);

      if (targetLang === currentLang) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  });
})();
