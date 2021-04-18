const path = require("path");
const mysql      = require('mysql');
const { rootCertificates } = require("tls");
require('dotenv').config();
const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,

  database: 'fyfAppDB',
});
 
dbConnection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('DB connected as id ' + dbConnection.threadId);
});

module.exports = dbConnection;