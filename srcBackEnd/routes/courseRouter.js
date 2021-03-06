const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const loginController = require('../controllers/loginController');

//Questions endpoint (devuelve "num" preguntas o todas si no se pasa ese parámetro por body.params)
router
  .route('/')
  //.get(loginController.authUser)
  .get(courseController.getCourses);
// router.route('/prueba').get(courseController.getCoursesPrueba);
router
  .route('/fav')
  .post(loginController.authUser)
  .post(courseController.addFav);
router
  .route('/fav')
  .get(loginController.authUser)
  .get(courseController.getFav);
router
  .route('/delete/:id')
  .delete(loginController.authUser)
  .delete(courseController.deleteCourse);
router.route('/getCourse/:id').get(courseController.getCourse);

// router.get('/fav', courseController.getFav);

module.exports = router;
