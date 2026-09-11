const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// DATABASE CONNECTION

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connection to Database successful");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


// APP CONFIGURATION 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));



const store = MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: "sessions",
    ttl: 7 * 24 * 60 * 60,
});

store.on("error", (err) => {
    console.log("Error in MONGO SESSION STORE", err);
});


//  SESSION 

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};



app.use(session(sessionOptions));


// FLASH
app.use(flash());

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//GLOBAL VARIABLES

app.use((req, res, next) => {

    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});


//HOME ROUTE

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/", users);
// LISTING ROUTES 
app.use("/listings", listings);
// REVIEW ROUTES
app.use("/listings/:id/reviews", reviews);


// 404 MIDDLEWARE

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// ERROR HANDLING

app.use((err, req, res, next) => {
    console.log("ERROR:", err);
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";


    // Invalid MongoDB ID
    if (err.name === "CastError") {
        req.flash(
            "error",
            "Listing is not registered!"
        );
        return res.redirect("/listings");

    }


    res.status(statusCode).render("error.ejs", {
        message
    });

});


// START SERVER

app.listen(port, () => {
    console.log(
        `Server is listening on port ${port}`
    );

});