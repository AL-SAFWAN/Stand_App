const Sequelize = require("sequelize");

 const connection = new Sequelize("standapp_schema", "root", "safwan", {
    dialect: "mysql",
  });

  module.exports=  connection;   