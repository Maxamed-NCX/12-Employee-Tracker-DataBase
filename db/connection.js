require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mncx22..",
  database: "employees_db",
});

db.connect((err) => {
  if (err) throw err;
});

module.exports = db;
