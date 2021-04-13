const { doQuery } = require('../utilities/mysql');

exports.getUser = async (req, res) => {
  const user = res.user.idUser;

  try {
    let sql =
      'SELECT nombre, apellidos, foto FROM profile  WHERE idUsuario = ' + user;

    const results = await doQuery(sql);
    const profile = {
      nombre: '',
      apellidos: '',
      foto: '',
    };
    if (results.length !== 0) {
      profile.nombre = results[0].nombre;
      profile.apellidos = results[0].apellidos;
      profile.foto = results[0].foto;
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
  const { nombre, apellidos, foto } = req.body;

  const idUser = res.user.idUser;


  //PRIMERO INTENTO HACER UN INSERT, SI DA ERROR ES QUE EL USUARIO ESTÁ YA CREADO Y ENTONCES HAY QUE HACER UN UPDATE
  let sql = `INSERT profile(nombre, apellidos, foto, idUsuario) VALUES("${nombre}", "${apellidos}", "${foto}", ${idUser})`;

  try {
    const results = await doQuery(sql);
    if (!results.affectedRows) {
      throw 'errpr'; // si no hay nada en affectedRows es que no se ha dado inserción, probamos update
    }
  } catch (error) {
    //HA FALLADO EL INSERT, POR LO QUE HACEMOS AHORA UN UPDATE
    try {
      const sql = `UPDATE profile SET nombre = "${nombre}", apellidos = "${apellidos}", foto = "${foto}" 
             WHERE idUsuario = ${idUser}`;
      const results = await doQuery(sql);
      if (!results.affectedRows) {
        throw 'No se ha actualizado el perfil';
      }
      res.send({
        OK: 1,
        message: 'Perfil actualizado',
      });
    } catch {

      //no se ha podido actualizar perfil de ninguna de las dos maneras (insert o update)
      res.status(500).send({
        OK: 0,
        message: 'No se ha podido actualizar perfil',
      });
    }
  }
};
