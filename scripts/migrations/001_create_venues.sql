CREATE TABLE IF NOT EXISTS venues (
  id SERIAL PRIMARY KEY,
  osm_id TEXT UNIQUE,
  name TEXT NOT NULL,
  city TEXT,
  category TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  website TEXT,
  phone TEXT,
  opening_hours TEXT,
  data_source TEXT NOT NULL DEFAULT 'osm',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  last_verified_at TIMESTAMPTZ,
  raw_tags JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_verified ON venues(verified);
CREATE INDEX IF NOT EXISTS idx_venues_lat_lng ON venues(latitude, longitude);
