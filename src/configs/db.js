
require('dotenv').config()
const mysql      = require('mysql');
const dbConnection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : 'tiendadb'
});
 
dbConnection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + dbConnection.threadId);
});

module.exports = dbConnection;