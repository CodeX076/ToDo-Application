const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // 👉 change if your MySQL user is different
  password: "Amit@7462",  // 👉 use your MySQL root password
  database: "todo_app"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

module.exports = db;
