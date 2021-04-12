const jwt = require('jsonwebtoken');
const { doQuery } = require('../utilities/mysql');

exports.getUser = async (req, res) => {
  const user = res.user.idUser;

  let sql =
    'SELECT nombre, apellidos, foto FROM profile  WHERE idUsuario = ' + user;

  const results = await doQuery(sql);
  console.log(results);

  const doStuffWithResults = (resultados) => {
    res.send({
      OK: 1,
      message: 'User profile retrieved',
      nombre: resultados[0].nombre,
      apellidos: resultados[0].apellidos,
      foto: resultados[0].foto,
    });
  };

  doStuffWithResults(results);
};

exports.updateUser = async (req, res) => {
  const nombre = req.body.nombre;
  const apellidos = req.body.apellidos;
  const foto = req.body.foto;

  const user = JSON.stringify(res.user.idUser);

  let sql = `UPDATE profile SET nombre = "${nombre}", apellidos = "${apellidos}", foto = "${foto}" WHERE idUsuario = ${user}`;

  const results = await doQuery(sql);

  const doStuffWithResults = (resultados) => {
    res.send({
      OK: 1,
      message: 'Profile updated',
    });
  };

  doStuffWithResults(results);
};

exports.deleteUser = () => {};
