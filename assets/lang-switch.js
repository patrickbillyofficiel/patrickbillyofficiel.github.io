// lang-switch.js : gestion FR / EN / MG

(function () {
  const buttons = document.querySelectorAll('.lang-switch button');
  const blocks  = document.querySelectorAll('.lang-block');

  function setLang(lang) {
    buttons.forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    blocks.forEach(block => {
      if (block.classList.contains('lang-' + lang)) {
        block.hidden = false;
      } else {
        block.hidden = true;
      }
    });

    document.documentElement.lang = lang === 'fr' ? 'fr'
                             : lang === 'en' ? 'en'
                             : 'fr';
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // langue par défaut
  setLang('fr');
})();
