const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync({ force: false }).then(() => {
  // force: true will drop tables if they exist
  console.log("✅ Database synced");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
