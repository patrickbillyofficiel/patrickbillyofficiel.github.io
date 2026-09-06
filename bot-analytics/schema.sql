CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  site TEXT NOT NULL,
  path TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT,
  referrer_host TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_site ON events(site);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
