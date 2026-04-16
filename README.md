# SlotSync — Calendly Clone (Full-Stack Scheduling Platform)

A **production-ready scheduling application** built as a placement assignment. Closely replicates Calendly's UI/UX, layout, and user flow.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + Tailwind CSS v4 |
| Backend  | Node.js + Express.js |
| Database | MySQL (raw SQL, mysql2 driver) |
| Fonts | Inter (Google Fonts) |

---

## ✨ Features

### Event Types
- Create, edit, delete event types
- Custom name, duration, colour
- Auto-generated unique slug
- Active / Inactive toggle
- Public booking link: `/book/{slug}`

### Availability
- Set weekly schedule (Monday–Sunday)
- Per-day time ranges (e.g. 9 AM – 5 PM)
- Timezone selector
- Persisted to database

### Public Booking Page (`/book/{slug}`)
- Calendly-faithful 3-step flow: **Calendar → Time Slots → Form**
- Back buttons at every step
- Prevents double-booking with overlap detection
- Shows booked slots as greyed-out
- Confirmation page after booking

### Meetings Dashboard
- Upcoming and past meetings tabs
- Cancel a meeting (soft-delete)
- Cancelled meetings move to the Past tab

---

## 🗂 Project Structure

```
slotsync/
├── backend/                   # Express API
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── eventTypeController.js
│   │   ├── availabilityController.js
│   │   ├── bookingController.js
│   │   ├── meetingController.js
│   │   ├── settingsController.js
│   │   └── healthController.js
│   ├── models/
│   │   ├── eventTypeModel.js
│   │   ├── availabilityModel.js
│   │   ├── bookingModel.js
│   │   └── settingsModel.js
│   ├── routes/
│   │   ├── eventTypeRoutes.js
│   │   ├── availabilityRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── meetingRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── healthRoutes.js
│   ├── server.js
│   ├── .env
│   └── .env.example
│
├── frontend/                  # Next.js App
│   ├── app/
│   │   ├── (dashboard)/       # Sidebar layout group
│   │   │   ├── layout.js
│   │   │   ├── page.js        # → redirects to /dashboard
│   │   │   ├── dashboard/
│   │   │   │   └── page.js    # Event Types list
│   │   │   ├── availability/
│   │   │   │   └── page.js    # Weekly hours editor
│   │   │   └── meetings/
│   │   │       └── page.js    # Scheduled events
│   │   ├── book/
│   │   │   └── [slug]/
│   │   │       ├── page.js         # Public booking page
│   │   │       └── confirmation/
│   │   │           └── page.js     # Booking confirmed
│   │   ├── globals.css
│   │   └── layout.js          # Root layout
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Calendar.jsx
│   │   ├── TimeSlotPicker.jsx
│   │   ├── EventTypeCard.jsx
│   │   ├── EventTypeModal.jsx
│   │   └── MeetingCard.jsx
│   ├── lib/
│   │   ├── api.js             # All fetch() calls centralised
│   │   └── utils.js           # Date/time helpers
│   └── .env.local
│
└── database/
    └── schema.sql             # Full schema + seed data
```

---

## 🚀 Getting Started

### 1. Set up MySQL

Make sure MySQL is running locally. Then run:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `slotsync` database, all tables, and seeds sample data.

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
```

`.env` format:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=slotsync
```

### 3. Start Backend

```bash
cd backend
npm install
npm run dev
```

API runs at: `http://localhost:5000`
Health check: `http://localhost:5000/health`

### 4. Configure Frontend

```bash
cd frontend
# .env.local is already set to http://localhost:5000
```

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:3000`

---

## 🌐 Pages

| URL | Description |
|-----|-------------|
| `/` → `/dashboard` | Event Types list (redirect) |
| `/dashboard` | Manage event types |
| `/availability` | Set weekly availability hours |
| `/meetings` | View & cancel meetings |
| `/book/{slug}` | Public booking page (no login) |
| `/book/{slug}/confirmation` | Booking confirmed screen |

---

## 🔌 API Endpoints

### Event Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/event-types` | List all event types |
| POST | `/event-types` | Create event type |
| PUT | `/event-types/:id` | Update event type |
| DELETE | `/event-types/:id` | Delete event type |
| GET | `/event-types/slug/:slug` | Get by slug (for booking page) |

### Availability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/availability` | Get all 7 days |
| POST | `/availability` | Save/upsert all days |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create a booking (with full validation) |
| GET | `/bookings/slots?date=YYYY-MM-DD` | Get booked times for a date |

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings/upcoming` | Upcoming confirmed meetings |
| GET | `/meetings/past` | Past/cancelled meetings |
| DELETE | `/meetings/:id` | Cancel a meeting |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get timezone setting |
| PUT | `/settings` | Update timezone |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

---

## 🗄 Database Schema

```sql
-- Four tables
event_types    -- id, title, slug (UNIQUE), description, duration_minutes, color, is_active
availability   -- id, day_of_week (UNIQUE 0-6), start_time, end_time, is_available
bookings       -- id, event_type_id (FK), invitee_name, invitee_email, start_time, end_time, status, notes
user_settings  -- id, timezone
```

**Double-booking prevention:**
- Application-level overlap check in `bookingController.js` (Step 7)
- Detects ALL overlap patterns including partial overlaps
- Only blocks `confirmed` bookings — cancelled slots can be rebooked

---

## ⚙️ Design Decisions

- **No authentication** — single default user, as per spec
- **Soft-delete cancellations** — bookings are marked `cancelled`, not deleted; history is preserved
- **Slug auto-generation** — derived from event title, checked for uniqueness
- **Overlap detection** — uses the standard interval overlap formula: `existing.start < new.end AND existing.end > new.start`
- **Responsive** — works on mobile and desktop

---

## 🖥 Screenshots

| Dashboard | Booking Page | Availability |
|-----------|-------------|--------------|
| Event types grid with colour dots | 3-step booking flow | Weekly hours toggle |

---

*Built with ❤️ as a placement assignment — SlotSync, a Calendly Clone.*
