// 20250222010101-create-sequelize-seed-meta.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sequelizeSeedMeta", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true, // Ensure each seed file is only executed once
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("sequelizeSeedMeta");
  },
};
