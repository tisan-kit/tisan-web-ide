var fs = require('fs');

var finalConfig={};
if(fs.existsSync(__dirname+'/deploy.json')){
  finalConfig = require('./depoy.json')
    if(!finalConfig['env']&&finalConfig['env']==='development'){
      finalConfig['env']='development';
    }
}else{
  console.error('Can\'t find deploy config file in ./config');
  process.exit(0);
}

console.log(finalConfig);

module.exports=finalConfig;

