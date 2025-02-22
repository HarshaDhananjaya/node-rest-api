module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seedName = "20250221212142-create-users"; // Unique name for this seed file

    // Check if this seed file has already been applied
    const seedRecord = await queryInterface.rawSelect("sequelizeSeedMeta", { where: { name: seedName } }, ["id"]);

    if (seedRecord) {
      console.log(`⚠️ Seed "${seedName}" has already been applied. Skipping...`);
      return; // If the seed is already applied, skip it
    }

    // Seed the Users table if the seed file hasn't been run
    await queryInterface.bulkInsert("Users", [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "hashedpassword456",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Record that this seed has been applied
    await queryInterface.bulkInsert("sequelizeSeedMeta", [
      {
        name: seedName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log(`✅ Seed "${seedName}" applied successfully.`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("sequelizeSeedMeta", { name: "20250221212142-create-users" });
  },
};
