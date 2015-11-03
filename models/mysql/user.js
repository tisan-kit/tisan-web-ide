var Sequelize = require("sequelize");
var DbSequelize = require("../../db/mysql.js");//todo path

var User = DbSequelize.define("tbl_user",{
  "id": { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  "email": { type: Sequelize.CHAR(500)},

  "nickname": { type: Sequelize.CHAR(100)},
  "realname": { type: Sequelize.CHAR(100)},
  "avatar": { type: Sequelize.CHAR(100)},
  "username": { type: Sequelize.CHAR(100)},
  "password": { type: Sequelize.CHAR(100)},

  "sex": { type: Sequelize.CHAR(1)},
  "telephone": {type: Sequelize.INTEGER},

  "province": { type: Sequelize.CHAR(100)},
  "city": { type: Sequelize.CHAR(100)},
  "register_time": { type: Sequelize.INTEGER},
  "age": { type: Sequelize.INTEGER},
  "birthday": { type: Sequelize.INTEGER}, 
  "hardwarekey": { type: Sequelize.CHAR(3000)},
},{
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: "tbl_user"
});
exports.User = User; 
