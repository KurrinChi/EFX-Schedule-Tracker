# Future Express API

The backend is intentionally not implemented in the frontend phase. The planned structure is:

```text
server/
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    validators/
    server.js
  .env
  package.json
```

Requests will follow `Route -> Controller -> Service -> Database (MSSQL)`. Authentication will use server-side bcrypt password hashing, short-lived access tokens, and HttpOnly Secure SameSite refresh-token cookies. The frontend Axios instance already enables credentials and points at `VITE_API_BASE_URL` when mock mode is disabled.
