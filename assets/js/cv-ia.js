/* Comparateur local de CV — démonstration accessible, sans appel à une IA externe */
(function () {
  "use strict";

  const domains = [
    {
      name: "Accessibilité numérique",
      keywords: ["accessibilité", "accessible", "rgaa", "wcag", "handicap", "inclusion", "clavier", "lecteur d’écran"]
    },
    {
      name: "Formation et pédagogie",
      keywords: ["formation", "formateur", "pédagogie", "apprentissage", "atelier", "accompagnement", "animation"]
    },
    {
      name: "Intelligence artificielle",
      keywords: ["intelligence artificielle", "ia", "automatisation", "prompt", "chatgpt", "assistant"]
    },
    {
      name: "Web et contenus numériques",
      keywords: ["html", "css", "javascript", "wordpress", "web", "seo", "numérique", "site"]
    },
    {
      name: "Design et communication",
      keywords: ["design", "graphisme", "illustrator", "photoshop", "indesign", "communication", "ux", "interface"]
    },
    {
      name: "Emploi et recrutement",
      keywords: ["recrutement", "rh", "emploi", "candidat", "entretien", "compétence", "insertion"]
    }
  ];

  const normalize = function (value) {
    return String(value || "")
      .toLocaleLowerCase("fr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cv-comparator-form");
    if (!form) return;

    const offer = document.getElementById("job-offer");
    const error = document.getElementById("job-offer-error");
    const status = document.getElementById("analysis-status");
    const result = document.getElementById("analysis-result");
    const summary = document.getElementById("analysis-summary");
    const body = document.getElementById("analysis-table-body");
    const clearButton = document.getElementById("clear-analysis");

    const showStatus = function (message) {
      status.textContent = message;
      status.hidden = false;
    };

    const clearError = function () {
      offer.removeAttribute("aria-invalid");
      error.hidden = true;
    };

    offer.addEventListener("input", clearError);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearError();

      const rawText = offer.value.trim();
      if (rawText.length < 20) {
        offer.setAttribute("aria-invalid", "true");
        error.hidden = false;
        error.textContent = "Saisissez une offre ou une mission d’au moins 20 caractères.";
        offer.focus();
        return;
      }

      const text = normalize(rawText);
      const findings = domains.map(function (domain) {
        const matched = domain.keywords.filter(function (keyword) {
          return text.includes(normalize(keyword));
        });
        return { name: domain.name, matched: matched };
      });

      const relevant = findings.filter(function (item) {
        return item.matched.length > 0;
      });

      body.replaceChildren();

      findings.forEach(function (item) {
        const row = document.createElement("tr");
        const domainCell = document.createElement("th");
        const findingCell = document.createElement("td");
        const nextCell = document.createElement("td");

        domainCell.scope = "row";
        domainCell.textContent = item.name;

        if (item.matched.length) {
          findingCell.textContent = "Termes repérés : " + item.matched.join(", ") + ".";
          nextCell.textContent = "Vérifier les missions, outils, résultats attendus et aménagements nécessaires.";
        } else {
          findingCell.textContent = "Aucun terme explicite repéré.";
          nextCell.textContent = "Demander une précision plutôt que conclure à une absence de compétence.";
        }

        row.append(domainCell, findingCell, nextCell);
        body.appendChild(row);
      });

      if (relevant.length) {
        summary.textContent = "L’offre mentionne " + relevant.length + " domaine" + (relevant.length > 1 ? "s" : "") + " proche" + (relevant.length > 1 ? "s" : "") + " du profil présenté. Cette détection par mots-clés doit être vérifiée par un humain et complétée par une mise en situation accessible.";
      } else {
        summary.textContent = "Aucun domaine n’a été repéré automatiquement. Cela ne signifie pas que le profil est inadapté : les formulations de l’offre peuvent être différentes. Une lecture humaine et un échange restent nécessaires.";
      }

      result.hidden = false;
      showStatus("Analyse locale terminée. Le récapitulatif est disponible après le formulaire.");
      result.focus();
    });

    clearButton.addEventListener("click", function () {
      form.reset();
      clearError();
      result.hidden = true;
      status.hidden = true;
      body.replaceChildren();
      offer.focus();
    });
  });
})();
