const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', ...extra }
});

function cors(origin, allowed) {
  const ok = allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || 'null',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin'
  };
}

function cleanText(value, max = 200) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}

function referrerHost(value) {
  try { return value ? new URL(value).hostname.slice(0, 120) : ''; }
  catch { return ''; }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = String(env.ALLOWED_ORIGINS || '')
      .split(',').map(v => v.trim()).filter(Boolean);
    const corsHeaders = cors(origin, allowed);

    if (request.method === 'OPTIONS') {
      if (!allowed.includes(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/event' && request.method === 'POST') {
      if (!allowed.includes(origin)) return json({ ok: false, error: 'origin_not_allowed' }, 403, corsHeaders);
      let body;
      try { body = await request.json(); }
      catch { return json({ ok: false, error: 'invalid_json' }, 400, corsHeaders); }

      const site = cleanText(body.site, 120);
      const path = cleanText(body.path, 300);
      const eventType = cleanText(body.event_type, 40);
      const eventName = cleanText(body.event_name, 120);
      const refHost = referrerHost(body.referrer);
      const validTypes = ['pageview', 'contact_click', 'quote_click', 'download', 'custom'];

      if (!site || !path || !validTypes.includes(eventType)) {
        return json({ ok: false, error: 'invalid_event' }, 400, corsHeaders);
      }

      await env.DB.prepare(
        `INSERT INTO events (site, path, event_type, event_name, referrer_host)
         VALUES (?1, ?2, ?3, ?4, ?5)`
      ).bind(site, path, eventType, eventName || null, refHost || null).run();

      return json({ ok: true }, 201, corsHeaders);
    }

    if (url.pathname === '/stats' && request.method === 'GET') {
      const expected = `Bearer ${env.DASHBOARD_TOKEN}`;
      if (!env.DASHBOARD_TOKEN || request.headers.get('Authorization') !== expected) {
        return json({ ok: false, error: 'unauthorized' }, 401, corsHeaders);
      }

      const days = Math.min(Math.max(Number(url.searchParams.get('days') || 7), 1), 90);
      const since = `-${days} days`;
      const totals = await env.DB.prepare(
        `SELECT COUNT(*) total,
                SUM(CASE WHEN event_type='pageview' THEN 1 ELSE 0 END) pageviews,
                SUM(CASE WHEN event_type='contact_click' THEN 1 ELSE 0 END) contacts,
                SUM(CASE WHEN event_type='quote_click' THEN 1 ELSE 0 END) quotes,
                SUM(CASE WHEN event_type='download' THEN 1 ELSE 0 END) downloads
         FROM events WHERE created_at >= datetime('now', ?1)`
      ).bind(since).first();

      const pages = await env.DB.prepare(
        `SELECT path, COUNT(*) views FROM events
         WHERE event_type='pageview' AND created_at >= datetime('now', ?1)
         GROUP BY path ORDER BY views DESC LIMIT 20`
      ).bind(since).all();

      const signals = await env.DB.prepare(
        `SELECT created_at, site, path, event_type, event_name, referrer_host
         FROM events WHERE event_type <> 'pageview' AND created_at >= datetime('now', ?1)
         ORDER BY created_at DESC LIMIT 50`
      ).bind(since).all();

      return json({ ok: true, days, totals, pages: pages.results, signals: signals.results }, 200, corsHeaders);
    }

    return json({ ok: true, service: 'IA Inclusive Analytics Bot', privacy: 'no cookies, no IP storage, no user-agent storage' });
  }
};
