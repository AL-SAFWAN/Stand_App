const connection = require("../db");
const Sequelize = require("sequelize");

  var standupDate = connection.define(
  "standupDate", 
  {
    start: Sequelize.DATE,
    end:  Sequelize.DATE,
});

standupDate.associate= models => {
    standupDate.belongsTo(models.myUser, {foreignKey: "userId"})
}

module.exports = standupDate;



