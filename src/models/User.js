const { DataTypes } = require("sequelize");
const initializeDatabase = require("../config/db"); // Import the async database initialization function

async function getUserModel() {
  const sequelize = await initializeDatabase(); // Ensure the sequelize instance is available

  // Define the User model
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
  );

  return User;
}

module.exports = getUserModel;
