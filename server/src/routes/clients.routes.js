const express = require("express");
const { sql, getPool } = require("../config/database");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET /api/clients
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        Id AS id,
        FullName AS fullName,
        ContactNumber AS contactNumber,
        Email AS email,
        Address AS address
      FROM Clients
      ORDER BY FullName ASC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("GET /clients:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve clients.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/clients/:id
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
          ContactNumber AS contactNumber,
          Email AS email,
          Address AS address
        FROM Clients
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("GET /clients/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve client.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/clients
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const { fullName, contactNumber, email, address } = req.body;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    const pool = await getPool();

    const id = `cli-${Date.now()}`;

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), id)
      .input("fullName", sql.NVarChar(150), fullName)
      .input("contactNumber", sql.NVarChar(50), contactNumber || null)
      .input("email", sql.NVarChar(255), email || null)
      .input("address", sql.NVarChar(255), address || null).query(`
        INSERT INTO Clients (
          Id,
          FullName,
          ContactNumber,
          Email,
          Address
        )
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.FullName AS fullName,
          INSERTED.ContactNumber AS contactNumber,
          INSERTED.Email AS email,
          INSERTED.Address AS address
        VALUES (
          @id,
          @fullName,
          @contactNumber,
          @email,
          @address
        )
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("POST /clients:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create client.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/clients/:id
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {
  try {
    const { fullName, contactNumber, email, address } = req.body;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id)
      .input("fullName", sql.NVarChar(150), fullName)
      .input("contactNumber", sql.NVarChar(50), contactNumber || null)
      .input("email", sql.NVarChar(255), email || null)
      .input("address", sql.NVarChar(255), address || null).query(`
        UPDATE Clients
        SET
          FullName = @fullName,
          ContactNumber = @contactNumber,
          Email = @email,
          Address = @address
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.FullName AS fullName,
          INSERTED.ContactNumber AS contactNumber,
          INSERTED.Email AS email,
          INSERTED.Address AS address
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("PUT /clients/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update client.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /api/clients/:id
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        DELETE FROM Clients
        OUTPUT DELETED.Id AS id
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully.",
      id: result.recordset[0].id,
    });
  } catch (error) {
    console.error("DELETE /clients/:id:", error);

    if (error.number === 547) {
      return res.status(409).json({
        success: false,
        message:
          "This client cannot be deleted because they are associated with existing projects.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete client.",
    });
  }
});

module.exports = router;
