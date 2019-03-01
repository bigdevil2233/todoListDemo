var router=require('express').Router();
var logic=require('../business_logic/logic.js');

//登录首页
router.get('/',logic.checkLogined);//验证登录（免登陆功能）
router.get('/',logic.getLogin);
//登录首页
router.get('/login',logic.checkLogined);
router.get('/login',logic.getLogin);
//用户登录
router.post('/login',logic.postLogin);
//用户注册
router.post('/join',logic.postJoin);
//用户登出
router.get('/logout',logic.getLogout);
//新增任务
router.post('/add_item',logic.addItem);
//完成任务
router.get('/finishItem/:itemId',logic.updateFinishState);// /finishItem/:id这个方法可以获取:id传过来的内容
//删除任务
router.get('/deleteItem/:itemId',logic.deleteItem);
//跳转至修改任务页面
router.get('/changeItem/:itemId',logic.changeItem);
//修改任务
router.post('/edit_item/:itemId',logic.editItemPost);
//跳转至上传头像页面
router.get('/upload_avatar',logic.upload_avatar);
//上传头像
var path = require('path');//获取当前routes.js的路径
var pathDir=path.join(__dirname,'../public','avatars');//指定一个储存头像文件的路径
var multer = require('multer');
// var upload=multer({dest:pathDir});//给路径赋值
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathDir)//给上传路径赋值
    },
    filename: function (req, file, cb) {
        var userName=req.session.userInfo.userName;
        cb(null, userName)//给上传文件重命名
    }
});
var upload = multer({ storage: storage });
router.post('/edit_avatar',upload.single('avatar'),logic.edit_avatar);


module.exports = router;