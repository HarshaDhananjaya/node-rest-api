const { Sequelize, DataTypes } = require("sequelize");
const initializeDatabase = require("../config/db"); // Import DB setup

async function initializeModels() {
  const sequelize = await initializeDatabase(); // Initialize Sequelize

  const User = require("./User")(sequelize, DataTypes); // Load User model

  await sequelize.sync(); // Ensure DB is in sync

  return { sequelize, User }; // Export models
}

module.exports = initializeModels;
