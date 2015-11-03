var Sequelize = require("sequelize");
var DbSequelize = require("../../db/mysql.js");//todo path

var Hardware = DbSequelize.define("tbl_hardware",{
  "id": { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  "name": { type: Sequelize.CHAR(255)},
  "user_id": { type: Sequelize.INTEGER(11)},
  "code": { type: Sequelize.CHAR(50)},
},{
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: "tbl_hardware"
});
exports.Hardware= Hardware; 
