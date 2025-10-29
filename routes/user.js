const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const router = express.Router();
const { userValidation } = require('../ServerValidation');
const { route } = require('./listing');
const passport = require('passport');
const { isloggedIn, saveredirectUrl } = require('../utils/islogin');

const validateuser = (req, res, next) => {
    let { error } = userValidation.validate(req.body);
    if (error) {
        throw ExpressError(400, error);
    }
    else next();
}

router.get('/signup', (req, res) => {
    res.render('user/signup');
})

router.get('/login',saveredirectUrl, (req, res) => {
    res.locals.redirectUrl = "'/listing";
    res.render('user/login');
})

router.post('/signup', wrapAsync(async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        let newuser = new User({ username, email });
        let usersignup = await User.register(newuser, password);
        req.login(usersignup,(err)=>{
            if(err) return next(err);
            req.flash('success', "Welcome to Wanderlust");
            res.redirect('/listing');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/signup');
    }
}))

router.post('/login',saveredirectUrl, passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash('success', "welcom to Wanderlust");
    let redir = res.locals.redirectUrl || "/listing";
    res.redirect(redir);
}))

router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logOut((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Logged out');
            res.redirect('/listing');
        })
    }
    else res.redirect('/listing');
})

module.exports = router;
