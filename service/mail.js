var nodemailer=require('nodemailer');
var config = require('../config/index');
exports.redischeck=function(redis,un,pd,username,callback){
  redis.get(un,function(err,result){ //如果该账号已经发送了激活邮件
    //查看键的过期时间 
    if(result) {
      redis.ttl(un,function(err,result){
        if(result>60*60*24*3){
          callback({
            code:1,
            msg:'too times'
          });
          return;
        }else{ 
          //�ٴη����ʼ��ͼ�һ�� 
		  redis.expire(un,result+60*60*24,function(err,result){
            callback({
              code:0,
              msg:'ok'
            })
		  })
		 }
        })
    }else{
      redis.set(un,pd+'_'+username,function(err,result){
        redis.expire(un,60*60*24,function(result){
          callback({
            code:0,
            msg:'ok'
          })
        });
      })
    }
  });
}

//发送邮件
exports.sendmail=function(config,smtpTransport,username,un,callback){
  var mailoptions=config.mailoptions;
  mailoptions['to']=username;
  var urlpath=config.host+'/user/register/activty/'+un;
  var html='<h3>欢迎注册tisan开发者帐号</h3>'+
  '<h4>点击一下链接完成注册并激活帐号:</h4>'+
  '<a href=\''+urlpath+'\'>'+urlpath+'</a>'+
  '<h5>如果无法正常跳转，可复制上面的链接并粘贴在浏览器地址栏打开</h5>';
  mailoptions['html']=html
  smtpTransport.sendMail(mailoptions,function(error,response){
    if(error){
      callback({
        code:1,
        msg:'send mail error'
      }) 
    }else{
      callback({
        code:0,
        msg:'ok'
      })
    }
    //此处没有关闭连接,通过smtpTransport.close()关闭
  })
}
//发送密码修改邮件
exports.sendPasswordMail=function(config,smtpTransport,username,un,callback){
  var mailoptions=config.mailoptions;
  mailoptions['to']=username;
  var urlpath=config.host+'/user/password/find/'+un;
  mailoptions['html']='<a href=\''+urlpath+'\'>'+urlpath+'</a>'
  smtpTransport.sendMail(mailoptions,function(error,response){
    if(error){
      callback({
        code:1,
        msg:'send mail error'
      }) 
    }else{
      callback({
        code:0,
        msg:'ok'
      })
    }
    //此处没有关闭连接,通过smtpTransport.close()关闭
  })
}

