const { exec } = require("child_process");

async function runMigrations() {
  try {
    console.log("⏳ Running migrations...");

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

      // Run seed after migration
      exec("npx sequelize db:seed:all", (seedError, seedStdout, seedStderr) => {
        if (seedError) {
          console.error(`❌ Seed error: ${seedError.message}`);
          process.exit(1);
        }
        if (seedStderr) console.error(`⚠️ Seed stderr: ${seedStderr}`);
        console.log(`✅ Seed output: \n${seedStdout}`);
      });
    });
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    process.exit(1);
  }
}

// Run migrations
module.exports = runMigrations;
