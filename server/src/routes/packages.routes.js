const express = require("express");
const { sql, getPool } = require("../config/database");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET /api/packages
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
      FROM Packages
      ORDER BY Name ASC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("GET /packages:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve packages.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/packages/:id
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
        FROM Packages
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("GET /packages/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve package.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/packages
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Package name is required.",
      });
    }

    if (price === undefined || price === null || Number.isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: "A valid package price is required.",
      });
    }

    const pool = await getPool();

    const id = `pkg-${Date.now()}`;

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), id)
      .input("name", sql.NVarChar(150), name)
      .input("description", sql.NVarChar(500), description || null)
      .input("price", sql.Decimal(12, 2), Number(price)).query(`
        INSERT INTO Packages (
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
    console.error("POST /packages:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create package.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/packages/:id
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Package name is required.",
      });
    }

    if (price === undefined || price === null || Number.isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: "A valid package price is required.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id)
      .input("name", sql.NVarChar(150), name)
      .input("description", sql.NVarChar(500), description || null)
      .input("price", sql.Decimal(12, 2), Number(price)).query(`
        UPDATE Packages
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
        message: "Package not found.",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("PUT /packages/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update package.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /api/packages/:id
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        DELETE FROM Packages
        OUTPUT DELETED.Id AS id
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    res.json({
      success: true,
      message: "Package deleted successfully.",
      id: result.recordset[0].id,
    });
  } catch (error) {
    console.error("DELETE /packages/:id:", error);

    if (error.number === 547) {
      return res.status(409).json({
        success: false,
        message:
          "This package cannot be deleted because it is associated with existing projects.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete package.",
    });
  }
});

module.exports = router;
