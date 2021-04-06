const Questions = require("../models/questionsModel");


exports.getQuestions = async (req, res) => {
    try {
        const numQuestions = await Questions.find().estimatedDocumentCount();

        const num = (req.params.num > 0 || req.params.num < numQuestions) ?
            parseInt(req.params.num) : numQuestions;

        try {
            const quizQuestions = await Questions.aggregate().match({}).sample(num);
            res.send(quizQuestions);
        }
        catch (err) {
            res.status(500).send({
                OK: 0,
                message: err.message
            })
        }
    }
    catch (err) {
        res.status(500).send({
            OK: 0,
            message: err.message
        })
    }
}
