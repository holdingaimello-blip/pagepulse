-- Tabella per storage token OAuth (Holding AI)
CREATE TABLE IF NOT EXISTS holding_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL UNIQUE, -- 'linkedin', 'twitter', etc.
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index per provider
CREATE INDEX IF NOT EXISTS idx_holding_auth_provider ON holding_auth(provider);

-- Function per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per auto-update updated_at
DROP TRIGGER IF EXISTS update_holding_auth_updated_at ON holding_auth;
CREATE TRIGGER update_holding_auth_updated_at
  BEFORE UPDATE ON holding_auth
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
