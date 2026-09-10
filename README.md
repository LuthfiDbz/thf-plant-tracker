# Plant Tracker

A minimal, mobile-first plant tracking app (Soil & Hydroponics) built with React, Vite, TypeScript, Radix UI Themes, and Supabase.

## 1. Supabase setup

1. Create a new project at https://supabase.com.
2. Open the **SQL editor** and run the contents of `supabase/schema.sql`. This creates:
   - `plants` table (shared master data catalog)
   - `plant_logs` table (per-user tracking logs, with RLS so each user only sees their own logs)
   - a public `plant-images` storage bucket with upload policies
3. In **Authentication → Providers**, make sure **Email** sign-in is enabled (it is by default). You can turn off "Confirm email" for faster local testing, or leave it on for production.
4. Copy your project's **URL** and **anon public key** from **Project Settings → API**.

## 2. App setup

```bash
cp .env.example .env
# then edit .env and paste your Supabase URL + anon key

npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## 3. Using the app

1. Sign up with an email + password on the login screen (or sign in if you already have an account).
2. Go to the **Plants** tab first and add a few plants (name, estimated harvest days, optional photo and notes) — this is the catalog used by Soil/Hydroponic logs.
3. Go to **Soil** or **Hydroponic** and tap **+ Add** to create a log entry: pick a plant, method, status, plant date, and target harvest date. Selecting a plant shows its estimated harvest days as a guide.
4. Tap a log card to advance its status (Seedling → Planting → Harvested). When marked Harvested, the harvest status (On time / Early / Outdated) is calculated automatically by comparing today's date to the target harvest date (±2 days tolerance).
5. Use the filter button on Soil/Hydroponic pages to filter by status, plant date, or harvest date range.
6. Tap the avatar (top-right) to view your profile and log out.

## Notes on scope

This app intentionally sticks to the requested feature set only: auth, plants CRUD, and soil/hydro logs with status + harvest-status tracking, infinite scroll, and basic filtering. No analytics, charts, exports, or extra tables were added.
