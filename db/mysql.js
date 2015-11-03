var Sequelize = require("sequelize");
var config = require("../config/index").mysql;

var sequelize = new Sequelize(
  config.database, 
  config.user, 
  config.password, 
  { 
    host: config.host,
    port: config.port,
    //dialect: 'mysql',
    pool: { maxConnections: 5, maxIdleTime: 30},
    sync: { force: true }
  }
);

module.exports = sequelize;
