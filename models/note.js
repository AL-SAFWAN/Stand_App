const connection = require("../db");
const Sequelize = require("sequelize");

  var note = connection.define(
  "note", 
  {
  text: Sequelize.TEXT,
});

note.associate= models => {
    note.belongsTo(models.Item,{foreignKey: "itemId"})
}

module.exports = note;



