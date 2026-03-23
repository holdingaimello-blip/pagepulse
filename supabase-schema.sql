-- PagePulse Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Users/subscriptions
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  stripe_subscription_id TEXT,
  url_limit INTEGER DEFAULT 3,
  check_interval_minutes INTEGER DEFAULT 1440,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monitored URLs
CREATE TABLE monitored_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  last_content_hash TEXT,
  last_checked_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change history
CREATE TABLE changes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  monitored_url_id UUID REFERENCES monitored_urls(id) ON DELETE CASCADE,
  previous_hash TEXT,
  new_hash TEXT,
  ai_summary TEXT,
  raw_diff_size INTEGER,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_monitored_urls_user ON monitored_urls(user_id);
CREATE INDEX idx_monitored_urls_status ON monitored_urls(status);
CREATE INDEX idx_changes_url ON changes(monitored_url_id);
CREATE INDEX idx_changes_detected ON changes(detected_at DESC);

-- Support tickets
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  ai_response TEXT,
  ai_response_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_email ON support_tickets(email);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
