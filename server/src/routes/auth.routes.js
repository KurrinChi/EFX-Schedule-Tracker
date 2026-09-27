const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { sql, getPool } = require("../config/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[A-Za-z0-9._]+$/;

const sanitizeText = (value, maxLength = 255) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

const normalizeEmail = (value) => sanitizeText(value, 255).toLowerCase();
const normalizeIdentifier = (value) => sanitizeText(value, 100).toLowerCase();

const passwordPolicy = (password) => {
  if (!password || password.length < 8 || password.length > 128) {
    return "Password must be between 8 and 128 characters long.";
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return "Password must include uppercase, lowercase, a number, and a special character.";
  }

  return "";
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

const buildAuthToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  if (!secret) {
    throw new Error("JWT secret is not configured.");
  }

  return jwt.sign(
    {
      id: user.Id,
      username: user.Username,
      role: user.Role,
    },
    secret,
    { expiresIn },
  );
};

const sendSafeUser = (user) => ({
  id: user.Id,
  fullName: user.FullName,
  email: user.Email,
  username: user.Username,
  role: user.Role,
});

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const fullName = sanitizeText(req.body?.fullName, 150);
    const email = normalizeEmail(req.body?.email);
    const username = sanitizeText(req.body?.username, 100).toLowerCase();
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";
    const confirmPassword =
      typeof req.body?.confirmPassword === "string"
        ? req.body.confirmPassword
        : "";

    const errors = {};

    if (!fullName) {
      errors.fullName = "Full name is required.";
    } else if (fullName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters.";
    } else if (fullName.length > 150) {
      errors.fullName = "Full name must be 150 characters or fewer.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address.";
    } else if (email.length > 255) {
      errors.email = "Email must be 255 characters or fewer.";
    }

    if (!username) {
      errors.username = "Username is required.";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    } else if (username.length > 100) {
      errors.username = "Username must be 100 characters or fewer.";
    } else if (!usernameRegex.test(username)) {
      errors.username =
        "Username can only contain letters, numbers, underscores, and periods.";
    }

    const passwordError = passwordPolicy(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const pool = await getPool();
    const existingUser = await pool
      .request()
      .input("email", sql.NVarChar(255), email)
      .input("username", sql.NVarChar(100), username).query(`
        SELECT TOP 1 Email, Username
        FROM dbo.Users
        WHERE Email = @email OR Username = @username
      `);

    if (existingUser.recordset.length > 0) {
      const duplicate = existingUser.recordset[0];
      const errors = {};

      if (duplicate.Email && duplicate.Email.toLowerCase() === email) {
        errors.email = "An account with this email already exists.";
      }

      if (duplicate.Username && duplicate.Username.toLowerCase() === username) {
        errors.username = "This username is already taken.";
      }

      return res.status(409).json({
        success: false,
        message:
          "An account with the provided email or username already exists.",
        errors,
      });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const id = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), id)
      .input("fullName", sql.NVarChar(150), fullName)
      .input("email", sql.NVarChar(255), email)
      .input("username", sql.NVarChar(100), username)
      .input("passwordHash", sql.NVarChar(255), passwordHash)
      .input("role", sql.NVarChar(50), "Admin").query(`
        INSERT INTO dbo.Users (Id, FullName, Email, Username, PasswordHash, Role)
        OUTPUT INSERTED.Id, INSERTED.FullName, INSERTED.Email, INSERTED.Username, INSERTED.Role
        VALUES (@id, @fullName, @email, @username, @passwordHash, @role)
      `);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: sendSafeUser(result.recordset[0]),
    });
  } catch (error) {
    console.error("POST /auth/register error:", error);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        success: false,
        message:
          "An account with the provided email or username already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later.",
    });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const identifier = normalizeIdentifier(req.body?.identifier);
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const pool = await getPool();
    const userResult = await pool
      .request()
      .input("identifier", sql.NVarChar(255), identifier).query(`
        SELECT TOP 1
          Id,
          FullName,
          Email,
          Username,
          PasswordHash,
          Role
        FROM dbo.Users
        WHERE Username = @identifier OR Email = @identifier
      `);

    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const user = userResult.recordset[0];

    if (!user.PasswordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.PasswordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const token = buildAuthToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sendSafeUser(user),
    });
  } catch (error) {
    console.error("POST /auth/login error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again later.",
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const pool = await getPool();
    const userResult = await pool
      .request()
      .input("id", sql.NVarChar(50), req.user.id).query(`
        SELECT TOP 1
          Id,
          FullName,
          Email,
          Username,
          Role
        FROM dbo.Users
        WHERE Id = @id
      `);

    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    return res.json({
      success: true,
      user: sendSafeUser(userResult.recordset[0]),
    });
  } catch (error) {
    console.error("GET /auth/me error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load current user.",
    });
  }
});

router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully." });
});

module.exports = router;
