-- ============================================================
-- SlotSync Database Schema
-- ============================================================
-- Run this file once to set up the database from scratch.
-- Usage: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS slotsync;
USE slotsync;

-- ============================================================
-- TABLE 1: event_types
-- ============================================================
-- Stores the different types of meetings the host offers.
-- e.g. "30-min Coffee Chat", "1-hr Strategy Call"
--
-- slug → used in the public booking URL: /book/{slug}
--        must be unique and URL-safe (e.g. "coffee-chat")
-- ============================================================

CREATE TABLE IF NOT EXISTS event_types (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(100)  NOT NULL,
  slug             VARCHAR(100)  NOT NULL UNIQUE,   -- URL-friendly name, must be unique
  description      TEXT,                            -- optional details shown to invitee
  duration_minutes INT           NOT NULL DEFAULT 30, -- meeting length in minutes
  color            VARCHAR(7)    NOT NULL DEFAULT '#0066FF', -- hex color for UI display
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,  -- hide without deleting
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ============================================================
-- TABLE 2: availability
-- ============================================================
-- Defines the host's weekly working hours per day.
-- Each row = one day of the week with a start and end time.
--
-- day_of_week:  0 = Sunday, 1 = Monday, ... 6 = Saturday
-- is_available: FALSE means the host is off that day entirely
-- ============================================================

CREATE TABLE IF NOT EXISTS availability (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week    TINYINT     NOT NULL,          -- 0 (Sun) to 6 (Sat)
  start_time     TIME        NOT NULL,          -- e.g. '09:00:00'
  end_time       TIME        NOT NULL,          -- e.g. '17:00:00'
  is_available   BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_day (day_of_week),          -- one row per day only
  CONSTRAINT chk_time CHECK (end_time > start_time) -- end must be after start
);


-- ============================================================
-- TABLE 3: bookings
-- ============================================================
-- Stores every meeting booked by an invitee.
--
-- Relationship: each booking belongs to one event_type
--   (event_type_id → event_types.id)
--
-- Double-booking prevention:
--   UNIQUE KEY on (start_time) ensures no two *confirmed*
--   bookings can occupy the same slot. Cancelled bookings
--   don't block the slot — handled in app logic.
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  event_type_id    INT           NOT NULL,
  invitee_name     VARCHAR(100)  NOT NULL,
  invitee_email    VARCHAR(150)  NOT NULL,
  start_time       DATETIME      NOT NULL,        -- booking start (e.g. 2025-05-01 10:00:00)
  end_time         DATETIME      NOT NULL,        -- booking end   (e.g. 2025-05-01 10:30:00)
  status           ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  notes            TEXT,                           -- optional message from invitee
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

  -- Relationship: booking must reference a valid event type
  CONSTRAINT fk_event_type
    FOREIGN KEY (event_type_id) REFERENCES event_types(id)
    ON DELETE CASCADE,  -- if an event type is deleted, its bookings go too

  -- Prevent double booking: no two confirmed bookings at the same start time
  UNIQUE KEY unique_confirmed_slot (start_time)
);


-- ============================================================
-- SEED DATA — Default availability (Mon–Fri, 9am to 5pm)
-- ============================================================
-- This gives the app a working state from the start.
-- You can update these via the Availability Settings page.
-- ============================================================

INSERT INTO availability (day_of_week, start_time, end_time, is_available) VALUES
  (0, '09:00:00', '17:00:00', FALSE), -- Sunday  → off
  (1, '09:00:00', '17:00:00', TRUE),  -- Monday  → available
  (2, '09:00:00', '17:00:00', TRUE),  -- Tuesday → available
  (3, '09:00:00', '17:00:00', TRUE),  -- Wednesday → available
  (4, '09:00:00', '17:00:00', TRUE),  -- Thursday → available
  (5, '09:00:00', '17:00:00', TRUE),  -- Friday  → available
  (6, '09:00:00', '17:00:00', FALSE); -- Saturday → off


-- ============================================================
-- SEED DATA — Sample event type
-- ============================================================

INSERT INTO event_types (title, slug, description, duration_minutes, color) VALUES
  ('30 Min Meeting', '30-min-meeting', 'A quick 30-minute introductory call.', 30, '#0066FF');
