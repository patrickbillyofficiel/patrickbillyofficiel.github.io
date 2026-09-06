(() => {
  const config = window.ELAN_ANALYTICS || {};
  const endpoint = String(config.endpoint || '').replace(/\/$/, '');
  const site = config.site || location.hostname;
  if (!endpoint) return;

  const send = (event_type, event_name = '') => {
    const payload = {
      site,
      path: location.pathname + location.search,
      event_type,
      event_name,
      referrer: document.referrer || ''
    };
    fetch(endpoint + '/event', {
      method: 'POST',
      mode: 'cors',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  send('pageview');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const text = (link.textContent || '').trim().slice(0, 100);

    if (href.startsWith('mailto:') || /contact/i.test(href)) {
      send('contact_click', text || 'Contact');
    } else if (/devis/i.test(href)) {
      send('quote_click', text || 'Devis');
    } else if (/\.pdf(?:$|[?#])/i.test(href) || link.hasAttribute('download')) {
      send('download', text || href.split('/').pop());
    }
  }, { capture: true });
})();
