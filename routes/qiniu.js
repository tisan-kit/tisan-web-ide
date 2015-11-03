var express = require('express');
var qiniu = require('qiniu');
var config = require('../config/index'); var router = express.Router();
var User = require('../models/mysql/user').User;
var Product = require('../models/mysql/product').Product;
var grpc = require('../service/grpc');
//登录态验证
router.use(authMiddle);

router.get('/account/avatar/token', function(req, res) {
  var putPolicy = new qiniu.rs.PutPolicy(config.qiniu.name,config.qiniu.accountAvatarCallback,'id='+req.session.user.id+'&hash=$(etag)');
  var uptoken = putPolicy.token();
  res.json({ token: uptoken}); 
});

router.post('/account/avatar/callback',function(req,res){
  User.find({where:{id:req.body.id}}).then(function(result){
    result['avatar']=config.qiniu.host+req.body.hash+'?attname=';
    result.save().then(function(result){
      res.end();
    })
  })
})

router.get('/product/avatar/token', function(req, res) {
  var putPolicy = new qiniu.rs.PutPolicy(config.qiniu.name,config.qiniu.productAvatarCallback,'id='+req.query.productid+'&hash=$(etag)');
  var uptoken = putPolicy.token();
  res.json({ token: uptoken}); 
});

router.post('/product/avatar/callback',function(req,res){
  Product.find({where:{product_id:parseInt(req.body.id)}}).then(function(result){
    result.avatar=config.qiniu.host+req.body.hash+'?attname=';
    result.save().then(function(result){
      grpc.updateProduct({
        id:parseInt(req.body.id),
        name:result.dataValues.name,
        description:result.dataValues.descript,
        icon:result.dataValues.avatar,
        config:result.dataValues.objects
      },function(result){
        res.json({
          code:0,
          msg:'ok'
        });
      })
    })  
  }) 
})

//如果没有登录态的用户
function authMiddle(req,res,next){
  if(!req.session.user&&req.method=='GET'){
    res.redirect('/user/login'); 
  }else{
    console.log('next');
    next();
  }
}
module.exports = router;
