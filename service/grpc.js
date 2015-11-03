var grpc = require('grpc');
var product_grpc = grpc.load(__dirname+'/../models/rpc/product.proto').pb;
var config = require('../config/index');
var client = new product_grpc.ProductCMDS(config.grpc[0],grpc.Credentials.createInsecure());

exports.readProduct=function(userList,callback){
  client.readProduct(userList,function(err,result){
    callback(result);
  })  
}
exports.createProduct=function(product,callback){
  client.createProduct(product,function(err,result){
    callback(result);
  })  
}
exports.deleteProduct=function(idList,callback){
  client.deleteProduct(idList,function(err,result){
    callback(result);
  })  
}
exports.updateProduct=function(product,callback){
  client.updateProduct(product,function(err,result){
    callback(result);
  })  
}
