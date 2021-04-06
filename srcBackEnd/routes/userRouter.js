const express = require('express');
const router = express.Router();
const userController = require('../controllers/loginController');

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
