const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const checkNoLogin = require('../middleware/checkLogin').checkNoLogin;
const verifyCode = require('../models/svgCaptcha').getCode;
const userModel = require('../models/user');
const albumModel = require('../models/album');

router.get('/', checkNoLogin, function(req, res, next) {
    res.render('signup', {index: ''});
});

router.post('/', checkNoLogin, function(req, res, next) {
    let {username, pass, repass, sex, verifyCode} = req.body;
    try {
        if (username.length < 2) {
            throw new Error('用户名至少得2个字符啊');
        }
        if (!/(.+){6,12}$/.test(pass)) {
            throw new Error('密码必须6到12位');
        }
        if (pass != repass) {
            throw new Error('两次密码不一致');
        }
        if (verifyCode != req.session.captcha) {
            throw new Error('验证码错误');
        }
    } catch (e) {
        //req.flash('error', e.message);
        return res.send(JSON.stringify({statu: 0, msg: e.message}));
    }
    userModel.getUserByName(username, function(data) {
        if (data == -1) {
            let user = {
                name: username,
                pass: sha1(pass),
                sex: sex
            }
            userModel.creat(user, function() {
                delete user.pass;
                req.session.user = user;
                albumModel.mkDir(username, function(file) {
                    return res.send(JSON.stringify({statu: 1, msg: '注册成功'}));
                });
            });
        } else {
            return res.send(JSON.stringify({statu: 0, msg: '此用户名已被占用'}));
        }
    });
});


router.get('/verifycode', verifyCode);
module.exports = router;
