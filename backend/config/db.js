// config/db.js
// -------------------------------------------------
// Creates and exports a MySQL connection pool.
// A pool reuses connections instead of creating
// a new one for every query — more efficient.
// -------------------------------------------------

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  // queue requests when all connections are busy
  connectionLimit: 10,       // max 10 simultaneous connections
  queueLimit: 0              // unlimited queue
});

// .promise() lets us use async/await instead of callbacks
module.exports = pool.promise();
