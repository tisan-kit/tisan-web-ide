var express = require('express');
var router = express.Router();
var grpc = require('../service/grpc');
var Product = require('../models/mysql/product').Product; var Objects = require('../models/mysql/object').Objects;
var authCheck = require('../service/authcheck');
router.use(auth);

router.get('/', function(req, res) {
  Product.findAll({where:{user_id:req.session.user.id}}).then(function(result){
    var p=[];
    for(var i in result){
      p.push(result[i].product_id);
    }
    grpc.readProduct(p,function(result){
      if(!result){
        result['products']="";
      }
      console.log(result);
      var data=[];
      for(var i in result.products){
        var tmp=result.products[i];
        data.push({
          avatar:tmp.icon,
          descript:tmp.description,
          name:tmp.name,
          id:tmp.id
        })
      }
      res.render('workspace', { 
        user: req.session.user,
        navigation:'workspace',
        product:data
      });
    })
  })
});


function auth(req,res,next){
  if(!req.session.user){
    res.redirect('/user/login');
  }
  next();
}
module.exports = router;
