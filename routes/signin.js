const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const userModel = require('../models/user');

const checkNoLogin = require('../middleware/checkLogin').checkNoLogin;
const verifyCode = require('../models/svgCaptcha').getCode;

router.get('/', checkNoLogin, function(req, res, next) {
    res.render('signin', {index: ''});
});

router.post('/', checkNoLogin, function(req, res, next) {
    let {username, pass, verifyCode} = req.body;
    try {
        if (username.length < 2) {
            throw new Error('用户名至少得2个字符啊');
        }
        if (!/(.+){6,12}$/.test(pass)) {
            throw new Error('密码必须6到12位');
        }
        if (verifyCode != req.session.captcha) {
            throw new Error('验证码错误');
        }
    } catch (e) {
        //req.flash('error', e.message);
        return res.send(JSON.stringify({statu: 0, msg: e.message}));
    }
    userModel.getUserByName(username, function(user) {
        if (user != -1) {
            if (sha1(pass) === user['pass']) {
                delete user['pass'];
                req.session.user = user;
                return res.send(JSON.stringify({statu: 1, msg: '登录成功'}));
            } else {
                return res.send(JSON.stringify({statu: 0, msg: '账号或密码错误'}));
            }
        } else {
            return res.send(JSON.stringify({statu: 0, msg: '账号不存在'}));
        }
    });
});


router.get('/verifycode', verifyCode);
module.exports = router;
