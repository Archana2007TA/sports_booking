# 🏏 Sports Match Booking

A full-stack ticket booking web app for IPL matches, built with **React** and **Supabase**. Users can sign up, log in, view upcoming matches, book seats in real time, and see live seat availability update instantly across all connected users.

## ✨ Features

- 🔐 **Authentication** — email/password signup and login via Supabase Auth
- 🏟️ **Live match listings** — pulled directly from a Supabase Postgres database
- 🎟️ **Seat booking** — book seats for any upcoming match
- 🚫 **Overbooking protection** — enforced both client-side and via a Postgres database trigger
- ⚡ **Realtime updates** — seat counts update live for all users the instant a booking is made (Supabase Realtime)
- 📄 **My Bookings** — view your own booked matches
- 🎨 **Clean, responsive UI** — styled with custom CSS, includes a navbar and multi-page routing

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Supabase (Postgres database, Auth, Realtime, Row Level Security)
- **Styling:** Custom CSS

## 📂 Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── MatchList.jsx
│   │   └── BookingForm.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Booking.jsx
│   │   ├── MyBookings.jsx
│   │   └── Login.jsx
│   ├── AuthContext.jsx
│   ├── supabaseClient.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env              # not committed — see setup below
├── package.json
└── README.md
```

## 🗄️ Database Schema

**`matches`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| team_a | text | |
| team_b | text | |
| match_date | timestamptz | |
| venue | text | |
| status | text | default `'scheduled'` |
| capacity | integer | default `50` |
| created_at | timestamptz | default `now()` |

**`bookings`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| match_id | uuid | references `matches(id)` |
| user_id | uuid | references `auth.users(id)` |
| user_name | text | |
| seats | integer | default `1` |
| booked_at | timestamptz | default `now()` |

**`match_booking_totals`** (view)
Aggregates total seats booked per match, exposed publicly for live seat-count display without leaking individual user bookings.

Row Level Security is enabled on both tables, with policies restricting inserts/reads to the booking's own user, plus a trigger (`check_booking_capacity`) that rejects any insert exceeding a match's capacity.

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ipl-match-booking.git
cd ipl-match-booking/my-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the schema (see `/supabase/schema.sql` if included, or the **Database Schema** section above) to create `matches`, `bookings`, RLS policies, the capacity trigger, and the `match_booking_totals` view.
3. Enable **Realtime** on the `bookings` table:
   ```sql
   alter publication supabase_realtime add table bookings;
   ```
4. Under **Authentication → Providers → Email**, ensure Email auth is enabled.

### 4. Configure environment variables
Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Find both values under **Project Settings → API** in your Supabase dashboard.

### 5. Run the app
```bash
npm run dev
```
Visit `http://localhost:5173`.

## 🧭 Pages

| Route | Description |
|---|---|
| `/` | Welcome / landing page |
| `/booking` | Browse matches and book seats |
| `/my-bookings` | View your bookings |
| `/login` | Sign up / log in |

## 🔮 Possible Next Steps

- Show logged-in user's email + logout button in the navbar
- Let users cancel a booking
- Admin page to add/edit matches without using the SQL Editor
- Deploy to Vercel or Netlify for a live shareable link

## 📄 License

This project is for educational purposes.
