const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbName = process.env.MYSQL_DATABASE;
const dbUser = process.env.MYSQL_USER;
const dbPass = process.env.MYSQL_PASSWORD;
const dbHost = process.env.MYSQL_HOST;
const dbPort = process.env.MYSQL_PORT;

async function initializeDatabase() {
  try {
    console.log("⏳ Connecting to MySQL server...");

    // 1️⃣ Create a connection **without specifying the database**
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPass,
      port: dbPort,
    });

    console.log("✅ MySQL connection established.");

    // 2️⃣ Create the database if it does not exist
    const result = await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    if (result.warningCount === 0) {
      console.log(`✅ Database '${dbName}' created successfully.`);
    } else {
      console.log(`✅ Database '${dbName}' already exists.`);
    }

    await connection.end();

    // 3️⃣ Initialize Sequelize **AFTER database creation**
    const sequelize = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      dialect: "mysql",
      port: dbPort,
      logging: false, // Disable logs for cleaner output
    });

    await sequelize.authenticate();
    console.log("✅ Sequelize initialized.");
    return sequelize; // ✅ Return Sequelize instance
  } catch (err) {
    console.error(`❌ Error initializing database: ${err.message}`);
    process.exit(1);
  }
}

// ✅ Export a function that resolves to a Sequelize instance
module.exports = initializeDatabase;
