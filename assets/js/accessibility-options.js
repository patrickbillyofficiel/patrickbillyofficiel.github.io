(function () {
  "use strict";

  const KEY = "elan-a11y-v1";
  const defaults = { size: "100", contrast: "default", spacing: false, simpleFont: false, links: false, focus: false, motion: false, left: false, narrow: false };
  const root = document.documentElement;

  function loadCss() {
    if (document.querySelector("[data-a11y-options-css]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/css/accessibility-options.css";
    link.dataset.a11yOptionsCss = "true";
    document.head.appendChild(link);
  }

  function read() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (_) { return Object.assign({}, defaults); }
  }

  function save(value) { try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (_) {} }
  function toggle(name, active) { root.classList.toggle(name, Boolean(active)); }

  function apply(p) {
    const sizes = { "100": "1", "112": "1.125", "125": "1.25", "150": "1.5", "200": "2" };
    root.style.setProperty("--a11y-font-scale", sizes[p.size] || "1");
    root.classList.remove("a11y-high-contrast", "a11y-dark");
    if (p.contrast === "high") root.classList.add("a11y-high-contrast");
    if (p.contrast === "dark") root.classList.add("a11y-dark");
    toggle("a11y-text-wide", p.spacing);
    toggle("a11y-font-simple", p.simpleFont);
    toggle("a11y-strong-links", p.links);
    toggle("a11y-strong-focus", p.focus);
    toggle("a11y-no-motion", p.motion);
    toggle("a11y-left-align", p.left);
    toggle("a11y-narrow-reading", p.narrow);
  }

  function values(panel) {
    return {
      size: panel.querySelector("#a11y-size").value,
      contrast: panel.querySelector("#a11y-contrast").value,
      spacing: panel.querySelector("#a11y-spacing").checked,
      simpleFont: panel.querySelector("#a11y-font").checked,
      links: panel.querySelector("#a11y-links").checked,
      focus: panel.querySelector("#a11y-focus").checked,
      motion: panel.querySelector("#a11y-motion").checked,
      left: panel.querySelector("#a11y-left").checked,
      narrow: panel.querySelector("#a11y-narrow").checked
    };
  }

  function fill(panel, p) {
    panel.querySelector("#a11y-size").value = p.size;
    panel.querySelector("#a11y-contrast").value = p.contrast;
    panel.querySelector("#a11y-spacing").checked = p.spacing;
    panel.querySelector("#a11y-font").checked = p.simpleFont;
    panel.querySelector("#a11y-links").checked = p.links;
    panel.querySelector("#a11y-focus").checked = p.focus;
    panel.querySelector("#a11y-motion").checked = p.motion;
    panel.querySelector("#a11y-left").checked = p.left;
    panel.querySelector("#a11y-narrow").checked = p.narrow;
  }

  function init() {
    if (document.querySelector(".a11y-options-trigger")) return;
    loadCss();
    const current = read();
    apply(current);

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.lang = "fr";
    trigger.className = "a11y-options-trigger";
    trigger.textContent = "Options d’accessibilité";
    trigger.setAttribute("aria-haspopup", "dialog");

    const dialog = document.createElement("dialog");
    dialog.lang = "fr";
    dialog.className = "a11y-options-dialog";
    dialog.setAttribute("aria-labelledby", "a11y-options-title");
    dialog.innerHTML = `
      <div class="a11y-options-dialog-inner">
        <h2 id="a11y-options-title">Options d’accessibilité</h2>
        <p>Ces préférences complètent les réglages du navigateur. Elles ne remplacent pas un audit RGAA.</p>
        <form method="dialog">
          <fieldset><legend>Affichage</legend>
            <div class="a11y-options-select"><label for="a11y-size">Taille du texte</label><select id="a11y-size"><option value="100">100 %</option><option value="112">112,5 %</option><option value="125">125 %</option><option value="150">150 %</option><option value="200">200 %</option></select></div>
            <div class="a11y-options-select"><label for="a11y-contrast">Contraste</label><select id="a11y-contrast"><option value="default">Présentation du site</option><option value="high">Noir sur blanc renforcé</option><option value="dark">Mode sombre renforcé</option></select></div>
          </fieldset>
          <fieldset><legend>Lecture et compréhension</legend>
            <label class="a11y-option-row"><input id="a11y-font" type="checkbox"><span>Police simple sans empattement</span></label>
            <label class="a11y-option-row"><input id="a11y-spacing" type="checkbox"><span>Espacement renforcé du texte</span></label>
            <label class="a11y-option-row"><input id="a11y-left" type="checkbox"><span>Alignement des textes à gauche</span></label>
            <label class="a11y-option-row"><input id="a11y-narrow" type="checkbox"><span>Largeur de lecture limitée</span></label>
          </fieldset>
          <fieldset><legend>Navigation</legend>
            <label class="a11y-option-row"><input id="a11y-links" type="checkbox"><span>Liens renforcés</span></label>
            <label class="a11y-option-row"><input id="a11y-focus" type="checkbox"><span>Focus clavier renforcé</span></label>
            <label class="a11y-option-row"><input id="a11y-motion" type="checkbox"><span>Réduire les animations</span></label>
          </fieldset>
          <div class="a11y-options-actions"><button class="a11y-options-primary" id="a11y-apply" type="button">Appliquer et enregistrer</button><button id="a11y-reset" type="button">Réinitialiser</button><a href="/pages/lecture-orale.html">Lecture orale</a><button id="a11y-close" type="button">Fermer</button></div>
          <p class="a11y-options-status" id="a11y-status" role="status" aria-live="polite" hidden></p>
        </form>
      </div>`;

    document.body.append(trigger, dialog);
    fill(dialog, current);
    let previousFocus = null;
    const status = dialog.querySelector("#a11y-status");

    trigger.addEventListener("click", function () {
      previousFocus = document.activeElement;
      fill(dialog, read());
      status.hidden = true;
      dialog.showModal();
      dialog.querySelector("#a11y-size").focus();
    });

    dialog.querySelector("#a11y-apply").addEventListener("click", function () {
      const next = values(dialog);
      apply(next);
      save(next);
      status.hidden = false;
      status.textContent = "Préférences appliquées et enregistrées sur cet appareil.";
    });

    dialog.querySelector("#a11y-reset").addEventListener("click", function () {
      apply(defaults);
      save(defaults);
      fill(dialog, defaults);
      status.hidden = false;
      status.textContent = "Préférences réinitialisées.";
    });

    dialog.querySelector("#a11y-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("close", function () {
      if (previousFocus && previousFocus.focus) previousFocus.focus();
      else trigger.focus();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
