const passport = require("passport");
const User = require("../models/user.js");


// SIGNUP

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        let newUser = new User({
            username,
            email
        });

        let registeredUser = await User.register(
            newUser,
            password
        );

        console.log(registeredUser);

        req.flash(
            "success",
            "Welcome to WanderLust!"
        );

        res.redirect("/login");

    } catch (err) {
        console.log(err);

        req.flash(
            "error",
            err.message
        );

        res.redirect("/signup");
    }
};


// LOGIN

module.exports.login = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.passportAuthenticate = passport.authenticate(
    "local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }
);


module.exports.loginSuccess = (req, res) => {
    req.flash(
        "success",
        "Welcome back to WanderLust!"
    );

    res.redirect("/listings");
};


// LOGOUT

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You have been logged out!"
        );

        res.redirect("/listings");
    });
};