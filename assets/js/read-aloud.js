(function () {
  "use strict";

  const form = document.getElementById("oral-reader-form");
  const pageSelect = document.getElementById("oral-page");
  const loadButton = document.getElementById("oral-load");
  const playButton = document.getElementById("oral-play");
  const pauseButton = document.getElementById("oral-pause");
  const stopButton = document.getElementById("oral-stop");
  const rateSelect = document.getElementById("oral-rate");
  const status = document.getElementById("oral-status");
  const preview = document.getElementById("oral-preview");
  const previewTitle = document.getElementById("oral-preview-title");

  if (!form || !pageSelect || !loadButton || !playButton || !pauseButton || !stopButton || !rateSelect || !status || !preview || !previewTitle) {
    return;
  }

  const synth = window.speechSynthesis;
  let blocks = [];
  let currentIndex = 0;
  let currentLanguage = "fr-FR";
  let stoppedByUser = false;
  let loadedUrl = "";

  function setStatus(message) {
    status.textContent = message;
  }

  function setButtons(state) {
    const hasContent = blocks.length > 0;
    playButton.disabled = !hasContent || state === "speaking";
    pauseButton.disabled = !hasContent || state === "stopped";
    stopButton.disabled = !hasContent || state === "stopped";

    if (state === "paused") {
      pauseButton.textContent = "Reprendre";
      pauseButton.setAttribute("aria-label", "Reprendre la lecture orale");
    } else {
      pauseButton.textContent = "Pause";
      pauseButton.setAttribute("aria-label", "Mettre la lecture orale en pause");
    }
  }

  function stopReading(message) {
    stoppedByUser = true;
    if (synth) {
      synth.cancel();
    }
    currentIndex = 0;
    setButtons("stopped");
    if (message) {
      setStatus(message);
    }
  }

  function normalizeLanguage(language) {
    const normalized = language.toLowerCase();
    const languageMap = {
      fr: "fr-FR",
      en: "en-GB",
      es: "es-ES",
      de: "de-DE",
      mg: "mg-MG"
    };

    if (normalized.includes("-")) {
      return language;
    }

    return languageMap[normalized] || language;
  }

  function isExcluded(element) {
    return Boolean(
      element.closest(
        "nav, form, script, style, template, noscript, button, input, select, textarea, [hidden], [aria-hidden='true'], .skip-link, .skiplink, .visually-hidden, .sr-only, .no-read-aloud"
      )
    );
  }

  function extractBlocks(doc) {
    const main = doc.querySelector("main");
    if (!main) {
      throw new Error("Cette page ne contient pas de zone principale identifiable.");
    }

    const readable = Array.from(
      main.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote, figcaption, dt, dd, caption, th, td")
    );

    const uniqueTexts = [];
    readable.forEach(function (element) {
      if (isExcluded(element)) {
        return;
      }

      const text = element.textContent.replace(/\s+/g, " ").trim();
      if (!text || text.length < 2) {
        return;
      }

      const previous = uniqueTexts[uniqueTexts.length - 1];
      if (text !== previous) {
        uniqueTexts.push(text);
      }
    });

    return uniqueTexts;
  }

  function getVoice(language) {
    if (!synth) {
      return null;
    }

    const languagePrefix = language.toLowerCase().split("-")[0];
    const voices = synth.getVoices();

    return (
      voices.find(function (voice) {
        return voice.lang.toLowerCase() === language.toLowerCase();
      }) ||
      voices.find(function (voice) {
        return voice.lang.toLowerCase().startsWith(languagePrefix);
      }) ||
      null
    );
  }

  function speakNext() {
    if (!synth || stoppedByUser || currentIndex >= blocks.length) {
      if (!stoppedByUser && currentIndex >= blocks.length) {
        setStatus("Lecture terminée.");
        setButtons("stopped");
        currentIndex = 0;
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(blocks[currentIndex]);
    utterance.lang = currentLanguage;
    utterance.rate = Number(rateSelect.value) || 1;

    const voice = getVoice(currentLanguage);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = function () {
      setStatus("Lecture en cours, partie " + (currentIndex + 1) + " sur " + blocks.length + ".");
      setButtons("speaking");
    };

    utterance.onend = function () {
      if (stoppedByUser) {
        return;
      }
      currentIndex += 1;
      speakNext();
    };

    utterance.onerror = function (event) {
      if (event.error === "canceled" || event.error === "interrupted") {
        return;
      }
      setStatus("La lecture orale a rencontré une erreur. Vous pouvez réessayer ou utiliser le lecteur d’écran de votre appareil.");
      setButtons("stopped");
    };

    synth.speak(utterance);
  }

  async function loadSelectedPage() {
    stopReading("");
    blocks = [];
    loadedUrl = "";
    preview.replaceChildren();
    previewTitle.textContent = "Aperçu du contenu chargé";
    setButtons("stopped");
    setStatus("Chargement du contenu…");

    const selectedUrl = pageSelect.value;
    if (!selectedUrl) {
      setStatus("Choisissez une page à lire.");
      pageSelect.focus();
      return;
    }

    try {
      const url = new URL(selectedUrl, window.location.href);
      if (url.origin !== window.location.origin) {
        throw new Error("Seules les pages du site Élan pour Tous peuvent être chargées.");
      }

      const response = await fetch(url.href, { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error("La page n’a pas pu être chargée.");
      }

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const lang = doc.documentElement.getAttribute("lang") || "fr";
      currentLanguage = normalizeLanguage(lang);
      blocks = extractBlocks(doc);

      if (!blocks.length) {
        throw new Error("Aucun contenu principal lisible n’a été détecté.");
      }

      loadedUrl = url.href;
      preview.lang = lang;
      blocks.forEach(function (text) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        preview.appendChild(paragraph);
      });

      const sourceHeading = doc.querySelector("h1");
      const sourceTitle = sourceHeading ? sourceHeading.textContent.trim() : (doc.title || "Page sélectionnée");
      previewTitle.textContent = "Aperçu : " + sourceTitle;
      setButtons("stopped");
      setStatus(blocks.length + " partie(s) de texte chargée(s). Vous pouvez commencer la lecture.");
      playButton.focus();
    } catch (error) {
      blocks = [];
      setButtons("stopped");
      setStatus(error instanceof Error ? error.message : "Une erreur empêche la lecture de cette page.");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    loadSelectedPage();
  });

  pageSelect.addEventListener("change", function () {
    if (loadedUrl) {
      stopReading("La page sélectionnée a changé. Chargez-la avant de lancer la lecture.");
      blocks = [];
      loadedUrl = "";
      preview.replaceChildren();
      setButtons("stopped");
    }
  });

  playButton.addEventListener("click", function () {
    if (!synth) {
      setStatus("La lecture vocale n’est pas disponible dans ce navigateur.");
      return;
    }

    if (!blocks.length) {
      setStatus("Chargez d’abord une page.");
      pageSelect.focus();
      return;
    }

    stoppedByUser = false;
    synth.cancel();
    currentIndex = 0;
    window.setTimeout(speakNext, 50);
  });

  pauseButton.addEventListener("click", function () {
    if (!synth || !blocks.length) {
      return;
    }

    if (synth.paused) {
      synth.resume();
      setStatus("Lecture reprise.");
      setButtons("speaking");
    } else if (synth.speaking) {
      synth.pause();
      setStatus("Lecture en pause.");
      setButtons("paused");
    }
  });

  stopButton.addEventListener("click", function () {
    stopReading("Lecture arrêtée.");
  });

  rateSelect.addEventListener("change", function () {
    if (synth && synth.speaking) {
      stopReading("Vitesse modifiée. Relancez la lecture pour appliquer le nouveau réglage.");
    }
  });

  window.addEventListener("pagehide", function () {
    if (synth) {
      synth.cancel();
    }
  });

  if (!synth || typeof window.SpeechSynthesisUtterance === "undefined") {
    setStatus("Votre navigateur ne propose pas la synthèse vocale. Les pages restent compatibles avec les lecteurs d’écran installés sur l’appareil.");
    playButton.disabled = true;
    pauseButton.disabled = true;
    stopButton.disabled = true;
  } else {
    setButtons("stopped");
    setStatus("Choisissez une page puis sélectionnez « Charger le contenu ».");
  }
})();