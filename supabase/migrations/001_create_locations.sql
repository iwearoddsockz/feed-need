-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enum for meal types
CREATE TYPE meal_type AS ENUM (
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'food_parcel',
  'pantry'
);

-- Enum for days of the week
CREATE TYPE day_of_week AS ENUM (
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
);

-- Main locations table
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organisation TEXT,
  description TEXT,
  street_address TEXT NOT NULL,
  suburb TEXT NOT NULL,
  postcode TEXT NOT NULL,
  state TEXT DEFAULT 'WA',
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  geom GEOGRAPHY(POINT, 4326),
  phone TEXT,
  email TEXT,
  website TEXT,
  eligibility_criteria TEXT,
  referral_required BOOLEAN DEFAULT false,
  wheelchair_accessible BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Operating schedule (one location can have multiple services)
CREATE TABLE operating_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  day day_of_week NOT NULL,
  meal_type meal_type NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(location_id, day, meal_type, start_time)
);

-- Indexes for locations
CREATE INDEX idx_locations_suburb ON locations(suburb);
CREATE INDEX idx_locations_postcode ON locations(postcode);
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
CREATE INDEX idx_locations_active ON locations(is_active) WHERE is_active = true;

-- Indexes for operating_schedules
CREATE INDEX idx_schedules_location ON operating_schedules(location_id);
CREATE INDEX idx_schedules_day ON operating_schedules(day);
CREATE INDEX idx_schedules_meal ON operating_schedules(meal_type);

-- Trigger to auto-compute geom from lat/lng
CREATE OR REPLACE FUNCTION update_geom()
RETURNS TRIGGER AS $$
BEGIN
  NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER locations_geom_trigger
  BEFORE INSERT OR UPDATE OF latitude, longitude ON locations
  FOR EACH ROW EXECUTE FUNCTION update_geom();

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER locations_updated_at_trigger
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
