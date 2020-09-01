const Sequelize = require("sequelize")
const connection = require("../db")

const models = {
    myUser : require("./myUser"),
    Item : require("./item"),
    note: require("./note"),
    supportDate: require("./supportDate"),
    standupDate: require("./standupDate")
}

Object.keys(models).forEach((modelName)=> {
    if('associate' in models[modelName]){
        models[modelName].associate(models)
    }
} )

module.exports = models