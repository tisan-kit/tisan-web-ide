var express = require('express');
var router = express.Router();
var User = require('../models/mysql/user').User;
var Hardware = require('../models/mysql/hardware').Hardware;
var crypto = require('crypto'); 
var errorMsg = require('../config/error.js');
var formidable = require('formidable');
var util = require('util');
var nodemailer=require('nodemailer');
var redis = require('../db/redis').init(); 
var redis_password = require('../db/redis').init();
var config = require('../config/index');
var mailservice = require('../service/mail');
var authCheck = require('../service/authcheck');
//切换数据库,1号数据库是用户登录专用
redis.select('1',function(err,result){
  if(err){
    console.log(error,'change db error');
  }else{
    console.log('redis db open no.1 is ok'); 
  }
})
//修改密码
redis_password.select('2',function(err,result){
  if(err){
    console.log(error,'change db error');
  }else{
    console.log('redis db open no.1 is ok'); 
  }
})
//初始化邮箱发送
var smtpTransport=nodemailer.createTransport(config.mailconfig[0]);
//登录中间件
router.use(authMiddle);

/** *主逻辑
* */
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login',function(req,res){
  var data = req.body;
  
  //输入数据合法性验证
  if(!data.username||!data.password){
    res.json(errorMsg.data_format_error);
    return;
  }
  
  var tmp=authCheck.loginCheck(data.username,data.password);
  if(!tmp){
    res.json(errorMsg.data_format_error);
    return;
  }
  data=tmp;
    
  var md5 = crypto.createHash('md5');
  md5.update('tisan'+data.password+'2015');
  var d = md5.digest('hex');

  User.find({where:{username:data.username}}).then(function(result){
    if(result&&result.dataValues.password==d){
      req.session.user=result.dataValues;
      res.json({
        code:0,
        msg:'login ok',
        data:result
      });
    }else{
      if(result===null){
        res.json(errorMsg.wrong_username)
      }else{
        res.json(errorMsg.wrong_password);
      }
    }
  });
})

router.get('/register',function(req,res){
  res.render('register');
})

/* user register */
router.post('/register', function(req, res) {
  var data = req.body;
  if(!data.username||!data.password){
    res.json(errorMsg.data_format_error);
    return;
  }

  var tmp=authCheck.loginCheck(data.username,data.password);
  if(!tmp){
    res.json(errorMsg.data_format_error);
    return;
  }
  data=tmp;

  var md5_un = crypto.createHash('md5');
  md5_un.update('tisan'+data.username+'2015');
  var un = md5_un.digest('hex');
  
  var md5_pd = crypto.createHash('md5');
  md5_pd.update('tisan'+data.password+'2015');
  var pd = md5_pd.digest('hex');

  User.find({where:{username:data.username}}).then(function(result){
    if(result){
      res.json(errorMsg.user_exist);
      return;
    }else{
      mailservice.redischeck(redis,un,pd,data.username,function(result){
        if(result.code==0){
          mailservice.sendmail(config,smtpTransport,data.username,un,function(result){
            if(result.code==0){
              res.json(errorMsg.mail_send);
            }
          })
        }else if(result.code==1){ 
          res.json(errorMsg.send_mail_many_times);
        }  
      })  
    }
  })
});

router.get('/register/activty/:id',function(req,res){
  redis.get(req.params['id'],function(err,result){
    if(result){
      var data=result.split('_');
      User.create({
        username:data[1],
        password:data[0],
        register_time:Date.parse(new Date())/1000
      }).then(function(userData){
        User.find({where:{username:data[1]}}).then(function(result){
          redis.del(req.params['id']);
          req.session.user=result.dataValues;
          res.redirect('/');
        })
      })     
    }else{
      res.redirect('/');
    }
  })
})

//注销登录
router.get('/logout',function(req,res){
  req.session.user=null;
  res.redirect('/');
})

router.get('/account',function(req,res){
  User.find({where:{id:req.session.user.id}}).then(function(result){
    req.session.user=result.dataValues;
    res.render('account',{
      user:req.session.user,
      navigation:''
    });
  })
})

//更新头像 ### 作废
router.post('/avatar/update',function(req,res){
  User.find({where:{id:req.session.user.id}}).then(function(result){
    result['avatar']=req.body.avatar;
    result.save().then(function(result){
      req.session.user=result.dataValues;
      res.json({
        msg:'ok',
        code:0
      });
    })
  })
})

//密码找回
router.get('/password/rollback',function(req,res){
  res.render('rb_password')
})


