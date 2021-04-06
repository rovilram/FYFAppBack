const express = require("express");
const router = express.Router();
const {getQuestions} = require("../controllers/questionsController");


//Questions endpoint (devuelve "num" preguntas o todas si no se pasa ese parámetro por body.params)
router.route("/:num?")
    .get(getQuestions)


module.exports = router;
