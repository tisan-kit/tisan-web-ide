var redis = require('redis');
var config = require('../config/index').redis;

//TODO 连接数量控制
exports.init=function(address){
  if(!address){
    address={}
  }
  var client = redis.createClient(address.port || config.port,address.host || config.host);
  client.get('connecting-test',function(result){
    if(result===null){
      console.log('redis server connected at host : '+config.host+',port : '+config.port);
    }
  })
  return client;
}
