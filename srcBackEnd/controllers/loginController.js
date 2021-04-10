const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { nanoid } = require('nanoid');
const { google } = require('googleapis');
const dbConnection = require('../database/db');

const doQuery = (query) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

//-------------------------------------------------

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
      message: 'password must be at least 1 lowercase character',
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

exports.signUp = async (req, res) => {
  const email = req.body.email;
  let pass = req.body.pass;

  //Validamos los campos user y password
  if (isValidUserPass(email, pass, res)) {
    //generamos una clave secreta para el JWT del usuario
    const secret = nanoid(10);
    pass = md5(pass);
    try {
      let sql = `SELECT email FROM acceso_Nativo WHERE email = "${email}"`;

      let response = await doQuery(sql);

      if (response.length !== 0) {
        res.status(409).send({
          OK: 0,
          status: 409,
          message: 'El usuario ya está registrado',
        });
      } else {
        sql = `INSERT INTO usuario (secreto) VALUES ("${secret}")`;
        response = await doQuery(sql);

        sql = `INSERT INTO accesos (idUsuario, tipoAcceso) VALUES (${response.insertId}, 0)`;
        response = await doQuery(sql);

        sql = `INSERT INTO acceso_Nativo (email, pass, idAcceso) VALUES ("${email}", "${pass}", ${response.insertId})`;
        response = await doQuery(sql);

        res.send({
          OK: 1,
          message: 'Usuario creado',
          usuario: response.insertId,
        });
      }
    } catch (error) {
      res.status(500).send({
        OK: 0,
        message: `ERROR en base de datos: ${error}`,
      });
    }
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const pass = md5(req.body.pass);
  //SELECT que nos lleva hasta la tabla usuario
  //para obtener el campo id (que es el que guardamos en el JWT de autenticación)
  //y el campo secret (que necesitamos para hacer el JWT)

  let sql = `SELECT u.id, u.secreto
              FROM usuario u
                JOIN accesos a ON u.id = a.idUsuario
                JOIN acceso_Nativo an ON a.id = an.idAcceso
              WHERE an.email = "${email}" AND an.pass = "${pass}"`;

  const response = await doQuery(sql);

  if (response.length !== 0) {
    const payload = { email, idUser: response[0].id };
    const options = { expiresIn: '10m' };
    const token = jwt.sign(payload, response[0].secreto, options);
    res.send({
      OK: 1,
      message: 'Acceso permitido.',
      token,
    });
  } else {
    res.status(401).send({
      OK: 0,
      error: 401,
      message: 'Usuario/contraseña inválidos.',
    });
  }
};

exports.logout = async (req, res) => {
  const authorization = req.headers.authorization;

  const token = authorization.split(' ')[1];

  const idUser = jwt.decode(token).idUser;

  //ESTA SQL DEBE MIRAR SI EXISTE EL USUARIO CON ID idUser
  let sql = `SELECT * FROM usuario WHERE id = ${idUser}`;
  let response = await doQuery(sql);
  console.log('SELECT:', response);

  if (response.length !== 0) {
    const secret = response[0].secreto;

    try {
      jwt.verify(token, secret);
      try {
        const newSecret = nanoid(10);
        // ESTA SQL ACTUALIZA EL SECRETO (con un nuevo valor)
        sql = `UPDATE usuario SET secreto = "${newSecret}" WHERE id = ${idUser}`;
        response = await doQuery(sql);
        console.log('UPDATE:', response);
        res.send({
          OK: 1,
          message: 'User Disconnected',
        });
      } catch (error) {
        res.status(500).send({
          OK: 0,
          error: 500,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(401).send({
        OK: 0,
        error: 401,
        message: error.message,
      });
    }
  }
};

exports.authUser = async (req, res, next) => {
  const authorization = req.headers.authorization;

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

      let sql = `SELECT * FROM usuario WHERE id = ${user}`;

      const response = await doQuery(sql);

      if (response) {
        const secret = response[0].secreto;

        try {
          jwt.verify(token, secreto);
          next();
        } catch (error) {
          res.status(401).send({
            OK: 0,
            error: 401,
            message: `Token inválido: ${error.message}`,
          });
        }
      } else {
        res.status(401).send({
          OK: 0,
          error: 401,
          message: 'Usuario desconocido / token incorrecto',
        });
      }
    }
  } else {
    res.status(401).send({
      OK: 0,
      error: 401,
      message: 'Token requerido',
    });
  }
};

exports.googleOAuth = async (req, res) => {
  const code = req.query.code;

  const GOOGLE_SECRET = process.env.GOOGLE_AUTH_SECRET;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;

  console.log(GOOGLE_SECRET);

  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_SECRET,
    redirectUri: process.env.GOOGLE_AUTH_REDIRECT_URI,
  });

  const { tokens } = await oauth2Client.getToken(code);

  console.log(tokens);

  const token = tokens.id_token;

  try {
    let ticket;
    try {
      ticket = await oauth2Client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      throw {
        status: 401,
        message: `Invalid google token: ${error}`,
      };
    }
    console.log(ticket.payload);
    const user = ticket.payload.email;
    const verifiedUser = ticket.payload.email_verified;
    // name y picture creo que aquí no tiene sentido recogerlos
    // debería ser para cuando haga el SIGNIN con GOOGLE
    const name = ticket.payload.name;
    const picture = ticket.payload.picture;
    console.log(user, verifiedUser);
    if (user && verifiedUser) {
      //TODO: Falta SQL
      //tenemos el email de google hay que buscarlo en nuestra base de datos
      //tenemos que encontrar el id de la tabla usuario para un gmail de la tabla u_mail
      //también necesitamos el campo secreto de la tabla usuario
      try {
        const sql = `SELECT * FROM usuario WHERE gmail = "${user}"`; //MODIFICAR
        const result = await doQuery(sql);
        console.log('RESULT', result);
        if (result) {
          //aquí meter el valor de secreto e id
          const secreto = result.secreto;
          const idUser = result.id;
          console.log('USUARIO OAUTH LOGEADO');
          const payload = { id: idUser };
          const options = { expiresIn: '1d' };
          const token = jwt.sign(payload, secreto, options);
          console.log('NEWTOKEN', token);
          //TODO: definir donde hacemos al final la redirección a front
          res.redirect('http://localhost:8080/test/?token=' + token);
          /* res.send({
            OK: 1,
            status: 200,
            message: 'Authorized user',
            token,
          }); */
        } else {
          //el usuario no está en la base de datos
          throw {
            status: 401,
            message: 'google account is not a valid user',
          };
        }
      } catch (error) {
        throw {
          status: error.status,
          message: `Error: ${error.message}`,
        };
      }
    } else {
      //no ha venido nada en el correo electrónico o el correo no está verificado
      throw {
        status: 401,
        message: 'Invalid google account',
      };
    }
  } catch (error) {
    console.log('ERROR', error);
    res.status(error.status).send({
      OK: 0,
      status: error.status,
      message: error.message,
    });
  }
};

function getGoogleAuthURL() {
  /*
   * Generate a url that asks permissions to the user's email and profile
   */
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_SECRET,
    redirectUri: process.env.GOOGLE_AUTH_REDIRECT_URI,
  });
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes, // If you only need one scope you can pass it as string
  });
}

exports.googleLink = (req, res) => {
  try {
    const respuesta = getGoogleAuthURL();
    res.status(200).send({
      OK: 1,
      message: 'google link creado',
      link: respuesta,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.NewPass = (req, res) => {};

exports.changePass = (req, res) => {};
