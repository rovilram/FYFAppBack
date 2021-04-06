//usamos el mismo modelo que para "questions", ya que es la misma colección
const Question = require("../models/questionsModel");
const { nanoid } = require('nanoid')

//receive id in req.params and returns ONE question
exports.getQuestion = async (req, res) => {

    const questionID = req.params.id;

    //validamos valores recibidos
    if (!questionID) res.status(422).send({
        OK: 0,
        error: 422,
        message: `'questionID' is not a valid value`
    })

    try {
        const quizQuestion = await Question.findOne({ questionID });
        (quizQuestion) ?
            res.send(
                {
                    OK: 1,
                    question: quizQuestion,
                    user: {
                        name: req.name,
                        picture: req.picture
                    }
                })
            :
                res.status(404).send({ OK: 0, message: `Question ${questionID} not found` });
    }
    catch (error) {
        res.status(500).send({
            OK: 0,
            error: 500,
            message: error.message
        })
    }
}


//receive title, answers and validAnswers in req.body, create a new question at DB
//returns newQuestion added
exports.postQuestion = async (req, res) => {

    const title = req.body.title;
    const answers = req.body.answers;
    const validAnswer = parseInt(req.body.validAnswer);

    //validamos valores recibidos
    if (!title) res.status(422).send({
        OK: 0,
        error: 422,
        message: `'Title' is not a valid value`
    })
    else if (!Array.isArray(answers)) res.status(422).send({
        OK: 0,
        error: 422,
        message: `'Answers' format is not valid. Must be an array`
    })
    else if (validAnswer < 0 || validAnswer > answers.length - 1) {
        res.status(422).send({
            OK: 0,
            error: 422,
            message: `'validAnswer' is not a valid value`
        })
    }
    else {
        const question = {
            questionID: nanoid(),
            title,
            answers,
            validAnswer
        }
        try {
            const newQuestion = new Question(question);
            const response = await newQuestion.save();
            res.send({
                OK: 1,
                message: "Question added",
                newQuestion: {
                    questionID: response.questionID,
                    title: response.title,
                    answers: response.answers,
                    validAnswer: response.validAnswer
                }
            });
        }
        catch (error) {
            res.status(500).send({
                OK: 0,
                error: 500,
                message: error.message
            })
        }
    }
}



//receive id in req.params AND title, answers and validAnswers in req.body
//update question with questionID=id at DB
//returns question updated
exports.putQuestion = async (req, res) => {
    const questionID = req.params.id;

    const title = req.body.title;
    const answers = req.body.answers;
    const validAnswer = parseInt(req.body.validAnswer);

    //validamos valores recibidos
    if (!questionID) res.status(422).send({
        OK: 0,
        error: 422,
        message: `'questionID' is not a valid value`
    })
    else if (!title) res.status(422).send({
        OK: 0,
        error: 422,
        message: `'Title' is not a valid value`
    })
    else if (!Array.isArray(answers)) res.status(422).send({
        OK: 0,
        error: 422,
        message: `'Answers' format is not valid. Must be an array`
    })
    else if (validAnswer < 0 || validAnswer > answers.length - 1) {
        res.status(422).send({
            OK: 0,
            error: 422,
            message: `'validAnswer' is not a valid value`
        })
    }
    else {
        const question = {
            questionID,
            title,
            answers,
            validAnswer
        };
        try {
            const response = await Question.findOneAndReplace(
                { questionID },
                question,
                { new: true }
            );
            res.send({ OK: 1, question: response, message: "Question updated" });
        }
        catch (error) {
            res.status(500).send({
                OK: 0,
                error: 500,
                message: error.message
            })
        }
    }
}


//receive id in req.params
//delete question with questionID=id at DB
//returns questionID of question deleted
exports.delQuestion = async (req, res) => {

    const questionID = (req.params.id).toString();

    //validamos valores recibidos
    if (!questionID) res.status(422).send({
        OK: 0,
        error: 422,
        message: `'questionID' is not a valid value`
    })

    try {
        const response = await Question.deleteOne({ questionID });
        (response.deletedCount === 1) ?
            res.send({ OK: 1, message: "Question deleted", questionID: questionID }) :
            res.status(404).send({ OK: 0, message: `Question '${questionID}' not found` });
    }
    catch (error) {
        res.status(500).send({
            OK: 0,
            error: 500,
            message: error.message
        })
    }
}

exports.getAllQuestions = async (req, res) => {
    try {
        const quizQuestions = await Question.find({});
        res.send({
            OK: 1,
            message: "All questions get complete",
            questions: quizQuestions,
            user: {
                name: req.name,
                picture: req.picture
            }
        });

    }
    catch (err) {
        res.status(500).send({
            OK: 0,
            message: err.message
        })
    }
}

//import a question to DB (not to use as middleware)
//returns false if error or question added if OK
exports.importQuestion = async (question) => {

    const { title, answers, validAnswer } = question;


    //validamos valores recibidos
    if (!title) return false;
    if (!Array.isArray(answers)) return false;
    if (validAnswer < 0 || validAnswer > answers.length - 1) return false;

    question.questionID = nanoid();

    try {
        const newQuestion = new Question(question);
        const response = await newQuestion.save();
        return response;
    }
    catch (error) {
        console.error("ERROR:", error.message)
        return false;
    }
}