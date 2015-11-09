var Sequelize = require("sequelize");
var DbSequelize = require("../../db/mysql.js");//todo path

var Objects = DbSequelize.define("tbl_object",{
  "id": { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  "name": { type: Sequelize.CHAR(100)},
  "c_code": { type: Sequelize.CHAR(1000)},
  "status": { type: Sequelize.CHAR(5000)},
  "label": { type: Sequelize.CHAR(100)},
  "is_public": { type: Sequelize.INTEGER},
  "user_id":{type:Sequelize.INTEGER},
  "delete":{type:Sequelize.CHAR(2)},
},{
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: "tbl_object"
});
exports.Objects = Objects; 
