const connection = require("../db");
const Sequelize = require("sequelize");

  var supportDate = connection.define(
  "supportDate", 
  {
    start: Sequelize.DATE,
    end:  Sequelize.DATE,
    supportType: {
      type: Sequelize.INTEGER,
    },
});

supportDate.associate= models => {
    supportDate.belongsTo(models.myUser, {foreignKey: "userId"})
}

module.exports = supportDate;



