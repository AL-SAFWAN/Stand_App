const connection = require("../db");
const Sequelize = require("sequelize");

var myUser = connection.define(
  "user",

  {
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: {
        args: true,
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Please enter the correct format",
        },
      },
    },
    password: {
      type: Sequelize.TEXT,
      validate: {
        len: {
          args: [6, 14],
          msg: "passward must be above 6 chars and less that 14",
        },
      },
    },
  }
);

myUser.associate= models => {
  myUser.hasMany(models.Item)
}

module.exports = myUser;
