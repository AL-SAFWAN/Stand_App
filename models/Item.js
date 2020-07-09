const connection = require("../db");
const Sequelize = require("sequelize");

  var item = connection.define(
  "item", 
  {
  name: Sequelize.STRING,
  text: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN,
  index: Sequelize.INTEGER,
  createdAt: {
    type: Sequelize.DATE
  },
  endAt: {
    type: Sequelize.DATE
  }

});

item.associate= models => {
  item.belongsTo(models.myUser, {foreignKey: "userId"})
}

module.exports = item;



