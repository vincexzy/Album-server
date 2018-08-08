const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/checkLogin').checkLogin;
const muilter = require('../middleware/upload');

const albumModel = require('../models/album');

//渲染页面
router.get('/', checkLogin, function(req, res, next) {
    const userName = req.session.user.name;
    albumModel.readDir(userName, function(classList) {
        res.render('album', {index: '/album', classList: classList});
    });
});
//上传图片
router.post('/', checkLogin, function(req, res, next) {
    //TODO   应该验证格式
    let upload = muilter.array('file', 20);
    upload(req, res, function (err) {
        return res.send(JSON.stringify({statu: 1, msg: '上传成功'}));
    });
});
//按分类获取上传的图片
router.post('/getPics', checkLogin, function(req, res, next) {
    const className = req.body.className;
    const pathName = `${req.session.user.name}/${className}`;
    try {
        if (!className) {
            throw new Error('未选择分类');
        }
    } catch (e) {
        return res.send(JSON.stringify({statu: 0, msg: e.message}));
    }

    albumModel.readDir(pathName, function(files) {
        let newFiles = files.reverse().map(item => {
            return pathName + '/' + item;
        });
        return res.send(JSON.stringify({statu: 1, list: newFiles, msg: '获取图片成功'}));
    });
});
//删除图片
router.post('/delPic', checkLogin, function(req, res, next) {
    let pathName = `${req.session.user.name}/${req.body.pathName}`;
    albumModel.readFile(pathName, function(result) {
        result = JSON.parse(result);
        if (result.statu == 1) {
            albumModel.delFile(pathName, function() {
                return res.send(JSON.stringify({statu: 1, msg: '图片删除成功'}));
            });
        } else {
            return res.send(JSON.stringify({statu: 0, msg: '图片不存在'}));
        }
    });
});
//创建分类
router.post('/creatClass', checkLogin, function(req, res, next) {
    const className = req.body.className;
    const userName = req.session.user.name;
    try {
        if (className.length < 1) {
            throw new Error('请输入分类名称');
        }
    } catch (e) {
        return res.send(JSON.stringify({statu: 0, msg: e.message}));
    }
    albumModel.readDir(userName, function(classList) {
        if (classList.indexOf(className) == -1) {
            albumModel.mkDir(userName + '/' + className, function() {
                return res.send(JSON.stringify({statu: 1, msg: '创建分类成功'}));
            });
        } else {
            return res.send(JSON.stringify({statu: 0, msg: '此分类名已存在'}));
        }
    });
});
// 删除分类
router.post('/delClass', checkLogin, function(req, res, next) {
    const className = req.body.className;
    const pathName = `${req.session.user.name}/${className}`;

    try {
        if (!className) {
            throw new Error('未选择删除的分类');
        }
    } catch (e) {
        return res.send(JSON.stringify({statu: 0, msg: e.message}));
    }

    //此分类下无图片时，才可以删除
    albumModel.readDir(pathName, function(files) {
        if (files.length <= 0) {
            albumModel.delDir(pathName, function() {
                return res.send(JSON.stringify({statu: 1, msg: '分类删除成功'}));
            });
        } else {
            return res.send(JSON.stringify({statu: 0, msg: '请先清空此分类下的图片'}));
        }
    });
});
// 重命名分类名
router.post('/reName', checkLogin, function(req, res, next) {
    let {oldClassName,newClassName} = req.body;
    oldClassName = `${req.session.user.name}/${oldClassName}`;
    newClassName = `${req.session.user.name}/${newClassName}`;

    try {
        if (!oldClassName) {
            throw new Error('未选择重命名的分类');
        }
    } catch (e) {
        return res.send(JSON.stringify({statu: 0, msg: e.message}));
    }
    albumModel.rename(oldClassName, newClassName, function() {
        return res.send(JSON.stringify({statu: 1, msg: '分类重命名成功'}));
    });
});
module.exports = router;
