const { nanoid } = require('nanoid');
const dbConnection = require('../../src/configs/db');
const jwt = require('jsonwebtoken');

exports.getUser = () => {

};

// exports.getUser = async (req, res) => {
//   if (req.headers.authorization) {
//     const authorization = req.headers.authorization;

//     const token = authorization.split(' ')[1];

//     const user = jwt.decode(token).user;

//     let sql =
//       'SELECT nombre, apellidos, foto FROM profile  WHERE idUsuario =' +
//       `${user}`;


// exports.getUser =async () => {
//     //aqui metemos el id del usuario que queremos
//    let usuarioBack=1;
  
//     let sql =('SELECT nombre, apellidos, foto FROM profile  WHERE idUsuario = '+`${usuarioBack}`)
    
//     const doQuery = (query) =>{
//         return new Promise((resolve, reject) => {
//             dbConnection.query(query, (error, results) => {
//                 if(error) return reject(error);
//                 console.log('Consulta correcta');
//                 return resolve(results);
//             });

    
//     const results = await doQuery(sql);
//     const doStuffWithResults = (resultados) => {
//       console.log(resultados[0].nombre);

//       // Aquí haces cosas con los resultados
//     };

//     // llamamos a nuestros métodos y le pasamos el resultado para realizar tareas
//     doStuffWithResults(results);
//   } else {
//     res.status(401).send({
//       OK: 0,
//       message: 'Token requerido',
//     });
//   }
// };

exports.updateUser = async (req, res) => {
  // **/user** _PATCH_ (TOKEN AUTH) Modifica alguno de los datos de perfil del usuario.

  const email = req.body.email;
  const nombre = req.body.nombre;
  const apellidos = req.body.apellidos;
  const foto = req.body.foto;

  //Validamos los campos user y password
  //if (isValidUserPass(user, password, res)) {
  //generamos una clave secreta para el JWT del usuario
  const secret = nanoid();

  if (nombre) {
    try {
      const response = await dbConnection.query(
        'UPDATE perfil SET nombre = ? WHERE id = ?',
        [nombre, 1],
      );
      res.send({
        OK: 1,
        message: 'Profile updated',
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).send({
          OK: 0,
          error: 409,
          message: error.message,
        });
      }
      res.status(500).send({
        OK: 0,
        error: 500,
        message: error.message,
      });
    }
  } else if (apellidos) {
    try {
      const response = await dbConnection.query(
        'UPDATE TABLE SET apellidos = ?',
        [apellidos],
      );
      res.send({
        OK: 1,
        message: 'Profile updated',
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).send({
          OK: 0,
          error: 409,
          message: error.message,
        });
      }
      res.status(500).send({
        OK: 0,
        error: 500,
        message: error.message,
      });
    }
  } else if (foto) {
    try {
      const response = await dbConnection.query('UPDATE TABLE SET foto = ?', [
        foto,
      ]);
      res.send({
        OK: 1,
        message: 'Profile updated',
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).send({
          OK: 0,
          error: 409,
          message: error.message,
        });
      }
      res.status(500).send({
        OK: 0,
        error: 500,
        message: error.message,
      });
    }
  }
  //}
};

const isValidUser = (user) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user);
};
const isValidPassword = (password) => {
  //Minimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial(@#$%&)
  const validLong = password.length > 7 ? true : false;
  const validMin = /[a-z]+/.test(password);
  const validMay = /[A-Z]+/.test(password);
  const validNum = /[0-9]+/.test(password);
  const validSpecial = /[@#$%&]+/.test(password);
  if (!validLong)
    return { OK: false, message: 'password must be at least 8 characters' };
  else if (!validMin)
    return {
      OK: false,
      message: 'password must be at least 1 lowecase character',
    };
  else if (!validMay)
    return {
      OK: false,
      message: 'password must be at least 1 uppercase character',
    };
  else if (!validNum)
    return { OK: false, message: 'password must be at least 1 number' };
  else if (!validSpecial)
    return {
      OK: false,
      message: 'password must be at least 1 special character (@#$%&)',
    };
  else return { OK: true };
};
const isValidUserPass = (user, password, res) => {
  if (!isValidUser(user)) {
    res.status(422).send({
      OK: 0,
      error: 422,
      message: `'user' is not a valid email`,
    });
    return false;
  }
  const boolPass = isValidPassword(password);
  if (!boolPass.OK) {
    res.status(422).send({
      OK: 0,
      error: 422,
      message: boolPass.message,
    });
    return false;
  }
  return true; //user & pass valid
};

exports.deleteUser = () => {};
