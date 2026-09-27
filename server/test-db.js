const { testDatabaseConnection } = require("./src/config/database");

testDatabaseConnection()
  .then(() => {
    console.log("Database test completed successfully.");
    process.exit(0);
  })
  .catch(() => {
    console.error("Database test failed.");
    process.exit(1);
  });
