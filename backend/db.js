const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// A function to initialize the database with tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Pool Connected...");

    // Create tables safely (only if not exists)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
    await connection.execute(createUsersTable);
    console.log("✅ Users table ready");

    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        status TINYINT(1) NOT NULL DEFAULT 0,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`;
    await connection.execute(createTasksTable);
    console.log("✅ Tasks table ready");

    connection.release(); // release the connection back to the pool
  } catch (err) {
    console.error("❌ Error initializing database:", err);
    // You might want to exit the application if the database fails to initialize
    process.exit(1); 
  }
}

// Call the initialization function on app startup
initializeDatabase();

module.exports = pool;