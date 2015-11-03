var express = require('express');
var router = express.Router();
var Objects = require('../models/mysql/object').Objects;
var Product = require('../models/mysql/product').Product;
var when = require('when');

//登录态验证
router.use(authMiddle);

//查看所有的object
router.get('/all', function(req, res) {
  var mongoQuery={
      where:{
        is_public:'1'
      }
  };
  if(req.query.is_public!='undefined'&&req.query.is_public==0){
    mongoQuery={
      where:{
        user_id:req.session.user.id,
        delete:'0'
      }
    }
  }
  Objects.findAll(mongoQuery).then(function(result){
    var p=[];
    for(var i in result){
      if(result[i].dataValues.status){
        result[i].dataValues.status=JSON.parse(result[i].dataValues.status);
      }
      p.push(result[i].dataValues);
    }
    res.json({
      msg:'ok',
      data:p,
      code:0
    });
  })
});

//添加组件
router.post('/',function(req,res){ 
  Objects.create({
    name:req.body.name,
    c_code:req.body.c_code||'',
    status:req.body.status||'',
    label:req.body.label||'',
    is_public:'0',
    user_id:req.session.user.id,
    delete:'0'
  }).then(function(result){
    res.json({code:0,msg:'ok',data:result.null})
  }).catch(function(err){
    res.json({code:-99,msg:'server error'})
  }) 
})

//删除组件
router.delete('/:id',function(req,res){
  Objects.find({where:{id:req.params['id']}}).then(function(result){
    result.delete='1';
    return result.save();
  }).then(function(result){
    res.json({code:0,msg:'ok'});
  }).catch(function(err){
    res.json({code:-99,msg:'server error'});
  })
})

//更新组件
router.put('/:id',function(req,res){
  Objects.find({where:{id:req.params['id'],user_id:req.session.user.id}}).then(function(result){
    for(var i in req.body){
      result[i]=req.body[i];
    }
    return result.save();
  }).then(function(result){
    res.json({code:0,msg:'ok'});
  }).catch(function(err){
    res.json({code:-99,msg:'server error'});
  })
})

//如果没有登录态的用户
function authMiddle(req,res,next){
  if(!req.session.user){
    res.redirect('/user/login'); 
  }else{
    next();
  }
}


module.exports = router;
