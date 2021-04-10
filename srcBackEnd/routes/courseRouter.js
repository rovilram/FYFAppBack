const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

//Questions endpoint (devuelve "num" preguntas o todas si no se pasa ese parámetro por body.params)
router.route('/').get(courseController.getCourses);

//router.get('/:id', courseController.getCourse);

router.get('/fav', courseController.getFav);

module.exports = router;
