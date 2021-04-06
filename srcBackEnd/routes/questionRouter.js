const express = require("express");
const router = express.Router();
const {
    getQuestion,
    postQuestion,
    putQuestion,
    delQuestion,
    getAllQuestions 
} = require("../controllers/questionController");



router.route("/")
    .post(postQuestion)
    .get(getAllQuestions)


router.route("/:id")
    .get(getQuestion)
    .put(putQuestion)
    .delete(delQuestion)




module.exports = router;
