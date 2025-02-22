const { Sequelize } = require("sequelize");
const initializeDatabase = require("./src/config/db");
const { exec } = require("child_process");

async function runMigrations() {
  try {
    const sequelize = await initializeDatabase;
    console.log("✅ Database connection established.");

    // Run Sequelize CLI migration
    exec("npx sequelize db:migrate", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Migration error: ${error.message}`);
        process.exit(1);
      }
      if (stderr) {
        console.error(`❌ Migration stderr: ${stderr}`);
      }
      console.log(`✅ Migration output: \n${stdout}`);
    });
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
