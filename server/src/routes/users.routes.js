const express = require("express");
const bcrypt = require("bcryptjs");
const { sql, getPool } = require("../config/database");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET /api/users
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        Id AS id,
        FullName AS fullName,
        Email AS email,
        Username AS username,
        Role AS role
      FROM Users
      ORDER BY FullName ASC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("GET /users:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve users.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/users/:id
|--------------------------------------------------------------------------
*/

router.get("/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        SELECT
          Id AS id,
          FullName AS fullName,
          Email AS email,
          Username AS username,
          Role AS role
        FROM Users
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("GET /users/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve user.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/users
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const { fullName, email, username, role = "Admin" } = req.body;

    if (!fullName || !email || !username) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and username are required.",
      });
    }

    const password =
      typeof req.body.password === "string" && req.body.password.trim()
        ? req.body.password
        : "TempPassword123!";

    const pool = await getPool();

    const id = `usr-${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), id)
      .input("fullName", sql.NVarChar(150), fullName)
      .input("email", sql.NVarChar(255), email)
      .input("username", sql.NVarChar(100), username)
      .input("passwordHash", sql.NVarChar(255), passwordHash)
      .input("role", sql.NVarChar(50), role).query(`
        INSERT INTO Users (
          Id,
          FullName,
          Email,
          Username,
          PasswordHash,
          Role
        )
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.FullName AS fullName,
          INSERTED.Email AS email,
          INSERTED.Username AS username,
          INSERTED.Role AS role
        VALUES (
          @id,
          @fullName,
          @email,
          @username,
          @passwordHash,
          @role
        )
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("POST /users:", error);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        success: false,
        message: "A user with the same unique information already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create user.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/users/:id
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {
  try {
    const { fullName, email, username, role } = req.body;

    if (!fullName || !email || !username || !role) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, username, and role are required.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id)
      .input("fullName", sql.NVarChar(150), fullName)
      .input("email", sql.NVarChar(255), email)
      .input("username", sql.NVarChar(100), username)
      .input("role", sql.NVarChar(50), role).query(`
        UPDATE Users
        SET
          FullName = @fullName,
          Email = @email,
          Username = @username,
          Role = @role
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.FullName AS fullName,
          INSERTED.Email AS email,
          INSERTED.Username AS username,
          INSERTED.Role AS role
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("PUT /users/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /api/users/:id
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        DELETE FROM Users
        OUTPUT DELETED.Id AS id
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully.",
      id: result.recordset[0].id,
    });
  } catch (error) {
    console.error("DELETE /users/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
});

module.exports = router;
