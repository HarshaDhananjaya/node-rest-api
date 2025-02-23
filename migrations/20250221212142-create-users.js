"use strict";

module.exports = {
  /**
   * Run the migration to create the Users table.
   *
   * @param {object} queryInterface - The interface for database operations.
   * @param {object} Sequelize - The Sequelize library.
   */
  up: async (queryInterface, Sequelize) => {
    // Create the Users table with the specified columns
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  /**
   * Reverse the migration to create the Users table.
   *
   * @param {object} queryInterface - The interface for database operations.
   * @param {object} Sequelize - The Sequelize library.
   */
  down: async (queryInterface, Sequelize) => {
    // Drop the Users table
    await queryInterface.dropTable("Users");
  },
};
