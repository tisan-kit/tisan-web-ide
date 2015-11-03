var Product = require('../models/mysql/product').Product;
//登录输入数据合法性检测
exports.loginCheck=function(username,password){
  var q=0;
  if(username.length>5&&username.length>50){
    q=1; 
  } if(password.length<5||password.length>20){
    q=1; 
  } 
  //username是否是邮箱格式
  var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(!filter.test(username)){
    q=1;
  }
  //password特殊字符验证

  if(/[^a-zA-Z0-9]/.test(password)){
    q=1; 
  } 
  //如果输入格式错误 
  if(q){ return false};

  //去空格
  return {
    username:username.replace(/\s+/g,""),
    password:password.replace(/\s+/g,""),
  }
}
exports.productHandleCheck=function(req,id,callback){
  if(!req.session.user){
    callback(false);
    return;
  } 

  Product.find({where:{product_id:id}}).then(function(result){
    if(!result){
      callback(false);
      return;
    }
    if(result.dataValues.user_id==req.session.user.id){
      callback(true);
      return;
    }else{
      callback(false);
    }
  })  
}
