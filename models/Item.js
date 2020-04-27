const connection = require("../db");
const Sequelize = require("sequelize");
const user= require("./myUser")
var Item = connection.define(
  "item", 
  {
  name: Sequelize.STRING,
  text: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN,
  index: Sequelize.INTEGER
});

module.exports = Item;
