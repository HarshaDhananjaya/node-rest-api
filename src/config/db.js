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

    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPass,
      port: dbPort,
    });

    console.log("✅ MySQL connection established.");

    // Create the database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database '${dbName}' ensured.`);

    await connection.end();

    // Initialize Sequelize after DB creation
    const sequelize = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      dialect: "mysql",
      port: dbPort,
      logging: false, // Disable logs for cleaner output
    });

    await sequelize.authenticate();
    console.log("✅ MySQL Connected...");

    return sequelize;
  } catch (err) {
    console.error(`❌ Error initializing database: ${err.message}`);
    process.exit(1);
  }
}

// Ensure the function runs and returns a Sequelize instance
const sequelizeInstance = initializeDatabase();
module.exports = sequelizeInstance;
