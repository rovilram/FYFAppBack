const express = require('express');
const router = express.Router();
const userController = require('../controllers/loginController');

router.post('/signup').post(userController.signUp);

router.post('/login').post(userController.login);

router.get('/logout').get(userController.logout);

router
  .route('/authuser')
  .get(userController.authUser)
  //si pasa la autenticación devolvemos que todo ha ido bien
  .get((req, res) => {
    res.send({
      OK: 1,
      message: 'authorized user',
    });
  });

//endpoint para pasar a back el código de solo un uso
//del OAuth de google
router.route('/google-oauth').post(userController.googleOAuth);

module.exports = router;
