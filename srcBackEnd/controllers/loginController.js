// const jwt = require('jsonwebtoken');
// const md5 = require('md5');
// require('dotenv').config();
// const { google } = require('googleapis');

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

exports.signUp = async (req, res) => {
  /* const user = req.body.user;
  const password = req.body.password;
  const userType = req.body.userType;

  //Validamos los campos user y password
  if (isValidUserPass(user, password, res)) {
    //generamos una clave secreta para el JWT del usuario
    const secret = nanoid();

    const newUser = new User({
      user,
      password: md5(password),
      secret,
      userType,
    });
    try {
      const response = await newUser.save();
      res.send({
        OK: 1,
        message: 'New user created',
        newUser: response.user,
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
  } */
};

exports.login = async (req, res) => {
  /*  const user = req.body.user;
  const password = req.body.password;

  if (isValidUserPass(user, password, res)) {
    const response = await User.findOne({ user, password: md5(password) });

    if (response) {
      const payload = { user, userType: response.userType };
      const options = { expiresIn: '10m' };
      const token = jwt.sign(payload, response.secret, options);
      res.send({
        OK: 1,
        message: 'Authorized user',
        token,
      });
    } else {
      res.status(401).send({
        OK: 0,
        error: 401,
        message: 'not a valid user/password pair',
      });
    }
  } */
};

exports.signOut = async (req, res) => {
  /*   const authorization = req.headers.authorization;

  const token = authorization.split(' ')[1];

  const user = jwt.decode(token).user;

  const response = await User.findOne({ user });

  if (response) {
    const secret = response.secret;

    try {
      jwt.verify(token, secret);
      try {
        const newSecret = nanoid();
        await User.updateOne({ user }, { secret: newSecret });
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
  } */
};

const auth = async (authorization) => {
  /*   if (authorization) {
    const token = authorization.split(' ')[1];

    const payload = jwt.decode(token);

    if (!payload) {
      return { OK: 0, status: 401, message: 'Invalid token' };
    }
    const user = payload.user;

    const response = await User.findOne({ user });

    if (response) {
      const secret = response.secret;
      req.name = response.name;
      req.picture = response.picture;
      //pasamos datos de usuario en la request por si nos pueden ser útiles.

      try {
        jwt.verify(token, secret);
        //TODO: si algun dia necesito autenticacion de estudiante o admin
        //habrá que hacerlo desde aquí
        return { OK: 1, status: 200, message: 'autorized User' };
      } catch (error) {
        return { OK: 0, status: 401, message: error.message };
      }
    } else {
      return { OK: 0, status: 401, message: 'User unknown / invalid Token' };
    }
  } else {
    return { OK: 0, status: 401, message: 'Token required' };
  } */
};

//middleware!!!
exports.authUser = async (req, res, next) => {
  /*   const authorization = req.headers.authorization;
  const response = auth(authorization);
  if (response.OK === 1) {
    res.status(response.status).send({
      OK: response.OK,
      status: response.status,
      message: response.message,
    });
  }
  // TODO !!!!: ME HE QUEDADO AQUI EN REFACTOR
  // meter aquí llamada a funcion auth(authorization)
  // if return trae 1 hacer next, sino sacar el error por res */
};

exports.googleOAuth = async (req, res) => {
  /*   const code = req.body.code;

  const GOOGLE_SECRET = process.env.GOOGLE_AUTH_SECRET;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;

  console.log(GOOGLE_SECRET);

  const oauth2Client = new google.auth.OAuth2({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET,
    redirectUri: 'postmessage',
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
    const name = ticket.payload.name;
    const picture = ticket.payload.picture;
    console.log(user, verifiedUser);
    if (user && verifiedUser) {
      //tenemos el usuario hay que buscarlo en nuestra base de datos
      try {
        const result = await User.findOneAndUpdate({ user }, { name, picture });
        console.log('RESULT', result);
        if (result) {
          console.log('USUARIO REGISTRADO');
          const payload = { user, userType: result.userType };
          const options = { expiresIn: '10m' };
          const token = jwt.sign(payload, result.secret, options);
          console.log('NEWTOKEN', token);
          res.send({
            OK: 1,
            status: 200,
            message: 'Authorized user',
            token,
          });
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
  } */
};
