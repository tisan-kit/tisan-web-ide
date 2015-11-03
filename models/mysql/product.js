var Sequelize = require("sequelize");
var DbSequelize = require("../../db/mysql.js");//todo path

var Product = DbSequelize.define("tbl_product",{
  "id": { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  "user_id": { type: Sequelize.INTEGER(11)},
  "product_id": { type: Sequelize.INTEGER(11)},
  "name": { type: Sequelize.CHAR(100)},
  "descript": { type: Sequelize.CHAR(100)},
  "avatar": { type: Sequelize.CHAR(100)},
  "objects": { type: Sequelize.CHAR(5000)},
  "commands": { type: Sequelize.CHAR(2000)},
  "events": { type: Sequelize.CHAR(1000)}
},{
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: "tbl_product"
});
exports.Product = Product; 
