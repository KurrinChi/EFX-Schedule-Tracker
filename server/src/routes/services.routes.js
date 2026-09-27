const express = require("express");
const { sql, getPool } = require("../config/database");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET /api/services
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        Id AS id,
        Name AS name,
        Description AS description,
        Price AS price
      FROM Services
      ORDER BY Name ASC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("GET /services:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve services.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/services/:id
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
          Name AS name,
          Description AS description,
          Price AS price
        FROM Services
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("GET /services/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve service.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/services
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service name is required.",
      });
    }

    if (price === undefined || price === null || Number.isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: "A valid service price is required.",
      });
    }

    const pool = await getPool();

    const id = `svc-${Date.now()}`;

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), id)
      .input("name", sql.NVarChar(150), name)
      .input("description", sql.NVarChar(500), description || null)
      .input("price", sql.Decimal(12, 2), Number(price)).query(`
        INSERT INTO Services (
          Id,
          Name,
          Description,
          Price
        )
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Name AS name,
          INSERTED.Description AS description,
          INSERTED.Price AS price
        VALUES (
          @id,
          @name,
          @description,
          @price
        )
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("POST /services:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create service.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/services/:id
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service name is required.",
      });
    }

    if (price === undefined || price === null || Number.isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: "A valid service price is required.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id)
      .input("name", sql.NVarChar(150), name)
      .input("description", sql.NVarChar(500), description || null)
      .input("price", sql.Decimal(12, 2), Number(price)).query(`
        UPDATE Services
        SET
          Name = @name,
          Description = @description,
          Price = @price
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Name AS name,
          INSERTED.Description AS description,
          INSERTED.Price AS price
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("PUT /services/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update service.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /api/services/:id
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        DELETE FROM Services
        OUTPUT DELETED.Id AS id
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully.",
      id: result.recordset[0].id,
    });
  } catch (error) {
    console.error("DELETE /services/:id:", error);

    if (error.number === 547) {
      return res.status(409).json({
        success: false,
        message:
          "This service cannot be deleted because it is associated with existing projects.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    });
  }
});

module.exports = router;
