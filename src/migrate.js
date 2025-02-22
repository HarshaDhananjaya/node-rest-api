require("dotenv").config();
const sequelize = require("./config/db"); // Sequelize instance
const User = require("./models/User"); // Import the User model

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    // Sync model to create the table in the database
    await User.sync(); // Sequelize will create the Users table based on the model

    console.log("✅ Table created successfully.");
  } catch (error) {
    console.error("❌ Error during migration:", error);
  }
}

runMigration();
