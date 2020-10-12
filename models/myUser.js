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
          msg: "password must be above 6 chars and less that 14",
        },
      },
    },
    accountType: {
      type: Sequelize.INTEGER,
    },
    apiKey: {
      type: Sequelize.BOOLEAN,
    },
    filePath:
    {type:  Sequelize.STRING}
  }
);

myUser.associate= models => {
  myUser.hasMany(models.Item)
  myUser.hasOne(models.supportDate)
  myUser.hasOne(models.standupDate)
}

module.exports = myUser;
