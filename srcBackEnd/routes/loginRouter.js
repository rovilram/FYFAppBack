const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/signup').post(loginController.signUp);

router.post('/login').post(loginController.login);

router.get('/logout').get(loginController.logout);

router
  .route('/authuser')
  .get(loginController.authUser)
  //si pasa la autenticación devolvemos que todo ha ido bien
  .get((req, res) => {
    res.send({
      OK: 1,
      message: 'authorized user',
    });
  });

//endpoint para pasar a back el código de solo un uso
//del OAuth de google
router.route('/google-oauth').post(loginController.googleOAuth);

module.exports = router;
