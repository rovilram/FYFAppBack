const jwt = require('jsonwebtoken');
const { doQuery } = require('../utilities/mysql');

exports.getUser = async (req, res) => {
  const user = res.user.idUser;

  try {
    let sql =
      'SELECT nombre, apellidos, foto FROM profile  WHERE idUsuario = ' + user;

    const results = await doQuery(sql);
    console.log(results);
    const profile = {
      nombre: '',
      apellidos: '',
      foto: '',
    };
    if (results.length !== 0) {
      profile.nombre = results[0].nombre;
      profile.apellidos = results[0].apellidos;
      profile.foto = results[0].apellidos;
    }

    res.send({
      OK: 1,
      message: 'User profile retrieved',
      nombre: profile.nombre,
      apellidos: profile.apellidos,
      foto: profile.foto,
    });
  } catch (error) {
    res.status(500).send({
      OK: 0,
      message: `Error profile retrieve: ${error}`,
    });
  }
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
