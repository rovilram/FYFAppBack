const dbConnection = require('./db');

exports.doQuery = (query) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};
