const Sequelize = require("sequelize");

 const connection = new Sequelize("standapp", "root", "safwan", {
    dialect: "mysql",
  });

  module.exports=  connection; 