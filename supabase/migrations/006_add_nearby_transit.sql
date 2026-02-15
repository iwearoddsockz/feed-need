-- Add nearby_transit JSONB column to locations for bus/train data
ALTER TABLE locations ADD COLUMN nearby_transit JSONB DEFAULT '{"bus_stops":[],"train_stations":[]}';
