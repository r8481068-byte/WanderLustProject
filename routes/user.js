const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");


// SIGNUP
// GET SIGNUP
router.get("/signup",userController.renderSignupForm);

// POST SIGNUP
router.post("/signup", userController.signup);

// LOGIN // GET LOGIN

router.get("/login",userController.login);


// POST LOGIN
router.post(
    "/login",
    userController.passportAuthenticate,
    userController.loginSuccess
);


// LOGOUT

router.get("/logout",userController.logout);


module.exports = router;