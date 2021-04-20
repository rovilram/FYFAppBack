const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { nanoid } = require('nanoid');
const { google } = require('googleapis');
const { mailer } = require('../utilities/mailer');
const { doQuery } = require('../utilities/mysql');
const dbConnection = require('../utilities/db');

const isValidUser = (user) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user);
};

const isValidPassword = (password) => {
  //Minimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial(@#$%&)
  if (!password)
    return {
      OK: 0,
      message: 'password cannot be empty',
    };
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
      console.log('PRIMERA OK');
      if (response.length !== 0) {
        res.status(409).send({
          OK: 0,
          status: 409,
          message: 'El usuario ya está registrado',
        });
      } else {
        sql = `INSERT INTO usuario (secreto) VALUES ("${secret}")`;
        response = await doQuery(sql);

        console.log('SEGUNDA OK');
        console.log('PASS', pass);

        sql = `INSERT INTO accesos (idUsuario, tipoAcceso) VALUES (${response.insertId}, 0)`;
        response = await doQuery(sql);

        sql = `INSERT INTO acceso_Nativo (email, pass, idAcceso) VALUES ("${email}", "${pass.trim()}", ${
          response.insertId
        })`;
        response = await doQuery(sql);

        console.log('TERCERA OK');

        res.send({
          OK: 1,
          message: 'Usuario creado',
          usuario: response.insertId,
        });
      }
    } catch (error) {
      console.log(error);
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
    const payload = { idUser: response[0].id };
    const options = { expiresIn: '1d' };
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
  const { idUser } = res.user;
  try {
    const newSecret = nanoid(10);
    // ESTA SQL ACTUALIZA EL SECRETO (con un nuevo valor)
    const sql = `UPDATE usuario SET secreto = "${newSecret}" WHERE id = ${idUser}`;
    const response = await doQuery(sql);
    res.send({
      OK: 1,
      message: 'Usuario desconectado',
    });
  } catch (error) {
    res.status(500).send({
      OK: 0,
      error: 500,
      message: `Error en base de datos: error.message`,
    });
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
      const { idUser } = payload;
      let sql = `SELECT * FROM usuario WHERE id = ${idUser}`;
      const response = await doQuery(sql);

      if (response.length !== 0) {
        const { secreto } = response[0];

        try {
          jwt.verify(token, secreto);
          console.log('Usuario Autenticado', idUser);

          res.user = {
            idUser,
            secreto: secreto,
          };
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

const getOAuth2Client = (clientId, clientSecret, redirectUri) => {
  const oauth2Client = new google.auth.OAuth2({
    clientId,
    clientSecret,
    redirectUri,
  });

  return oauth2Client;
};

const newGoogleUser = async (user) => {
  // secreto nombre apellidos foto tipoAcceso gmail
  const { secreto, nombre, apellidos, foto, gmail } = user;
  let sql = `INSERT INTO usuario (secreto) VALUES ("${secreto}")`;
  console.log(sql);
  let respUsuario = await doQuery(sql);

  sql = `INSERT INTO profile (nombre, apellidos, foto, idUsuario)
         VALUES ("${nombre}", "${apellidos}", "${foto}", ${respUsuario.insertId})`;
  console.log(sql);

  let response = await doQuery(sql);

  sql = `INSERT INTO accesos (idUsuario, tipoAcceso) VALUES (${respUsuario.insertId}, 1)`;
  console.log(sql);

  response = await doQuery(sql);

  sql = `INSERT INTO acceso_Gmail (gmail, idAcceso) VALUES ("${gmail}", ${response.insertId})`;
  console.log(sql);

  response = await doQuery(sql);
  console.log('USUARIO CREADO', respUsuario.insertId);
  return respUsuario.insertId;
};

exports.googleOAuth = async (req, res) => {
  console.log('ACTION GOOGLE OAUTH', req.query.state);
  const action = req.query.state;
  let idUser;
  let secreto;
  const clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_AUTH_SECRET;
  const redirectUri = process.env.GOOGLE_AUTH_REDIRECT_URI;
  const code = req.query.code;
  const oauth2Client = getOAuth2Client(clientId, clientSecret, redirectUri);
  const { tokens } = await oauth2Client.getToken(code);

  //nos quedamos con el token que vamos a usar
  const token = tokens.id_token;

  try {
    let ticket;
    try {
      ticket = await oauth2Client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
    } catch (error) {
      throw {
        status: 401,
        message: `Invalid google token: ${error}`,
      };
    }
    const email = ticket.payload.email;
    const verifiedUser = ticket.payload.email_verified;

    //Si tenemos correo electrónico y el usuario está verificado por google
    if (email && verifiedUser) {
      //vemos si está en nuestra base de datos
      try {
        const sql = `SELECT u.id, u.secreto
              FROM usuario u
                JOIN accesos a ON u.id = a.idUsuario
                JOIN acceso_Gmail an ON a.id = an.idAcceso
              WHERE an.gmail = "${email}"`;
        const result = await doQuery(sql);

        //vemos si existía ya en la base de datos o no
        if (result.length !== 0) {
          //aquí meter el valor de secreto e id
          secreto = result[0].secreto;
          idUser = result[0].id;
        } else {
          if (action === 'login') {
            console.log('USUARIO NO EXISTE EN LA BASE DE DATOS');
            throw { message: `Usuario ${email} no está registrado` };
          }

          //el usuario no está en la base de datos, hay que crearlo
          const user = {
            secreto: nanoid(10),
            nombre: ticket.payload.given_name,
            apellidos: ticket.payload.family_name,
            foto: ticket.payload.picture,
            gmail: ticket.payload.email,
          };
          try {
            idUser = await newGoogleUser(user);
            secreto = user.secreto;
          } catch {
            throw {
              status: 500,
              message: 'Error al crear nuevo usuario Google Auth',
            };
          }
        }

        //ya tenemos userID y secreto podemos hacer JWT y redirigir:
        const payload = { idUser };
        const options = { expiresIn: '1d' };
        console.log('PAYLOAD', payload);
        const token = jwt.sign(payload, secreto, options);
        //TODO: definir donde hacemos al final la redirección a front
        console.log('REDIRIGIR!!!');
        res.redirect(
          process.env.FRONT_URL + '?action=google-oauth&token=' + token,
        );
      } catch (error) {
        //errores varios
        throw {
          status: error.status,
          message: `Error: ${error.message}`,
          error,
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
    if (error.status) {
      /*       res.status(error.status).send({
        OK: 0,
        status: error.status,
        message: error.message,
      }); */
      res.redirect(`${process.env.FRONT_URL}?error=${error.message}`);
    } else {
      /* res.status(500).send({
        OK: 0,
        message: error.message,
      }); */
      res.redirect(`${process.env.FRONT_URL}?error=${error.message}`);
    }
  }
};

function getGoogleAuthURL(oAuthData, action) {
  /*
   * Generate a url that asks permissions to the user's email and profile
   */
  const oauth2Client = new google.auth.OAuth2(oAuthData);
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes, // If you only need one scope you can pass it as string
    state: action,
  });
}

exports.googleLink = (req, res) => {
  const { action } = req.params;

  console.log('ACTION', action);

  if (action === 'login' || action === 'link' || action === 'signup') {
    const oAuthData = {};
    if (action === 'link') {
      oAuthData.clientId = process.env.GOOGLE_LINK_CLIENT_ID;
      oAuthData.clientSecret = process.env.GOOGLE_LINK_SECRET;
      oAuthData.redirectUri = process.env.GOOGLE_LINK_REDIRECT_URI;
    } else {
      oAuthData.clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
      oAuthData.clientSecret = process.env.GOOGLE_AUTH_SECRET;
      oAuthData.redirectUri = process.env.GOOGLE_AUTH_REDIRECT_URI;
    }
    console.log('OAUTHDATA', oAuthData);
    try {
      const respuesta = getGoogleAuthURL(oAuthData, action);
      console.log('google link creado');
      res.status(200).send({
        OK: 1,
        message: 'google link creado',
        link: `${respuesta}`,
      });
    } catch (error) {
      console.log(`ERROR: ${error}`);
      res.status(500).send({
        OK: 1,
        message: `Error al crear link google ${error}`,
      });
    }
  } else {
    console.log(`Opción ${action} no permitida`);
    res.status(404).send({
      OK: 0,
      message: `Opción ${action} no permitida`,
    });
  }
};

exports.newPass = async (req, res) => {
  const { email } = req.body;

  const sql = `SELECT * FROM acceso_Nativo WHERE email = "${email}"`;
  const response = await doQuery(sql);
  console.log('SELECT email!!', response);

  if (response.length !== 0) {
    const token = jwt.sign({ email }, response[0].pass);

    const link = `${process.env.FRONT_URL}?action=newpass&token=${token}`;
    try {
      mailer(email, link);
      res.send({
        OK: 1,
        message: `Correo electrónico mandado a ${email}`,
      });
    } catch (error) {
      res.status(500).send({
        OK: 0,
        message: `Error al mandar correo a ${email}: ${error}`,
      });
    }
  } else {
    res.status(406).send({
      OK: 0,
      message: 'Ese correo electrónico no existe',
    });
  }
};

exports.changePass = async (req, res) => {
  const newpass = req.body.pass;
  if (isValidUserPass('test@test.es', newpass, res)) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    try {
      const { email } = jwt.decode(token);

      let sql = `SELECT * FROM acceso_Nativo WHERE email = "${email}"`;
      let response = await doQuery(sql);

      if (response.length !== 0) {
        const { pass } = response[0];

        try {
          jwt.verify(token, pass);
          try {
            const newSecret = nanoid(10);
            sql = `UPDATE usuario u
               JOIN accesos ac ON u.id = ac.idUsuario
               JOIN acceso_Nativo an ON ac.id = an.idAcceso
               SET u.secreto = "${newSecret}", an.pass = "${md5(newpass)}"
               WHERE an.email = "${email}"`;
            response = await doQuery(sql);
            res.send({
              OK: 1,
              message: 'Password cambiada',
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
            message: `Token no válido: ${error.message}`,
          });
        }
      }
    } catch (error) {
      res.status(401).send({
        OK: 0,
        error: 401,
        message: `Token no válido.`,
      });
    }
  }
};

validateToken = async (authorization, res) => {
  if (!authorization) {
    console.log('NO HAY TOKEN');
    res.status(401).send({
      OK: 0,
      message: 'No hay token',
    });
    return false;
  }

  const token = authorization.split(' ')[1];
  console.log('TOKEN', token);
  if (!token) {
    console.log('TOKEN NO VALIDO');
    res.status(401).send({
      OK: 0,
      message: 'Token no válido',
    });
    return false;
  }

  const payload = jwt.decode(token);
  if (!payload) {
    console.log('TOKEN NO VALIDO 2');
    res.status(401).send({
      OK: 0,
      status: 401,
      message: 'Token no válido',
    });
    return false;
  }
  console.log('PAYLOAD', payload);

  const { idUser } = payload;

  const sql = `SELECT * FROM usuario WHERE id = ${idUser}`;
  const response = await doQuery(sql);

  console.log('IDUSER RESPONSE', idUser, response);

  if (response) {
    const { secreto } = response[0];
    console.log('SECRETO', secreto);

    try {
      jwt.verify(token, secreto);
      console.log('VERIFICADO');
      return {
        idUser,
        secreto: secreto,
      };
    } catch (error) {
      console.log(`Token inválido: ${error.message}`);
      res.status(401).send({
        OK: 0,
        error: 401,
        message: `Token inválido: ${error.message}`,
      });
      return false;
    }
  } else {
    console.log('Usuario desconocido / token incorrecto');
    res.status(401).send({
      OK: 0,
      error: 401,
      message: 'Usuario desconocido / token incorrecto',
    });
    return false;
  }
};

const getGoogleUser = async (code, res) => {
  const clientId = process.env.GOOGLE_LINK_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_LINK_SECRET;
  const redirectUri = process.env.GOOGLE_LINK_REDIRECT_URI;
  const oauth2Client = getOAuth2Client(clientId, clientSecret, redirectUri);
  const { tokens } = await oauth2Client.getToken(code);

  //elegimos el token que necesitamos para recoger el gmail
  const token = tokens.id_token;

  let ticket;

  try {
    ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
  } catch (error) {
    res.status(401).send({
      status: 401,
      message: `Invalid google token: ${error}`,
    });
    return false;
  }

  const gmail = ticket.payload.email;
  const verifiedUser = ticket.payload.email;

  if (gmail && verifiedUser) {
    const user = {
      secreto: nanoid(10),
      nombre: ticket.payload.given_name,
      apellidos: ticket.payload.family_name,
      foto: ticket.payload.picture,
      gmail,
    };
    return user;
  }

  res.status(401).send({
    status: 401,
    message: `usuario google no válido`,
  });
};

const addGoogleToUser = async (idUser, user, res) => {
  const { secreto, nombre, apellidos, foto, gmail } = user;

  try {
    let sql = `INSERT INTO accesos (idUsuario, tipoAcceso) VALUES (${idUser}, 1)`;
    let response = await doQuery(sql);
    console.log('INSERT1', response);

    try {
      sql = `INSERT INTO acceso_Gmail (gmail, idAcceso) VALUES ("${gmail}", ${response.insertId})`;
      response = await doQuery(sql).catch((error) => {
        throw error;
      });
      console.log('INSERT2', response);

      // creamos el perfil si no está ya creado
      try {
        sql = `INSERT INTO profile (nombre, apellidos, foto, idUsuario)
       VALUES ("${nombre}", "${apellidos}", "${foto}", ${idUser})`;
        response = await doQuery(sql).catch((error) => {
          throw error;
        });
        console.log('INSERT3. PERFIL', response);
        return true;
      } catch (error) {
        console.log('ERRORORRR!!');
        //si falla al insertar se actualiza el que ya hay para ese usuario con los datos de google
        sql = `UPDATE profile SET nombre=${nombre}, apellidos=${apellidos}, foto=${foto} WHERE idUsuario = ${idUser}`;
        console.log(sql);
        response = await doQuery(sql);
        console.log('UPDATE. PERFIL', response);
        return true;
      }
    } catch (error) {
      console.error('error 409');
      res.status(409).send({
        OK: 0,
        message: `El correo ${gmail} ya tiene un perfil creado: ${error}`,
      });
      return false;
    }
  } catch (error) {
    res.status(500).send({
      OK: 0,
      message: `Error de base de datos: ${error}`,
    });
    return false;
  }
};
//TODO ME HE QUEDADO CON ERRORES POR AQUI!!!! (estaba hehco pero la he liado)
exports.vincularGoogle = async (req, res) => {
  //recogemos code del body y authorization del header
  const code = req.body.code;
  const authorization = req.headers.authorization;
  console.log('CODE AUTORIZATION', code, authorization);
  // obtenermos gmail del code
  const gmail = await getGoogleUser(code, res);
  console.log('GMAIL', gmail);
  // obtenemos idUser del token
  const user = await validateToken(authorization, res);
  const { idUser } = user;

  if (idUser && gmail) {
    // añadimos el gmail a accesos_Gmail con el usuario idUser.
    const responseGoogle = addGoogleToUser(idUser, gmail, res);
    if (responseGoogle) {
      res.send({
        OK: 1,
        message: `correo ${gmail.gmail} vinculado a usuario ${idUser}`,
      });
    }
  }
};
