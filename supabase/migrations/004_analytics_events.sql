-- Analytics events table for PagePulse
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);

-- KPI daily summary view
CREATE OR REPLACE VIEW kpi_daily AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as visitors,
  COUNT(DISTINCT CASE WHEN event_type = 'signup_completed' THEN user_id END) as signups,
  COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN user_id END) as checkouts,
  COUNT(DISTINCT CASE WHEN event_type = 'payment_completed' THEN user_id END) as payments,
  COUNT(DISTINCT CASE WHEN event_type = 'monitor_created' THEN user_id END) as active_users
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;
