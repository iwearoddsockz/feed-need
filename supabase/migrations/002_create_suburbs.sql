-- Suburbs reference table for search/autocomplete
CREATE TABLE suburbs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  postcode TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  lga TEXT,
  UNIQUE(name, postcode)
);

CREATE INDEX idx_suburbs_name ON suburbs(name);
CREATE INDEX idx_suburbs_postcode ON suburbs(postcode);
