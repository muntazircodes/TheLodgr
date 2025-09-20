# Project Antlers

A clean, type-safe Node.js/Express backend powered by Supabase (Postgres) for data storage, token-based authentication, and a straightforward domain model focused on destinations, weather integration, and points of interest. Designed for simple deployments (Render/Vercel) and CI via GitHub Workflows.

---

## Features

- **Express API** with modular routing and services, keeping business logic clean and handlers minimal.
- **Supabase Postgres** for persistence, using a standalone User table (separate from Supabase Auth).
- **Token-based authentication middleware** for protected routes and a dedicated AuthService for signup/login.
- **Weather API integration** linked to destination IDs, plus POI (Points of Interest) flow.
- **Production-ready configuration** for Vercel/Render and GitHub Actions CI.

---

## Tech Stack

- **Node.js, TypeScript, Express** for HTTP server and routing.
- **Supabase JS client** for Postgres access and service key management.
- **Postgres schema** managed via SQL migrations (Supabase CLI workflow).
- **dotenv** for environment configuration and **nodemon** for development.

---

## Architecture

- **Routes:** Thin controllers that map HTTP requests to services and return typed responses.
- **Services:** Encapsulate domain logic for authentication, users, destinations, weather, and POIs.
- **Data:** Centralized Supabase client module with typed access and error normalization.
- **Auth:** Token verification middleware and AuthService for signup/login with strict checks.

---

## API Overview

- **Auth:**
    - `POST /auth/signup`
    - `POST /auth/login`
    - Returns tokens for subsequent requests.
- **Users:** CRUD for user profiles (name, profile, Aadhaar, address, phone, altPhone, etc.).
- **Destinations:** CRUD and linkage to weather and POIs by `destinationId`.
- **Weather:**
    - `GET /destinations/:id/weather` for current and forecast data by coordinates/IDs.
    - `GET /api/v1/weather/destination/:id` for weather data.
    - `POST /api/v1/weather/destination/:id/update` to manually trigger weather updates.
    - `GET /api/v1/weather/destination/:id/date/:date` for historical weather data.
- **POIs:** `GET /destinations/:id/pois` via provider integration.

---

## Getting Started

### Prerequisites

- Node.js 22 or higher
- Supabase project URL and service role key

### Installation

## Auth

- **Signup:** Validates profile fields, creates a user row, and returns a token.
- **Login:** Verifies credentials or OTP/token strategy and issues a short-lived token.
- **Middleware:** Checks Bearer token and attaches the principal to the request.

---

## Destinations & Weather

- Destinations include latitude and longitude.
- The `WeatherService` fetches weather data by coordinates keyed from `destinationId`.
- The separation of concerns keeps the weather provider swap-friendly and testable.

---

## Points of Interest (POIs)

- `POIService` queries by `destinationId` and normalizes provider payloads to a stable contract.
- Caching can be added at the service boundary for performance.

---

## Local Development

- Run Supabase locally or point to a hosted project; configure the service key in `.env`.
- Use a REST client or Postman collections to test routes with tokens.

---

## Deployment

- **Render:** Deploy as a Node service with:
    - **Build Command:** `npm run build`
    - **Start Command:** `npm start`
    - Set environment variables in the dashboard.
- **Vercel:** Deploy as a server runtime. Ensure API routes or custom server config and environment variables are set. Avoid platform features incompatible with long-lived processes.
- **Supabase Edge Functions:** These are Deno-based; Express apps do not deploy directly here.

---

## CI/CD

- **GitHub Actions:**
    - Matrix for Node versions.
    - Install, build, and run unit tests.
    - Optionally run `supabase db diff/push` against staging before deploy.
    - Deploy via Render or Vercel CLIs with secrets in GitHub.

---

## Scripts

| Script      | Description            |
| ----------- | ---------------------- |
| `dev`       | `nodemon src/index.ts` |
| `build`     | `tsc`                  |
| `start`     | `node dist/index.js`   |
| `lint/test` | Optional project setup |

---

## Conventions

- Type-safe DTOs at the route boundary; services work with domain types.
- No `try/catch` in services; errors bubble up and are normalized by error middleware.
- Explicit return contracts per route for stable client integration.

---

## Scalability & Roadmap

Project Antlers is architected for incremental scaling. The service boundaries make it straightforward to add:

- Additional integrations (e.g., transport, booking, payments)
- Advanced analytics pipelines on top of user/destination data
- Microservice decomposition for high-traffic workloads (auth, weather, POIs as separate services)
- Event-driven flows (queue or Pub/Sub) for async operations like weather refresh or POI sync
- Multi-tenant support with schema separation or row-level security

This ensures the current design remains production-ready today while being extensible for enterprise-grade growth tomorrow.

---

## Security

- Service role key is kept server-side only and never exposed to clients.
- JWT tokens are short-lived with a rotation strategy; store secrets in environment variables or platform secret stores.
- Input validation and content-type checks are enforced at the route layer.

---

## Troubleshooting

- **401 on protected routes:** Confirm Bearer token is present and not expired.
- **Database errors:** Verify `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and table names/migrations.
- **Weather failures:** Ensure `WEATHER_API_KEY` is set and that the destination has coordinates.

---

## License

MIT unless otherwise noted in the repository.

---

## Acknowledgements

Thanks to the Supabase and Express ecosystems for robust tooling that keeps the stack simple and scalable.

```

```
