//单例模式 标记对象
var loginModel=null;
var itemModel=null;
var connectionState=null;
//引入
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/todo');//连接
var connection=mongoose.connection;
connection.on('error',function(err){
    if(err){
        console.log(err);
    }
});
connection.on('open',function(){
    if(connectionState==null){
        connectionState='open';
        console.log('与mongodb连接成功');
    }
});
//数据骨架Schema，需要new一个
var loginSchema=new mongoose.Schema({
    userName:{type:String},
    passWord:{type:String},
    email:{type:String},
    sex:{type:String,default:'female'},
    avatar:{type:String,default:'avatar.jpg'}
});
if(loginModel===null){
    loginModel=mongoose.model('login',loginSchema);
}
// loginModel.create({userName:'aisa',passWord:'12345'},function(){
//     console.log('join success');
// });

//任务Schema
var itemSchema=new mongoose.Schema({
    userId:{type:String},
    itemContent:{type:String},
    itemDate:Date,
    finishState:{type:Number,default:1}//这里设置一个默认状态为未完成，1为未完成，2为完成
});
if(itemModel===null){
    itemModel=mongoose.model('item',itemSchema);
}




function getLoginInfo(userName,callback){
    loginModel.find({userName:userName},function(err,docs){
        if(err){
            callback(err);
        }else{
            callback(null,docs)
        }
    });
}


function addLoginInfo(data,callback){
    var dataTemp=new loginModel(data);
    dataTemp.save(function(err,docs){
        if(err){
            callback(err);
        }else{
            callback(null,docs);
        }
    });
}
// var lisa={
//   userName:'lisa',
//   passWord:'12345'
// };
// addLoginInfo(lisa,function(err,doc){
//     console.log(doc);
// });
//上传头像
function updateAvatar(data,callback){
    var userId=data.userId;
    var userName=data.userName;
    loginModel.findById(userId,function(err,doc){
        if(err){
            callback(err);
        }else{
            // console.log(doc);
            doc.avatar=userName;
            doc.save(function(err,doc){
                if(err){
                    callback(err);
                }else{
                    callback(null,doc);
                }
            });
            // callback(null,docs);
        }
    });
}


//获取任务函数
function getItemInfo(userId,callback){
    itemModel.find({userId:userId},function(err,docs){
        if(err){
            callback(err);
        }else{
            callback(null,docs)
        }
    });
}
//获取一个任务信息
function getOneItemInfo(itemId,callback){
    itemModel.find({_id:itemId},function(err,docs){
        if(err){
            callback(err);
        }else{
            callback(null,docs)
        }
    });
}
//新增任务函数
function addItemInfo(data,callback){
    var dataTemp=new itemModel(data);
    dataTemp.save(function(err,docs){
        if(err){
            callback(err);
        }else{
            callback(null,docs);
        }
    });
}
//任务状态修改
function updateFinishState(data,callback) {
    itemModel.findById(data.itemId,function(err,doc){
        if(err){
            callback(err);
        }else{
            // console.log(doc);
            doc.finishState=data.state;
            doc.save(function(err,doc){
                if(err){
                    callback(err);
                }else{
                    callback(null,doc);
                }
            });
            // callback(null,docs);
        }
    });
}
//删除任务
function deleteItemInfo(itemId,callback){
    itemModel.findById(itemId,function(err,doc){
        if(err){
            callback(err);
        }else{
            // console.log(doc);
            doc.remove(function(err,doc){
                if(err){
                    callback(err);
                }else{
                    callback(null,doc);
                }
            });
            // callback(null,docs);
        }
    })
}
//修改任务
function changeItemInfo(data,callback){
    itemModel.findById(data.itemId,function(err,doc){
        if(err){
            callback(err);
        }else{
            // console.log(doc);
            doc.itemContent=data.itemContent;
            doc.itemDate=data.itemDate;
            doc.save(function(err,doc){
                if(err){
                    callback(err);
                }else{
                    callback(null,doc);
                }
            });
        }
    })
}



//发布函数
exports.getLoginInfo=getLoginInfo;
exports.addLoginInfo=addLoginInfo;
exports.addItemInfo=addItemInfo;
exports.getItemInfo=getItemInfo;
exports.getOneItemInfo=getOneItemInfo;
exports.updateFinishState=updateFinishState;
exports.deleteItemInfo=deleteItemInfo;
exports.changeItemInfo=changeItemInfo;
exports.updateAvatar=updateAvatar;