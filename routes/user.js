const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// Signup Form Route - Render signup page
router.get("/signup" , (req,res)=>{
    res.render("users/signup.ejs");
});

// Signup Action Route - Register new user in database
router.post("/signup" , wrapAsync(async(req,res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// Login Form Route - Render login page
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

// Login Action Route - Authenticate user
router.post(
    "/login",
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash:true,
    }),
    async (req ,res)=>{
// res.send("welcome to wanderlust! you are logged in");
res.redirect("/listings");
    }
);

// Logout Route - Terminate user session
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;