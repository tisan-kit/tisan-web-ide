var express = require('express');
var router = express.Router();
var grpc = require('../service/grpc');
var Product = require('../models/mysql/product').Product; 
var User = require('../models/mysql/user').User; 
var Hardware = require('../models/mysql/hardware').Hardware;
var Objects = require('../models/mysql/object').Objects;
var config = require('../config/index'); 
var authCheck = require('../service/authcheck');
var errorMsg = require('../config/error');
//登录态验证
router.use(authMiddle);

//创建一个行的应用
router.get('/',function(req,res){
  grpc.createProduct({icon:config.host+'/img/default.png'},function(result,err){
    var id=result.id;
    Product.create({
      user_id:req.session.user.id,
      product_id:result.id
    }).then(function(result){
      res.redirect('/product/'+id)
    })
  })
})
router.delete('/:id',function(req,res){
  authCheck.productHandleCheck(req,req.params['id'],function(result){
    if(!result){
      res.redirect('/404');
    }else{
      grpc.deleteProduct([JSON.parse(req.params['id'])],function(result,err){
        Product.destroy({where:{product_id:req.params['id']}}).then(function(result){
          res.json({
            code:0,
            msg:'ok',
          })
        }) 
      })
    }
  })
})

//编辑应用内容
router.get('/:id',function(req,res){
  authCheck.productHandleCheck(req,req.params['id'],function(result){
    if(!result){
      res.redirect('/404');
    }else{
      res.render('product',{
        product:{
          id:req.params['id']
        },
        user:req.session.user,
        navigation:'workspace'
      })
    }
  })
})

//获取具体信息
router.get('/detail/:id',function(req,res){
  authCheck.productHandleCheck(req,req.params['id'],function(result){
    if(!result){
      res.redirect('/404');
    }else{
      grpc.readProduct([parseInt(req.params['id'])],function(result,err){
        var data;
        if(result.products[0].config.length){
          data=JSON.parse(result.products[0].config);
        }else{
          data=[];
        }
        res.json({
          product:{
            id:result.products[0].id,
            name:result.products[0].name,
            descript:result.products[0].description,
            key:result.products[0].key,
            avatar:result.products[0].icon
          },
          inobjects:data
        })
      })
    }
  })
})

//保存object配置信息
router.post('/save/config/:id', function(req, res) {
  authCheck.productHandleCheck(req,req.params['id'],function(result){
    if(!result){
      res.redirect('/404');
    }else{
      Product.find({where:{product_id:req.params['id']}}).then(function(result){
        result.objects=req.body.objects;
        result.save().then(function(result){
          if(result){
            grpc.updateProduct({
              id:parseInt(req.params['id']),
              name:result.dataValues.name,
              description:result.dataValues.descript,
              icon:result.dataValues.avatar,
              config:result.dataValues.objects,
              webapp:config.iframe+req.params['id']
            },function(result){
              res.json({
                code:0,
                msg:'ok'
              });
            })
          }
        })
      })
    }
  })
});

//保存基础信息
router.post('/save/base/:id',function(req,res){
  authCheck.productHandleCheck(req,req.params['id'],function(result){
    if(!result){
      res.redirect('/404');
    }else{
      Product.find({where:{product_id:req.params['id']}}).then(function(result){
        result.name=req.body.name;
        result.descript=req.body.descript;
        result.save().then(function(result){
          if(result){
            grpc.updateProduct({
              id:parseInt(req.params['id']),
              name:result.dataValues.name,
              description:result.dataValues.descript,
              icon:result.dataValues.avatar,
              config:result.dataValues.objects,
              webapp:config.iframe+req.params['id']
            },function(err,result){
              res.json({
                code:0,
                msg:'ok'
              });
            })
          }
        })
      })
    }
  })
})

//返回拼接串
router.get('/qrcode/:id',function(req,res){
  authCheck.productHandleCheck(req,req.params['id'],function(result){
    if(!result){
      res.redirect('/404');
    }else{
      Hardware.findAll({where:{user_id:req.session.user.id}}).then(function(macCodeList){
        var finallAnswer=[],
            mosaicCodeList=[];
        for(var i in macCodeList){
          var tmp = macCodeList[i].dataValues;
          if(tmp.code){
            var tmpKeyList = tmp.code.split('-'),
                key = '-';
            if(tmpKeyList.length==6){
              for(var j in tmpKeyList) key+=tmpKeyList[j];
              finallAnswer.push({
                sourceCodeList:macCodeList[i],
                mosaicCodeList:'pando://identifier?identifier=0-'+(parseInt(req.params['id'])).toString(16)+key.toLowerCase()
              })
            }
          }
        }
        if(finallAnswer.length){
          res.json({ code:0, msg:'ok', data:finallAnswer })
        }else{
          res.json(errorMsg.mac_code_not_set);
        }
      })
    }
  })
})

//TODO  登录态
router.get('/webapp/:id',function(req,res){
  var key = (req.headers['user-agent']).toLowerCase();
  var isWechat;
  if(key.indexOf('micromessenger')==-1){
    isWechat=false;  
  }else{
    isWechat=true;  
  }
  Objects.find({where:{is_public:1}}).then(function(result){
    var objects = {};
    for(var i=0; i<result.length; i++) {
      objects[result[i]["id"]] = result[i]; 
    }
    grpc.readProduct([parseInt(req.params['id'])],function(result,error){
      var data=[];
      if(result.products[0].config.length!=0){
        data=JSON.parse(result.products[0].config);
      }
      res.render('iot',{
        config:data,
        isWechat:isWechat,
        objects: objects
      });
    })
  });
})
//如果没有登录态的用户
function authMiddle(req,res,next){
  if(req.path.indexOf('/webapp')==0||req.session.user){
    next();
  }else{
    res.redirect('/user/login'); 
  }
}

module.exports = router;
