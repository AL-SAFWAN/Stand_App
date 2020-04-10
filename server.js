const  express =require('express') 
const mongoose =require('mongoose') 
const bodyParser =require('body-parser') 
const config = require('config')
const Sequelize = require("sequelize")

const db =config.get("mongoURI") 


const app = express();

const connection = new Sequelize('standapp_schema', 'root','safwan', {
    dialect: 'mysql'})
  
var User = connection.define('user',{
    username: Sequelize.STRING,
    email: {type : Sequelize.STRING, unique : true},
    password: Sequelize.STRING
})

connection.sync().then(()=> {
    User.create({
        username: "testUserName",
        email: "test@test.com",
        password: "test123."
    })
})

app.use(express.json()) 

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then(()=> console.log("connected to mongoDB"))
.catch((err)=> console.log(err))

app.use('/api/items', require('./routes/api/items'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
// console.log(items)

const port = process.env.PORT || 5000

app.listen(port, ()=> console.log('server statered on port :' +port ))

