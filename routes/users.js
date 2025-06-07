const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const { storeReturnTo } = require('../middleware');

// Register
router.get('/register', users.renderRegister);
router.post('/register', users.register);

// Login
router.get('/login', users.renderLogin);
router.post(
    '/login',
    storeReturnTo,
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }),
    users.login
);

// Logout
router.get('/logout', users.logout);

module.exports = router;
