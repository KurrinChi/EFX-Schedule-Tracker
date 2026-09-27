const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const {
  testDatabaseConnection,
  ensureUserAuthSchema,
} = require("./config/database");

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const clientsRoutes = require("./routes/clients.routes");
const packagesRoutes = require("./routes/packages.routes");
const servicesRoutes = require("./routes/services.routes");
const projectsRoutes = require("./routes/projects.routes");

const app = express();

const PORT = process.env.PORT || 5000;
const configuredOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? configuredOrigins
    : [
        ...new Set([
          ...configuredOrigins,
          "http://localhost:5173",
          "http://localhost:5174",
        ]),
      ];

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS policy denied."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EFX Tracker API is running.",
    version: "1.0.0",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await testDatabaseConnection();

    res.json({
      success: true,
      api: "online",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check database error:", error);

    res.status(503).json({
      success: false,
      api: "online",
      database: "disconnected",
      message: "Database connection failed.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/projects", projectsRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error.",
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const startServer = async () => {
  try {
    await testDatabaseConnection();
    await ensureUserAuthSchema();

    app.listen(PORT, () => {
      console.log("");
      console.log("========================================");
      console.log("       EFX TRACKER API SERVER");
      console.log("========================================");
      console.log(`API: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log("========================================");
      console.log("");
    });
  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error("SERVER STARTUP ABORTED");
    console.error("========================================");
    console.error("Database error:", error.message);
    console.error("Error code:", error.code);
    console.error("========================================");
    console.error("");

    process.exit(1);
  }
};

startServer();
