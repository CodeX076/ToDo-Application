const mysql = require("mysql2");
require("dotenv").config();

// ✅ Use a connection pool instead of single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,  // free tier safe limit
  queueLimit: 0,
  connectTimeout: 20000 // prevent timeouts
});

// ✅ Keep connection alive to avoid idle disconnects
setInterval(() => {
  pool.query("SELECT 1", (err) => {
    if (err) console.error("Keep-alive error:", err);
  });
}, 60000); // ping every 60 seconds

// ✅ Create tables if they do not exist
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

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

  connection.query(createUsersTable, (err) => {
    if (err) console.error("❌ Error creating users table:", err);
    else console.log("✅ Users table ready");
  });

  connection.query(createTasksTable, (err) => {
    if (err) console.error("❌ Error creating tasks table:", err);
    else console.log("✅ Tasks table ready");
  });

  connection.release();
});

module.exports = pool;
