CREATE DATABASE IF NOT EXISTS slotsync;
USE slotsync;

-- ============================================================
-- TABLE 1: event_types
-- ============================================================
CREATE TABLE IF NOT EXISTS event_types (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(100)  NOT NULL,
  slug             VARCHAR(100)  NOT NULL UNIQUE,
  description      TEXT,
  duration_minutes INT           NOT NULL DEFAULT 30,
  color            VARCHAR(7)    NOT NULL DEFAULT '#006BFF',
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_is_active (is_active)
);

-- ============================================================
-- TABLE 2: availability
-- ============================================================
CREATE TABLE IF NOT EXISTS availability (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week    TINYINT     NOT NULL,
  start_time     TIME        NOT NULL,
  end_time       TIME        NOT NULL,
  is_available   BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_day (day_of_week),
  CONSTRAINT chk_time CHECK (end_time > start_time)
);

-- ============================================================
-- TABLE 3: bookings
-- Removed the unique_confirmed_slot constraint on start_time.
-- The overlap check is enforced at the application layer
-- (bookingController.js step 7) which is smarter — it only
-- blocks confirmed bookings and ignores cancelled ones.
-- A DB-level UNIQUE on start_time would block rebooking a
-- cancelled slot since the cancelled row still exists.
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  event_type_id    INT           NOT NULL,
  invitee_name     VARCHAR(100)  NOT NULL,
  invitee_email    VARCHAR(150)  NOT NULL,
  start_time       DATETIME      NOT NULL,
  end_time         DATETIME      NOT NULL,
  status           ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  notes            TEXT,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_type
    FOREIGN KEY (event_type_id) REFERENCES event_types(id)
    ON DELETE CASCADE,
  INDEX idx_status_start (status, start_time),
  INDEX idx_start_end (start_time, end_time),
  INDEX idx_event_type (event_type_id)
);

-- ============================================================
-- TABLE 4: user_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  timezone   VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
ON DUPLICATE KEY UPDATE
  start_time   = VALUES(start_time),
  end_time     = VALUES(end_time),
  is_available = VALUES(is_available);

-- ============================================================
-- SEED: Settings
-- ============================================================
INSERT INTO user_settings (timezone) VALUES ('Asia/Kolkata')
ON DUPLICATE KEY UPDATE timezone = VALUES(timezone);

-- ============================================================
-- SEED: Event Types
-- ============================================================
INSERT INTO event_types (title, slug, description, duration_minutes, color) VALUES
  ('15 Minute Meeting', '15-min-meeting', 'A quick 15-minute sync call. Perfect for a fast check-in or brief discussion.', 15, '#006BFF'),
  ('30 Minute Meeting', '30-min-meeting', 'A focused 30-minute call to discuss ideas, review work, or plan next steps.', 30, '#10B981'),
  ('60 Minute Meeting', '60-min-meeting', 'An in-depth 60-minute session for detailed discussions, interviews, or deep dives.', 60, '#8B5CF6')
ON DUPLICATE KEY UPDATE
  description      = VALUES(description),
  duration_minutes = VALUES(duration_minutes),
  color            = VALUES(color);

-- ============================================================
-- SEED: Sample Bookings (upcoming + past)
-- Run AFTER the above — uses relative dates so data is always fresh
-- ============================================================
-- Upcoming / future bookings
INSERT IGNORE INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, notes) VALUES
  (2, 'Priya Sharma',  'priya@example.com',  DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 2  DAY), '%Y-%m-%d 10:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 2  DAY), '%Y-%m-%d 10:30:00'), 'Looking forward to connecting!'),
  (1, 'Rahul Gupta',   'rahul@example.com',  DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 3  DAY), '%Y-%m-%d 14:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 3  DAY), '%Y-%m-%d 14:15:00'), NULL),
  (3, 'Aisha Khan',    'aisha@example.com',  DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 5  DAY), '%Y-%m-%d 11:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 5  DAY), '%Y-%m-%d 12:00:00'), 'Wanted to discuss the project proposal in detail.'),
  (2, 'Rohan Verma',   'rohan@example.com',  DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 7  DAY), '%Y-%m-%d 09:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 7  DAY), '%Y-%m-%d 09:30:00'), NULL),
  (1, 'Meera Patel',   'meera@example.com',  DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 10 DAY), '%Y-%m-%d 15:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 10 DAY), '%Y-%m-%d 15:15:00'), 'Quick intro call');

-- Past bookings
INSERT IGNORE INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, status, notes) VALUES
  (2, 'Arjun Mehta',   'arjun@example.com',  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 3  DAY), '%Y-%m-%d 09:30:00'), DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 3  DAY), '%Y-%m-%d 10:00:00'), 'confirmed', NULL),
  (1, 'Sneha Reddy',   'sneha@example.com',  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 5  DAY), '%Y-%m-%d 15:00:00'), DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 5  DAY), '%Y-%m-%d 15:15:00'), 'confirmed', 'Quick intro call'),
  (2, 'Vikram Singh',  'vikram@example.com', DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 7  DAY), '%Y-%m-%d 10:30:00'), DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 7  DAY), '%Y-%m-%d 11:00:00'), 'cancelled', NULL),
  (3, 'Deepika Nair',  'deepika@example.com',DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 10 DAY), '%Y-%m-%d 13:00:00'), DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 10 DAY), '%Y-%m-%d 14:00:00'), 'confirmed', 'Product roadmap review'),
  (1, 'Kartik Rao',    'kartik@example.com', DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 14 DAY), '%Y-%m-%d 11:00:00'), DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 14 DAY), '%Y-%m-%d 11:15:00'), 'cancelled', NULL);
