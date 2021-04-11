const dbConnection = require('../database/db');
const jwt = require('jsonwebtoken');

exports.getUser = async (req, res) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.split(' ')[1];

    const payload = jwt.decode(token);

     if(!payload) {
      res.status(401).send({
        OK: 0,
        status: 401,
        message: 'Invalid token',
      });
     } else {
       const user = JSON.stringify(payload.idUser);

       let sql =
        'SELECT nombre, apellidos, foto FROM profile  WHERE idUsuario = ' +
        user;

        const doQuery = (query) => {
          return new Promise((resolve, reject) => {
            dbConnection.query(query, (error, results) => {
              if (error) return reject(error);
              console.log('Consulta correcta');
              return resolve(results);
            });
          });
        };

        const results = await doQuery(sql);

        const doStuffWithResults = (resultados) => {
        
          res.send({
            OK: 1,
            message: 'User profile retrieved',
            nombre: resultados[0].nombre,
            apellidos: resultados[0].apellidos,
            foto: resultados[0].foto
          });

        };
        
        doStuffWithResults(results);
    }
  } else {
    res.status(401).send({
      OK: 0,
      message: 'Token requerido',
    });
  }
};

exports.updateUser = async (req, res) => {
  const authorization = req.headers.authorization;
  const nombre = req.body.nombre;
  const apellidos = req.body.apellidos;
  const foto = req.body.foto;

  if (authorization) {
    const token = authorization.split(' ')[1];

    const payload = jwt.decode(token);

    if (!payload) {
      res.status(401).send({
        OK: 0,
        status: 401,
        message: 'Invalid token',
      });
    } else {
      const user = JSON.stringify(payload.idUser);
      
        let sql =
        `UPDATE profile SET nombre = "${nombre}", apellidos = "${apellidos}", foto = "${foto}" WHERE idUsuario = ${user}`;

      const doQuery = (query) => {
        return new Promise((resolve, reject) => {
          dbConnection.query(query, (error, results) => {
            if (error) return reject(error);
            console.log('Consulta correcta');
            return resolve(results);
          });
        });
      };

      const results = await doQuery(sql);

      const doStuffWithResults = (resultados) => {
      
        res.send({
          OK: 1,
          message: 'Profile updated'
        });

      };
      
      doStuffWithResults(results);
    }

  }
  else {
    res.status(401).send({
      OK: 0,
      message: 'Token requerido',
    });
  }
}

exports.deleteUser = () => {};