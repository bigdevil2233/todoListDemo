var db=require('../dao/db.js');
var path=require('path');
//返回首页
function getLogin(req,res,next){
    res.redirect('login.html');
}
//登录
function postLogin(req,res,next){
    /*
        1.获取信息
            获得userName和passWord
        2.处理信息
            2.1伪代码：

            if(用户名和密码都不为空){
                db方法判断数据库中用户名是否存在
                if(用户名在数据库存在){
                    if(密码与数据库中密码匹配){
                        res.send("登录成功，个性化首页");
                    }else{
                        res.send("密码错误");
                    }
                }else{
                    res.send("用户名不存在");
                }
            }else{
                res.send("用户名和密码有一个为空");
            }
        3.返回信息
    */
    //1.获取信息
    var userName=req.body.userName;
    var passWord=req.body.passWord;
    //2.处理信息
    if(userName && passWord){
        db.getLoginInfo(userName,function(err,doc){
            if(err){
                console.error("getLoginInfo"+err);
            }else{
                if(doc[0]){
                    if(passWord===doc[0].passWord){
                        //3.返回信息
                        req.session.userInfo=doc[0];
                        // res.send("登录成功，个性化首页");
                        res.cookie('THI_LOGIN',userName);

                        renderPage(req,res);

                    }else{
                        res.send("密码错误");
                    }
                }else{
                    res.send("用户名不存在");
                }
            }
        });
    }else {
        res.send("用户名和密码有一个为空");
    }
}
//注册
function postJoin(req,res,next){
    /*
      1.获取信息
      2.处理信息
        if(passWord===passWordConfirm){
            判断数据库中是否有相同的userName
            if(没有相同的userName){
                //如需必要，今后可加入邮箱判断，这里不加
                if(没有相同的email){
                    向数据库中加入这个数据实体
                }else{
                    res.send("邮箱已使用");
                }
            }else{
                res.send("该用户名已注册");
            }
        }else{
            res.send("两次密码不一致"); //以后可改为redirect一个页面
        }
      3.返回信息
      */
    // 1.获取信息
    var email=req.body.emailJoin;
    var userName=req.body.userNameJoin;
    var sex=req.body.sex;
    var passWord=req.body.passWordJoin;
    var passWordConfirm=req.body.passWordJoinConfirm;
    //2.处理信息
    if(passWord===passWordConfirm){
        db.getLoginInfo(userName,function(err,doc){
            if(err){
                console.error("注册用户出错"+err);
            }else{
                if(doc.length===0){
                    var data={
                        email:email,
                        userName:userName,
                        passWord:passWord,
                        sex:sex
                    };
                    db.addLoginInfo(data,function(err,doc){
                        if(err){
                            console.error("注册用户出错"+err);
                        }else{
                            //3.返回信息
                            res.send("恭喜您<p style='color:red'>"+userName+"</p>注册成功");
                        }
                    })
                }else{
                    res.send("该用户名已注册");
                }
            }
        });
    }else{
        res.send("两次密码不一致"); //以后可改为redirect一个页面
    }
}
//添加事件
function addItem(req,res,next){
    /*
    1.获取信息
    2.处理信息
    3.返回信息
    if(userId!=null){
        if(itemContent!=null){
            if(itemDate!=null){
                调用db.addItemInfo方法添加任务数据
            }else{
                res.send("无法获取当前时间，请重试");
            }
        }else{
            res.send("添加任务失败，请重试");
        }
    }else{
        res.send("无法获取用户ID，请登录");
    }
     */
    // 1.获取信息
    var userId=req.session.userInfo._id;
    var itemContent=req.body.itemContent;
    var itemDate=new Date();
    // 2.处理信息
    if(userId!==null){
        if(itemContent!==null){
            if(itemDate!==null){
                // 调用db.addItemInfo方法添加任务数据
                var data={
                    userId:userId,
                    itemContent:itemContent,
                    itemDate:itemDate
                };
                db.addItemInfo(data,function(err,doc){
                    if(err){
                        console.error("新增任务出错"+err);
                    }else{
                        // res.send("任务添加成功");
                        renderPage(req,res);
                    }
                });
            }else{
                res.send("无法获取当前时间，请重试");
            }
        }else{
            res.send("添加任务失败，请重试");
        }
    }else{
        res.send("无法获取用户ID，请登录");
    }
}
//任务状态改变
function updateFinishState(req,res,next){
    ///finishItem/<%=item._id%>/?state=yes
    var itemId=req.params.itemId;
    // console.log(itemId);
    var state=req.query.state;
    state=(state==='yes')?2:1;//重新给state赋值
    var data={
        itemId:itemId,
        state:state
    };
    db.updateFinishState(data,function(err,doc){
        if(err){
            console.err("修改状态错误"+err);
        }else{
            renderPage(req,res);
            // res.send("状态修改成功");
        }
    });

}
//删除任务
function deleteItem(req,res,next){
    var itemId=req.params.itemId;
    db.deleteItemInfo(itemId,function(err,doc){
        if(err){
            console.error('删除任务出错'+err);
        }else{
            renderPage(req,res);
        }
    })
}
//跳转至修改任务页面
function changeItem(req,res,next){
    var itemId=req.params.itemId;
    var avatar=req.session.userInfo.avatar;
    db.getOneItemInfo(itemId,function(err,doc){
        if(err){
            console.error("查询任务列表出错"+err);
        }else{
            avatar=path.join('/','avatars',avatar);
            res.render('./edit.ejs',{
                avatar:avatar,
                userName:req.session.userInfo.userName,
                itemContent:doc[0].itemContent,
                itemId:itemId
            });
        }
    });
}
//修改任务
function editItemPost(req,res,next){
    var itemId=req.params.itemId;
    var itemContent=req.body.itemContent;
    var data={
      itemId:itemId,
      itemContent:itemContent,
      itemDate:new Date()
    };
    db.changeItemInfo(data,function(err,doc){
        if(err){
            console.error("修改任务出错"+err);
        }else{
            renderPage(req,res);
        }
    });
}
//渲染任务中心页面
function renderPage(req,res){
    var userId=req.session.userInfo._id;
    var userName=req.session.userInfo.userName;
    var avatar=req.session.userInfo.avatar;
    db.getItemInfo(userId,function(err,doc){
        if(err){
            console.error("查询任务列表出错"+err);
        }else{
            avatar=path.join('/','avatars',avatar);
            res.render('./center.ejs', {
                avatar: avatar,
                userName: userName,
                items: doc
            });
        }
    });
}
//验证登录
function checkLogined(req,res,next){
    if(req.session.userInfo){
        renderPage(req,res);
    }else{
        next();
    }
}

//登出
function getLogout(req,res,next){
    req.session.destroy();
    res.redirect('./login.html');
}
//跳转至上传头像
function upload_avatar(req,res,next){
    var userName=req.session.userInfo.userName;
    var avatar=req.session.userInfo.avatar;
    avatar=path.join('/','avatars',avatar);
    res.render('./upload_avatar.ejs',{
        userName:userName,
        avatar:avatar
    });
}
//上传头像
function edit_avatar(req,res,next){
    var data={
      userId:req.session.userInfo._id,
      userName:req.session.userInfo.userName
    };
    db.updateAvatar(data,function(err,doc){
        if(err){
            console.error('上传头像出错'+err);
        }else{
            // res.send('头像上传成功');
            renderPage(req,res);
        }
    });

}



exports.postLogin=postLogin;
exports.getLogin=getLogin;
exports.postJoin=postJoin;
exports.getLogout=getLogout;
exports.addItem=addItem;
exports.updateFinishState=updateFinishState;
exports.deleteItem=deleteItem;
exports.changeItem=changeItem;
exports.editItemPost=editItemPost;
exports.checkLogined=checkLogined;
exports.upload_avatar=upload_avatar;
exports.edit_avatar=edit_avatar;