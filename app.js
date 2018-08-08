var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var config = require('config-lite')(__dirname);
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');
var pkg = require('./package');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'layui')));
app.use(express.static(path.join(__dirname, 'uploads')));

//创建SESSION的中间件
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new FileStore()
}));
app.use(flash());

//设置模板常量
app.locals.info = {
    title: pkg.name
}
//设置模板变量
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

app.use('/', require('./routes/index'));
app.use('/album', require('./routes/album'));
app.use('/messageBoard', require('./routes/messageBoard'));
app.use('/signup', require('./routes/signup'));
app.use('/signout', require('./routes/signout'));
app.use('/signin', require('./routes/signin'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
