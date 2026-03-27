-- Analytics table for tracking traffic sources
CREATE TABLE IF NOT EXISTS analytics_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL, -- reddit, directory, linkedin, etc.
  medium TEXT, -- post, listing, ad, etc.
  campaign TEXT, -- launch_v2, etc.
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT, -- hashed IP for uniqueness
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_analytics_source ON analytics_clicks(source);
CREATE INDEX IF NOT EXISTS idx_analytics_campaign ON analytics_clicks(campaign);
CREATE INDEX IF NOT EXISTS idx_analytics_clicked_at ON analytics_clicks(clicked_at);

-- View for daily stats
CREATE OR REPLACE VIEW analytics_daily AS
SELECT 
  DATE(clicked_at) as date,
  source,
  campaign,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT ip_hash) as unique_clicks
FROM analytics_clicks
GROUP BY DATE(clicked_at), source, campaign
ORDER BY date DESC, total_clicks DESC;
