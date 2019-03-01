var createError = require('http-errors');
var express = require('express');
var expressSession=require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var router=require("./routes/routes.js");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    //cookie名字
    name:'todolist',
    //秘钥（必须设置）
    secret: 'keyboard cat',
    //是否允许重复存储
    resave: true,
    //给每个请求都设置一个session cookie，通常false更合理
    saveUninitialized: false
    //给cookie留存设置时间（10分钟免登陆）
    // cookie:{maxAge:1000*60*10}
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',router);

app.all('*',function(req,res,next){
    res.status(404).send('Not Found');
    // res.end("404 Not Found!");
});
// catch 404 and forward to error handler

module.exports = app;
