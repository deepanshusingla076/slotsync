-- ============================================================
-- TABLE 1: event_types
-- ============================================================
CREATE TABLE IF NOT EXISTS event_types (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(100)  NOT NULL,
  slug             VARCHAR(100)  NOT NULL UNIQUE,
  description      TEXT,
  duration_minutes INTEGER       NOT NULL DEFAULT 30,
  color            VARCHAR(7)    NOT NULL DEFAULT '#006BFF',
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slug ON event_types (slug);
CREATE INDEX IF NOT EXISTS idx_is_active ON event_types (is_active);

-- ============================================================
-- TABLE 2: availability
-- ============================================================
CREATE TABLE IF NOT EXISTS availability (
  id             SERIAL PRIMARY KEY,
  day_of_week    SMALLINT    NOT NULL UNIQUE,
  start_time     TIME        NOT NULL,
  end_time       TIME        NOT NULL,
  is_available   BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_time CHECK (end_time > start_time)
);

-- ============================================================
-- TABLE 3: bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id               SERIAL PRIMARY KEY,
  event_type_id    INTEGER       NOT NULL,
  invitee_name     VARCHAR(100)  NOT NULL,
  invitee_email    VARCHAR(150)  NOT NULL,
  start_time       TIMESTAMP     NOT NULL,
  end_time         TIMESTAMP     NOT NULL,
  status           VARCHAR(50)   NOT NULL DEFAULT 'confirmed',
  notes            TEXT,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_type
    FOREIGN KEY (event_type_id) REFERENCES event_types(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_status_start ON bookings (status, start_time);
CREATE INDEX IF NOT EXISTS idx_start_end ON bookings (start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_event_type ON bookings (event_type_id);

-- ============================================================
-- TABLE 4: user_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id         SERIAL PRIMARY KEY,
  timezone   VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED: Availability (Mon–Fri 9am–5pm)
-- ============================================================
INSERT INTO availability (day_of_week, start_time, end_time, is_available) VALUES
  (0, '09:00:00', '17:00:00', FALSE),
  (1, '09:00:00', '17:00:00', TRUE),
  (2, '09:00:00', '17:00:00', TRUE),
  (3, '09:00:00', '17:00:00', TRUE),
  (4, '09:00:00', '17:00:00', TRUE),
  (5, '09:00:00', '17:00:00', TRUE),
  (6, '09:00:00', '17:00:00', FALSE)
ON CONFLICT (day_of_week) DO UPDATE SET
  start_time   = EXCLUDED.start_time,
  end_time     = EXCLUDED.end_time,
  is_available = EXCLUDED.is_available;

-- ============================================================
-- SEED: Settings
-- ============================================================
INSERT INTO user_settings (id, timezone)
VALUES (1, 'Asia/Kolkata')
ON CONFLICT (id) DO UPDATE SET
  timezone = EXCLUDED.timezone;

-- ============================================================
-- SEED: Event Types
-- ============================================================
INSERT INTO event_types (title, slug, description, duration_minutes, color) VALUES
  ('15 Minute Meeting', '15-min-meeting', 'A quick 15-minute sync call. Perfect for a fast check-in or brief discussion.', 15, '#006BFF'),
  ('30 Minute Meeting', '30-min-meeting', 'A focused 30-minute call to discuss ideas, review work, or plan next steps.', 30, '#10B981'),
  ('60 Minute Meeting', '60-min-meeting', 'An in-depth 60-minute session for detailed discussions, interviews, or deep dives.', 60, '#8B5CF6')
ON CONFLICT (slug) DO UPDATE SET
  description      = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  color            = EXCLUDED.color;

-- ============================================================
-- SEED: Sample Bookings (upcoming + past)
-- ============================================================
INSERT INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, notes)
SELECT *
FROM (
  VALUES
    (2, 'Priya Sharma', 'priya@example.com', NOW() + INTERVAL '2 days' + INTERVAL '10 hours', NOW() + INTERVAL '2 days' + INTERVAL '10 hours 30 minutes', 'Looking forward to connecting!'),
    (1, 'Rahul Gupta', 'rahul@example.com', NOW() + INTERVAL '3 days' + INTERVAL '14 hours', NOW() + INTERVAL '3 days' + INTERVAL '14 hours 15 minutes', NULL),
    (3, 'Aisha Khan', 'aisha@example.com', NOW() + INTERVAL '5 days' + INTERVAL '11 hours', NOW() + INTERVAL '5 days' + INTERVAL '12 hours', 'Wanted to discuss the project proposal in detail.')
) AS seed_data(event_type_id, invitee_name, invitee_email, start_time, end_time, notes)
WHERE NOT EXISTS (SELECT 1 FROM bookings);

