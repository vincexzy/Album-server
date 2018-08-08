const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/checkLogin').checkLogin;

router.get('/', checkLogin, function(req, res, next) {
    req.session.user = '';
    res.redirect('/messageBoard');
});

module.exports = router;
