# EFX Creations Schedule Tracker

A React + Vite frontend for managing EFX Creations photography and videography productions.

## Run the frontend

```bash
cd client
npm install
npm run dev
```

The application currently runs database-free in mock mode by default. Mock authentication and mock data are clearly labeled in the UI. Sign in with `admin@efxcreations.test` / `Admin123!`.

The UI never reads mock records directly. The active flow is `components -> services -> mockApi -> mockDatabase`. When the future Express API is ready, set `VITE_USE_MOCK_API=false` and configure `VITE_API_BASE_URL`; the UI component structure does not need to change.

## Architecture

React components call service modules only. Services use mock data while `VITE_USE_MOCK_API=true`, or Axios REST requests when disabled. Authentication is held in `AuthContext`; the future backend owns bcrypt, JWT/session handling, validation, authorization, and MSSQL access. Refresh tokens should be HttpOnly Secure SameSite cookies rather than frontend storage.

The main dashboard intentionally combines project management, entity creation, reporting, stats, and activity charts into one responsive workspace.
