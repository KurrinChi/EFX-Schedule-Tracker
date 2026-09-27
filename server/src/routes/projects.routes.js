const express = require("express");
const { sql, getPool } = require("../config/database");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatTime = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    return value.substring(0, 5);
  }

  if (value instanceof Date) {
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  return value;
};

const formatDate = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    return value.substring(0, 10);
  }

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return value;
};

const mapProject = (project) => ({
  id: project.id,
  clientId: project.clientId,
  clientName: project.clientName,
  packageId: project.packageId,
  packageName: project.packageName,
  serviceId: project.serviceId,
  serviceName: project.serviceName,
  projectType: project.projectType,
  eventDate: formatDate(project.eventDate),
  startTime: formatTime(project.startTime),
  endTime: formatTime(project.endTime),
  location: project.location,
  status: project.status,
  paymentStatus: project.paymentStatus,
  notes: project.notes,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

/*
|--------------------------------------------------------------------------
| GET /api/projects
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        p.Id AS id,

        p.ClientId AS clientId,
        c.FullName AS clientName,

        p.PackageId AS packageId,
        pkg.Name AS packageName,

        p.ServiceId AS serviceId,
        s.Name AS serviceName,

        p.ProjectType AS projectType,
        p.EventDate AS eventDate,
        p.StartTime AS startTime,
        p.EndTime AS endTime,
        p.Location AS location,
        p.Status AS status,
        p.PaymentStatus AS paymentStatus,
        p.Notes AS notes,
        p.CreatedAt AS createdAt,
        p.UpdatedAt AS updatedAt

      FROM Projects p

      INNER JOIN Clients c
        ON p.ClientId = c.Id

      INNER JOIN Packages pkg
        ON p.PackageId = pkg.Id

      INNER JOIN Services s
        ON p.ServiceId = s.Id

      ORDER BY
        p.EventDate ASC,
        p.StartTime ASC
    `);

    res.json(result.recordset.map(mapProject));
  } catch (error) {
    console.error("GET /projects:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/projects/:id
|--------------------------------------------------------------------------
*/

router.get("/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        SELECT
          p.Id AS id,

          p.ClientId AS clientId,
          c.FullName AS clientName,

          p.PackageId AS packageId,
          pkg.Name AS packageName,

          p.ServiceId AS serviceId,
          s.Name AS serviceName,

          p.ProjectType AS projectType,
          p.EventDate AS eventDate,
          p.StartTime AS startTime,
          p.EndTime AS endTime,
          p.Location AS location,
          p.Status AS status,
          p.PaymentStatus AS paymentStatus,
          p.Notes AS notes,
          p.CreatedAt AS createdAt,
          p.UpdatedAt AS updatedAt

        FROM Projects p

        INNER JOIN Clients c
          ON p.ClientId = c.Id

        INNER JOIN Packages pkg
          ON p.PackageId = pkg.Id

        INNER JOIN Services s
          ON p.ServiceId = s.Id

        WHERE p.Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.json(mapProject(result.recordset[0]));
  } catch (error) {
    console.error("GET /projects/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve project.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/projects
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const {
      clientId,
      packageId,
      serviceId,
      projectType,
      eventDate,
      startTime,
      endTime,
      location,
      status = "Upcoming",
      paymentStatus = "Pending",
      notes,
    } = req.body;

    if (
      !clientId ||
      !packageId ||
      !serviceId ||
      !projectType ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Client, package, service, project type, event date, start time, end time, and location are required.",
      });
    }

    const allowedProjectTypes = ["Wedding", "Portrait", "Commercial", "Event"];

    const allowedStatuses = [
      "Upcoming",
      "Confirmed",
      "In Progress",
      "Completed",
    ];

    const allowedPaymentStatuses = ["Paid", "Pending"];

    if (!allowedProjectTypes.includes(projectType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project type.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
      });
    }

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
      });
    }

    const pool = await getPool();

    const id = `prj-${Date.now()}`;

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), id)
      .input("clientId", sql.NVarChar(50), clientId)
      .input("packageId", sql.NVarChar(50), packageId)
      .input("serviceId", sql.NVarChar(50), serviceId)
      .input("projectType", sql.NVarChar(50), projectType)
      .input("eventDate", sql.Date, eventDate)
      .input("startTime", sql.VarChar(5), startTime)
      .input("endTime", sql.VarChar(5), endTime)
      .input("location", sql.NVarChar(255), location)
      .input("status", sql.NVarChar(50), status)
      .input("paymentStatus", sql.NVarChar(50), paymentStatus)
      .input("notes", sql.NVarChar(1000), notes || null).query(`
        INSERT INTO Projects (
          Id,
          ClientId,
          PackageId,
          ServiceId,
          ProjectType,
          EventDate,
          StartTime,
          EndTime,
          Location,
          Status,
          PaymentStatus,
          Notes,
          CreatedAt,
          UpdatedAt
        )
        VALUES (
          @id,
          @clientId,
          @packageId,
          @serviceId,
          @projectType,
          @eventDate,
          CAST(@startTime AS TIME),
          CAST(@endTime AS TIME),
          @location,
          @status,
          @paymentStatus,
          @notes,
          GETDATE(),
          GETDATE()
        )
      `);

    const created = await pool.request().input("id", sql.NVarChar(50), id)
      .query(`
        SELECT
          p.Id AS id,

          p.ClientId AS clientId,
          c.FullName AS clientName,

          p.PackageId AS packageId,
          pkg.Name AS packageName,

          p.ServiceId AS serviceId,
          s.Name AS serviceName,

          p.ProjectType AS projectType,
          p.EventDate AS eventDate,
          p.StartTime AS startTime,
          p.EndTime AS endTime,
          p.Location AS location,
          p.Status AS status,
          p.PaymentStatus AS paymentStatus,
          p.Notes AS notes,
          p.CreatedAt AS createdAt,
          p.UpdatedAt AS updatedAt

        FROM Projects p

        INNER JOIN Clients c
          ON p.ClientId = c.Id

        INNER JOIN Packages pkg
          ON p.PackageId = pkg.Id

        INNER JOIN Services s
          ON p.ServiceId = s.Id

        WHERE p.Id = @id
      `);

    if (created.recordset.length === 0) {
      return res.status(201).json({
        success: true,
        message: "Project created successfully.",
      });
    }

    res.status(201).json(mapProject(created.recordset[0]));
  } catch (error) {
    console.error("POST /projects:", error);

    if (error.number === 547) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid client, package, or service. Please select existing records.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/projects/:id
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {
  try {
    const {
      clientId,
      packageId,
      serviceId,
      projectType,
      eventDate,
      startTime,
      endTime,
      location,
      status,
      paymentStatus,
      notes,
    } = req.body;

    if (
      !clientId ||
      !packageId ||
      !serviceId ||
      !projectType ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !location ||
      !status ||
      !paymentStatus
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Client, package, service, project type, event date, start time, end time, location, status, and payment status are required.",
      });
    }

    const allowedProjectTypes = ["Wedding", "Portrait", "Commercial", "Event"];

    const allowedStatuses = [
      "Upcoming",
      "Confirmed",
      "In Progress",
      "Completed",
    ];

    const allowedPaymentStatuses = ["Paid", "Pending"];

    if (!allowedProjectTypes.includes(projectType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project type.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
      });
    }

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id)
      .input("clientId", sql.NVarChar(50), clientId)
      .input("packageId", sql.NVarChar(50), packageId)
      .input("serviceId", sql.NVarChar(50), serviceId)
      .input("projectType", sql.NVarChar(50), projectType)
      .input("eventDate", sql.Date, eventDate)
      .input("startTime", sql.VarChar(5), startTime)
      .input("endTime", sql.VarChar(5), endTime)
      .input("location", sql.NVarChar(255), location)
      .input("status", sql.NVarChar(50), status)
      .input("paymentStatus", sql.NVarChar(50), paymentStatus)
      .input("notes", sql.NVarChar(1000), notes || null).query(`
        UPDATE Projects
        SET
          ClientId = @clientId,
          PackageId = @packageId,
          ServiceId = @serviceId,
          ProjectType = @projectType,
          EventDate = @eventDate,
          StartTime = CAST(@startTime AS TIME),
          EndTime = CAST(@endTime AS TIME),
          Location = @location,
          Status = @status,
          PaymentStatus = @paymentStatus,
          Notes = @notes,
          UpdatedAt = GETDATE()
        WHERE Id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const updated = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        SELECT
          p.Id AS id,

          p.ClientId AS clientId,
          c.FullName AS clientName,

          p.PackageId AS packageId,
          pkg.Name AS packageName,

          p.ServiceId AS serviceId,
          s.Name AS serviceName,

          p.ProjectType AS projectType,
          p.EventDate AS eventDate,
          p.StartTime AS startTime,
          p.EndTime AS endTime,
          p.Location AS location,
          p.Status AS status,
          p.PaymentStatus AS paymentStatus,
          p.Notes AS notes,
          p.CreatedAt AS createdAt,
          p.UpdatedAt AS updatedAt

        FROM Projects p

        INNER JOIN Clients c
          ON p.ClientId = c.Id

        INNER JOIN Packages pkg
          ON p.PackageId = pkg.Id

        INNER JOIN Services s
          ON p.ServiceId = s.Id

        WHERE p.Id = @id
      `);

    if (updated.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found after update.",
      });
    }

    res.json(mapProject(updated.recordset[0]));
  } catch (error) {
    console.error("PUT /projects/:id:", error);

    if (error.number === 547) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid client, package, or service. Please select existing records.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /api/projects/:id
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.NVarChar(50), req.params.id).query(`
        DELETE FROM Projects
        OUTPUT DELETED.Id AS id
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully.",
      id: result.recordset[0].id,
    });
  } catch (error) {
    console.error("DELETE /projects/:id:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
});

module.exports = router;
