const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

//Questions endpoint (devuelve "num" preguntas o todas si no se pasa ese parámetro por body.params)
router.route('/').get(courseController.getCourses);
// router.route('/prueba').get(courseController.getCoursesPrueba);
router.route('/addFav/:idUsuario').post(courseController.addFav)
router.route('/fav/:idUsuario').get(courseController.getFav);
router.route('/delete/:id').delete(courseController.deleteCourse);
router.route('/getCourse/:id').get(courseController.getCourse);

// router.get('/fav', courseController.getFav);

module.exports = router;

