const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  server: process.env.DB_SERVER || "localhost",
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || "EFXTrackerDB",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

console.log("SQL Server configuration:");
console.log({
  server: dbConfig.server,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password ? "********" : "(missing)",
});

let poolPromise = null;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig).catch((error) => {
      poolPromise = null;
      throw error;
    });
  }

  return poolPromise;
};

const testDatabaseConnection = async () => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .query("SELECT DB_NAME() AS DatabaseName");

    console.log("SQL Server connected successfully.");
    console.log(`Database: ${result.recordset[0].DatabaseName}`);

    return true;
  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error("SQL SERVER CONNECTION FAILED");
    console.error("========================================");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("========================================");
    console.error("");

    poolPromise = null;

    throw error;
  }
};

const ensureUserAuthSchema = async () => {
  try {
    const pool = await getPool();

    const tableExistsResult = await pool.request().query(`
      SELECT OBJECT_ID(N'dbo.Users', N'U') AS objectId;
    `);

    if (!tableExistsResult.recordset[0]?.objectId) {
      throw new Error(
        "dbo.Users does not exist in the configured database. Run database/schema.sql with a database owner account.",
      );
    }

    const currentColumns = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Users'
    `);

    const passwordHashColumn = currentColumns.recordset.find(
      (row) => row.COLUMN_NAME === "PasswordHash",
    );

    if (
      !passwordHashColumn ||
      passwordHashColumn.DATA_TYPE !== "nvarchar" ||
      passwordHashColumn.CHARACTER_MAXIMUM_LENGTH !== 255
    ) {
      throw new Error(
        "dbo.Users.PasswordHash must be NVARCHAR(255). Run database/schema.sql with a database owner account.",
      );
    }

    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Id = N'usr-001')
      BEGIN
        INSERT INTO dbo.Users
          (Id, FullName, Email, Username, PasswordHash, Role)
        VALUES
          (N'usr-001', N'Alex Morgan', N'admin@efxcreations.test', N'alex.morgan', NULL, N'Admin');
      END
      ELSE
      BEGIN
        UPDATE dbo.Users
        SET FullName = N'Alex Morgan',
            Email = N'admin@efxcreations.test',
            Username = N'alex.morgan',
            Role = N'Admin'
        WHERE Id = N'usr-001';
      END
    `);

    return true;
  } catch (error) {
    console.error("Failed to ensure user auth schema:", error.message);
    throw error;
  }
};

module.exports = {
  sql,
  getPool,
  testDatabaseConnection,
  ensureUserAuthSchema,
};
