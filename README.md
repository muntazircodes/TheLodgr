# The Logdr - Backend

A type-safe Node.js/Express backend powered by Supabase (Postgres) that models destinations, weather forecasting, users, and points of interest (POIs). It emphasizes clean separation between routing, services, and data access, and includes a scheduler for periodic weather snapshots.

---

## Overview

- **Domain**: Destinations with geo boundaries and centers; user profiles; POIs within destinations; daily/hourly weather snapshots per destination.
- **Persistence**: Supabase Postgres with SQL migrations managed via Supabase CLI (see `supabase/migrations`).
- **Auth**: Supabase Auth for signup/login; a Bearer-token `authMiddleware` protects private routes.
- **Weather**: Tomorrow.io provider for forecasts; results normalized and stored as snapshots.
- **POIs**: CRUD for POIs linked to destinations, with categories, ratings, and wishlists (foundation present).
- **DX**: TypeScript, modular routes/services, structured error handling, environment-based configuration.

Scope note: This README documents everything up to POIs. It intentionally omits Price and Package services which are not implemented yet.

---

## Architecture

- **Bootstrap (`src/bootstrap/app.bootstrap.ts`)**
    - Configures Express (CORS, JSON body parsing, URL-encoded, logging via `morgan`).
    - Initializes Supabase clients: app (anon) and admin (service role) via `database.config` and `database-admin.config`.
    - Registers routes through `initRouter` and attaches a centralized `errorHandler`.
    - Starts `WeatherScheduler` for periodic weather updates.

- **Routing (`src/configuration/router.config.ts` and `src/routes/*`)**
    - Router mounts feature modules: health, auth, users, destinations, weather (scoped by destination), and POIs (scoped by destination). Ratings, wishlists, and categories routes exist for POI adjunct data.
    - Route handlers are thin. They parse inputs, call services, and return results.

- **Services (`src/services/*`)**
    - Encapsulate business logic and DB access via Supabase client (`getDB()`).
    - Throw typed HTTP errors (`@hyperflake/http-errors`) that are normalized by the error middleware.

- **Data Access (`src/configuration/database.config.ts`)**
    - Provides a singleton Supabase client (anon) for application queries.
    - Admin client (`database-admin.config.ts`) is initialized for privileged operations (not directly used in handlers).

- **Auth (`src/middlewares/auth.middleware.ts`, `src/services/auth.service.ts`)**
    - Signup/login handled via Supabase Auth.
    - Middleware validates Bearer tokens, attaches `req.supabase` and `req.user`.

- **Utilities**
    - `weather.scheduler.ts`: cron-based periodic fetch and snapshot of weather.
    - `destination.helper.ts`: mapping and GeoJSON normalization for destinations.
    - `weather.mapper.ts`: transforms Tomorrow.io payloads to the internal forecast shape.

- **Interfaces (`src/interfaces/*`)**
    - Strongly-typed DTOs and domain models for destinations, weather snapshots, POIs, and related entities.

---

## Core Domain Models

- **Destination**
    - Fields: `id`, `name`, `slug`, `area` (GeoJSON MultiPolygon), `center` (lat/lng), `metadata`, `createdAt`, `updatedAt`.
    - Mapping converts DB snake_case rows into a typed domain model and normalizes polygons.

- **User Profile**
    - Persisted in `user_profiles` with personal, address, and contact details keyed by `id` (Supabase user id).

- **Weather Snapshot**
    - Linked to a destination via `destination_id` and a `snapshot_date` (YYYY-MM-DD).
    - Stores `mapped.hourly` and `mapped.daily` arrays with an `is_final` flag.

- **POI**
    - Linked to destination via `destination_id` and to a category via `category_id`.
    - Contains geospatial position, descriptive content, media, zoom preferences, and activation flags.

---

## Request Flow & Workflows

- **Authentication Flow**
    - Client signs up/logs in using Supabase Auth via service methods.
    - Client includes `Authorization: Bearer <access_token>` on protected requests.
    - Middleware verifies the token, loads the user, and continues the pipeline.

- **Destination Workflow**
    - Create destinations with `name`, `slug`, `area`, and optional `metadata`.
    - Service maps DB rows to the domain model, ensuring `area` is always a MultiPolygon and `center` resolves from columns or GeoJSON.

- **Weather Workflow**
    - `WeatherService.fetchAndStoreForDestination(destinationId, isFinal?)` resolves a destination’s `center_lat/center_lng`.
    - Fetches hourly/daily from Tomorrow.io; maps provider payloads via `WeatherMapper`.
    - Upserts into `weather_snapshots` as `{ hourly, daily, is_final }` for the `snapshot_date`.
    - `getStoredForecast(destinationId)` reads the latest snapshot (no live API calls in read path).

- **Scheduled Weather Updates**
    - `WeatherScheduler.start()` registers two cron jobs:
        - Every 3 hours at minute 0 for rolling updates.
        - Final daily snapshot at 23:59.
    - For each destination, the scheduler calls `fetchAndStoreForDestination` in parallel and logs outcomes.

- **POI Workflow**
    - Create/update/delete POIs scoped to a `destination_id`.
    - Read operations filter by `destination_id` or `(destination_id, poiId)`.
    - Categories, ratings, and wishlists are structured as separate resources tied to POIs (foundations are present in routes and interfaces).

---

## Configuration & Environment

Set the following environment variables (locally via `.env`, or platform secrets):

- `PORT` (default: `4500`)
- `CORS_ORIGINS` (comma-separated list or `*`)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TOMORROW_API_KEY` (Tomorrow.io)

---

## Local Development

- Install dependencies and build:
    - `npm install`
    - `npm run build` or `npm run dev` (if configured)
- Ensure Supabase is reachable (local or hosted) and the above env vars are set.
- Apply migrations with Supabase CLI or deploy to your Supabase project using the migrations in `supabase/migrations`.
- Start the server: `npm start`.

---

## Database & Migrations

- Migrations live under `supabase/migrations`. Relevant schemas include:
    - `user_profiles`
    - `destinations` (with `center_lat`, `center_lng`, `area`, `metadata`)
    - `weather_snapshots`
    - `pois` and adjunct tables for categories/ratings/wishlists
- Adjust or add migrations as the domain evolves.

---

## Error Handling

- Services throw `BadRequestError`, `NotFoundError`, or `UnauthorizedError` from `@hyperflake/http-errors`.
- The centralized error handler converts these into consistent HTTP responses.

---

## Deployment Notes

- Build with `npm run build` and start with `npm start`.
- Provide runtime env vars through your platform (Render, Vercel, etc.).
- Avoid exposing the service role key to clients; store secrets server-side only.

---

## Contributing

- Keep route handlers thin and put domain logic in services.
- Maintain type safety across interfaces and data mappers.
- Prefer incremental, focused PRs; update migrations and README when schemas change.

---

## Roadmap (Immediate Scope)

- Harden POI adjunct flows (categories, ratings, wishlist) and validations.
- Expand test coverage on services and mappers.
- Add caching and pagination where appropriate.

Note: Price and Package services are intentionally out of scope for now.
