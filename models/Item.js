const connection = require("../db");
const Sequelize = require("sequelize");

  var item = connection.define(
  "item", 
  {
  name: Sequelize.STRING,
  text: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN,
  index: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  endAt:  Sequelize.DATE
});

item.associate= models => {
  item.belongsTo(models.myUser, {foreignKey: "userId"})
  item.hasOne(models.note)
}

module.exports = item;



