/**
 * Utilities Library
 * 
 * Provides shared helper functions for date formatting, time manipulation,
 * and slot generation logic used across the frontend.
 */

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// "2025-05-01T10:00:00.000Z" → "Thursday, May 1, 2025"
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

// "2025-05-01T10:00:00.000Z" → "10:00 AM"
export const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });
};

// "HH:MM" → "10:00 AM"
export const formatTimeStr = (timeStr) => {
  return new Date(`2000-01-01T${timeStr}:00`).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });
};

// Generates an array of time slot objects between startTime and endTime.
// Each slot is `durationMinutes` apart.
// bookedSlots = ['10:00', '11:30'] marks those as unavailable.
//
// Returns: [{ time: '09:00', label: '9:00 AM', available: true }, ...]
export const generateTimeSlots = (startTime, endTime, durationMinutes, bookedSlots = []) => {
  const slots = [];

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH,   endM]   = endTime.split(':').map(Number);

  let current  = startH * 60 + startM;
  const end    = endH * 60 + endM;

  while (current + durationMinutes <= end) {
    const h    = Math.floor(current / 60);
    const m    = current % 60;
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    slots.push({
      time,
      label:    formatTimeStr(time),
      available: !bookedSlots.includes(time),
    });

    current += durationMinutes;
  }

  return slots;
};
