const express = require('express');
const router = express.Router();
const moment = require('moment');
const checkLogin = require('../middleware/checkLogin').checkLogin;

const userModel = require('../models/user');
const messageModel = require('../models/messageBoard');

//获取全部留言
router.get('/', function(req, res, next) {
    messageModel.getMessageAll(function(messages) {
        let newMessage = messages.map(item => {
            item = JSON.parse(item);
            item.time = moment(item.time).format('YYYY-MM-DD h:mm:ss');
            item.sex = userModel.getUserByNameSync(item.userName).sex;
            return item;
        });
        newMessage = newMessage.reverse();
        res.render('messageBoard', {index: '/', messages: newMessage});
    });
});

//创建留言
router.post('/creat', checkLogin, function(req, res, next) {
    const content = req.body.content;
    // 获取当前时间戳
    const time = Date.parse(new Date());
    try {
        if (content.length < 1 || content.length > 100) {
            throw new Error('请输入1-100字符');
        }
    } catch (e) {
        return res.send(JSON.stringify({statu: 0, msg: e.message}));
    }
    let message = {
        id: time + Math.ceil(Math.random() * 10), // 目前先用时间戳为ID + 随机数
        userName: req.session.user.name,
        time: time,
        content: content
    }
    messageModel.creat(message, function() {
        return res.send(JSON.stringify({statu: 1, msg: '留言成功'}));
    });
});

//删除留言
router.post('/removeMessage', checkLogin, function(req, res, next) {
    const id = req.body.id;
    messageModel.removeMessage(id, function() {
        return res.send(JSON.stringify({statu: 1, msg: '删除留言成功'}));
    });
});
module.exports = router;
