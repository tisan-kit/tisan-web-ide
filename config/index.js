var jsonconf = require("jsonconf");
var path = require("path");

var f = path.join(__dirname,"./deploy.json");
var  conf = jsonconf.parse(f);
console.log(conf);
module.exports = conf;
