const express = require("express");
const router = express.Router();
const {
    signUp,
    login,
    signOut,
    authUser,
    postGoogleCode
} = require("../controllers/userController");


router.route("/signup")
    .post(signUp)


router.route("/login")
    .post(login)

router.route("/signout")
    .get(signOut)

router.route("/authuser")
    .get(authUser)
    //si pasa la autenticación devolvemos que todo ha ido bien
    .get((req, res) => {
        res.send({
            OK: 1,
            message: "authorized user"
        })
    })

//endpoint para pasar a back el código de solo un uso
//del OAuth de google
router.route("/postgooglecode")
    .post(postGoogleCode)


module.exports = router;
