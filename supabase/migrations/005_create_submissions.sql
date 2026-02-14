-- Submission types
CREATE TYPE submission_type AS ENUM ('new_location', 'edit_suggestion');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Submissions table for user-submitted new locations and edit suggestions
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_type submission_type NOT NULL,
  status submission_status DEFAULT 'pending',

  -- Reference to existing location (NULL for new_location, set for edit_suggestion)
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,

  -- Submitted location data as JSONB (flexible schema)
  submitted_data JSONB NOT NULL,

  -- Submitted operating schedules as JSONB array
  submitted_schedules JSONB,

  -- Notes from submitter and admin
  submitter_notes TEXT,
  admin_notes TEXT,

  -- Spam prevention: SHA-256 hash of submitter IP
  submission_ip_hash TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- Indexes for admin review workflow
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_submissions_location ON submissions(location_id);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX idx_submissions_ip_hash ON submissions(submission_ip_hash);

-- RLS: allow anonymous inserts, restrict reads to authenticated (admin)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions" ON submissions
  FOR SELECT USING (auth.role() = 'authenticated');
