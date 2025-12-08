// =====================
//  MODULE AUDIO PRO
//  Patrick Billy
// =====================

// --- Synthèse ---
const synth = window.speechSynthesis;
let currentUtter = null;

// --- Mini-player ---
const player = document.querySelector(".voice-player");
const btnPause = document.getElementById("vp-pause");
const btnStop = document.getElementById("vp-stop");

btnPause.addEventListener("click", () => {
  if (synth.speaking && !synth.paused) synth.pause();
  else synth.resume();
});

btnStop.addEventListener("click", () => {
  synth.cancel();
  player.hidden = true;
  clearHighlights();
});

// --- Fonction lecture avec suivi phrase par phrase ---
function speakWithHighlight(text, lang) {
  clearHighlights();

  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  let i = 0;

  function playNext() {
    if (i >= sentences.length) {
      player.hidden = true;
      return;
    }

    const s = sentences[i].trim();
    highlightSentence(i);

    currentUtter = new SpeechSynthesisUtterance(s);
    currentUtter.lang = lang;
    currentUtter.rate = 1;

    currentUtter.onend = () => {
      i++;
      playNext();
    };

    synth.speak(currentUtter);
  }

  player.hidden = false;
  playNext();
}

// --- Coloration de la phrase active ---
function highlightSentence(index) {
  clearHighlights();

  const panel = document.querySelector(".ia-panel:not([hidden])");
  if (!panel) return;

  const textNodes = panel.querySelectorAll("p, li, td");

  let pos = 0;
  textNodes.forEach(node => {
    const parts = node.innerHTML.split(/(?<=[.!?])/);

    parts = parts.map((p, idx) => {
      if (pos === index) return `<span class="highlight">${p}</span>`;
      pos++;
      return p;
    });

    node.innerHTML = parts.join("");
  });
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach(el => {
    el.classList.remove("highlight");
  });
}

// --- Lecture bouton "Lire" ---
document.getElementById("voice-read-btn").addEventListener("click", () => {
  const panel = document.querySelector(".ia-panel:not([hidden])");
  if (!panel) return;

  const text = panel.innerText.trim();
  let lang = "fr-FR";
  if (panel.id === "ia-en") lang = "en-US";
  if (panel.id === "ia-mg") lang = "fr-FR";

  synth.cancel();
  speakWithHighlight(text, lang);
});

// --- Stop ---
document.getElementById("voice-stop-btn").addEventListener("click", () => {
  synth.cancel();
  player.hidden = true;
  clearHighlights();
});

// --- DICTÉE CONTINUE ---
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
  const recog = new SpeechRecognition();
  recog.lang = "fr-FR";
  recog.interimResults = true;
  recog.continuous = true;

  let buffer = "";

  document.getElementById("micro-btn").addEventListener("click", () => {
    buffer = "";
    recog.start();
    document.getElementById("micro-btn").textContent = "🎤…";
  });

  recog.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }
    buffer = transcript;
    document.getElementById("job-offer").value = buffer;
  };

  recog.onend = () => {
    document.getElementById("micro-btn").textContent = "🎤";
  };
}
