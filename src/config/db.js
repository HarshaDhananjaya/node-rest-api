const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbName = process.env.MYSQL_DATABASE;
const dbUser = process.env.MYSQL_USER;
const dbPass = process.env.MYSQL_PASSWORD;
const dbHost = process.env.MYSQL_HOST;
const dbPort = process.env.MYSQL_PORT;

async function ensureDatabaseExists() {
  try {
    console.log("⏳ Checking database existence...");

    // Create a connection **without specifying the database**
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPass,
      port: dbPort,
    });

    // Create the database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database '${dbName}' is ready.`);

    await connection.end();
  } catch (error) {
    console.error(`❌ Error ensuring database exists: ${error.message}`);
    process.exit(1);
  }
}

// Initialize Sequelize AFTER ensuring the database exists
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "mysql",
  port: dbPort,
  logging: false,
});

// Function to connect to the database
async function connectDatabase() {
  await ensureDatabaseExists(); // ✅ Ensure DB exists first
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDatabase };
