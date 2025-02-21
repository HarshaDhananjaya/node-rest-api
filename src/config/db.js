const { Sequelize } = require("sequelize");
require("dotenv").config();

const schemaName = process.env.SCHEMA_NAME;

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE, // 👈 Include database name
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: console.log, // Enable logs for debugging
  }
);

sequelize
  .query("CREATE DATABASE IF NOT EXISTS mydb")
  .then(() => {
    console.log("Database created successfully!");
  })
  .catch((err) => {
    console.error("Error creating database:", err);
  });

// Connect to MySQL
sequelize
  .authenticate()
  .then(() => console.log("✅ MySQL Connected..."))
  .catch((err) => console.error("❌ MySQL Connection Failed:", err));

module.exports = sequelize;