//发送邮件 
router.post('/password/rollback',function(req,res){
  //输入数据合法性验证
  if(!req.body.username){
    res.json(errorMsg.data_format_error);
    return;
  }
  var tmp=authCheck.loginCheck(req.body.username,'111111111');
  if(!tmp){
    res.json(errorMsg.data_format_error);
    return;
  }
  User.find({where:{username:req.body.username}}).then(function(result){
    if(!result){
      res.json(errorMsg.wrong_username);
      return;
    } 
    var data=result.dataValues;
    var md5 = crypto.createHash('md5');
    md5.update('tisan'+data.username+'2015');
    var un = md5.digest('hex'),pd='';

    mailservice.redischeck(redis_password,un,pd,data.username,function(result){
      if(result.code==0){
        mailservice.sendPasswordMail(config,smtpTransport,data.username,un,function(result){
          if(result.code==0){
            res.json(errorMsg.mail_send);
          }
        })
      }else if(result.code==1){ 
        res.json(errorMsg.send_mail_many_times);
      }  
    }) 
  }).catch(function(err){
    console.log(err);
  })
})

//新密码设置
router.get('/password/find/:id',function(req,res){
  redis_password.get(req.params['id'],function(err,result){
    if(!result||err){
      res.render('404',{
        navigation:'',
        user:''
      })
      return;
    }else{
      res.render('new_password'); 
    }
  })
})
//修改密码
router.post('/password/find/:id',function(req,res){
  redis_password.get(req.params['id'],function(err,result){
    if(!result||err){
      res.render('404',{
        navigation:'',
        user:''
      })
      return;
    }else{
      User.find({where:{username:result.split('_')[1]}}).then(function(result){
        if(!result){
          res.render('404',{
            navigation:'',
            user:''
          })
          return;
        }else{
          var md5 = crypto.createHash('md5');
          md5.update('tisan'+req.body.password+'2015');
          var d=md5.digest('hex');
          result.password=d;
          return result.save();
        }
      }).then(function(result){
        req.session.user=result.dataValues;
        redis_password.del(req.params['id'],function(err,result){
          res.redirect('/');
        })
      }).catch(function(err){
        console.log(err);
      })
    }
  })
})

//更新用户的个人信息 
router.post('/information',function(req,res){
  var data = req.body,
      p={'telephone':1,'realname':1,'email':1};
  //判断参数的可用性
  for(var i in data){
    if(!p[i]){
      res.json(errorMsg.data_format_error);
      return;
    } 
  }
  
  User.find({where:{id:req.session.user.id}}).then(function(result){
    for(var i in data){
      result[i]=data[i];
    }
    result.save().then(function(result){
      req.session.user=result.dataValues;
      res.json({
        msg:'ok',
        code:0
      });
    })
  })
})

router.get('/opinion', function(req, res){
  res.render('opinion', { 
    user: req.session.user,
    navigation:''
  });
})

router.get('/hardware',function(req,res){
  var setting = req.query.set;
  res.render('hardware_config',{
    user:req.session.user,
    navigation:'',
    error:setting?'setting':''
  });
})
//查看用户所有的设备信息
router.get('/hardware/list',function(req,res){
  var tmp = [];
  Hardware.findAll({where:{user_id:req.session.user.id}}).then(function(result){
    for(var i in result){
      tmp.push(result[i].dataValues);
    }
    res.json({
      code:0,
      msg:'ok',
      data:tmp
    })
  })
})
//添加
router.post('/hardware',function(req,res){
  var tmp={
    name : req.body.name,
    code : req.body.code,
    user_id: req.session.user.id
  };
  Hardware.create(tmp).then(function(result){
    res.json({
      code:0,
      msg:'ok',
      data:result.null
    })
  });
})
//更新
router.put('/hardware/:id',function(req,res){
  Hardware.find({where:{id:req.params['id']}}).then(function(result){
    for(var i in req.body){
      result[i]=req.body[i];
    }
    result.save().then(function(result){
      res.json({
        code:0,
        msg:'ok'
      })
    })
  })
})
//删除
router.delete('/hardware/:id',function(req,res){
  Hardware.destroy({where:{id:req.params['id']}}).then(function(result){
    res.json({
      code:0,
      msg:'ok'
    })
  })
})

function authMiddle(req,res,next){
  if(req.session.user&&(req.path=='/register'||req.path=='/register/wait'||req.path=="/password/find"||req.path=="/password/rollback")){
    res.redirect('/'); 
  }else{
    next();
  }
}


module.exports = router;
