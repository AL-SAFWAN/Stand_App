const express = require("express");
const http = require("http");
const socketIo = require("socket.io")
const fileUpload = require("express-fileupload")

const app = express();
const server = http.createServer(app)
const io = socketIo(server)

const models = require("./models");
const connection = require("./db");
const { request } = require("express");


// used for pulling data from the backend
app.use(express.json());
app.use(fileUpload())
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/notes", require("./routes/api/notes"));
app.use("/api/standupDates", require("./routes/api/standupDates"));
app.use("/api/supportDates", require("./routes/api/supportDates"));

// Image upload end point 
app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: "no image uploaded " })
    }
    const file = req.files.file
    console.log("in file call", file)
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
    })
})
// socket end point 
const users = []
const result = []

io.on("connection", socket => {
    console.log("-----start------\n")
    console.log("Connection has been made")
    console.log("---------------------\n")

    socket.on('join', (user) => {
        // if its a new user
        if (users.indexOf(user.userId) == -1) {
            // get the users list of completed toDo's
            connection.query(`select sum(isCompleted =1)as done,sum(isCompleted =0)as notDone from standapp.items where userId = ${user.userId} and date(createdAt) = current_date()`)
                .then(([results, metadata]) => {
                    console.log(results[0], "<-----result------\n,")
                    //add the information to the user array 
                    users.push(user.userId)
                    result.push({ id: user.userId, name: user.name, result: results[0] })
                }).then(() => {
                    io.emit("users", result)
                    console.log(users, "<-----User List------\n")
                    console.log(result, "<-----result List------\n")

                })

        } else {
            console.log("---------------------\n")
            console.log("the same user has connected ")
            console.log("---------------------\n")
            io.emit("users", result)
        }
        // need a logout? to remove the user
    })


    socket.on("getAllUser", (cb) => {
        connection.query("SELECT name,id,filePath from standapp.users")
            .then(([results, metadata]) => {
                console.log(results, "<-----results of select name ------\n,")
                const users = [...results]
                const newArray = []
                users.forEach((user, i) => {
                    connection.query(`select sum(isCompleted =1)as done,sum(isCompleted =0)as notDone from standapp.items where userId = ${user.id} and date(createdAt) = current_date()`)
                        .then(([results, metadata]) => {
                            newArray.push({ name: user.name, filePath: user.filePath, result: results[0] })
                            if ((users.length - 1) === i) {
                                console.log("new array ->", newArray)
                                cb(newArray)
                            }
                        }
                        )
                })
            })
    })

    socket.on("getAllActiveUser", (cb) => {
        connection.query(" SELECT users.id,users.name,users.filePath FROM standapp.items  join standapp.users on items.userId = users.id where date(items.createdAt) = current_date() group by users.name")
            .then(([results, metadata]) => {
                console.log(results, "<-----results of select active name ------\n,")

                const users = [...results]
                const newArray = []

                users.forEach((user, i) => {
                    connection.query(`select sum(isCompleted =1)as done,sum(isCompleted =0)as notDone from standapp.items where userId = ${user.id} and date(createdAt) = current_date()`)
                        .then(([results, metadata]) => {

                            newArray.push({ name: user.name, filePath: user.filePath, result: results[0] })

                            if ((users.length - 1) === i) {
                                console.log("new array ->", newArray)
                                cb(newArray)

                            }
                        }
                        )
                })
            })
    })


    // listening on items. i toDp from the client
    // then update the backend result array 
    // which is then sent back to update everything 

    // this update should happen in user display
    socket.on("item", (item) => {
        const { userId, isCompleted } = item

        console.log("ITEMS--->", userId, isCompleted)

        result.forEach(user => {
            if (user.id === userId) {
                user.result = isCompleted
            }
        })
        io.emit("users", result)

    })
    socket.on("disconnect", () => {
        console.log("-----SOCKET------\n")
        console.log("User SOCKET has left")
        console.log("---------\n")
    })

})



const port = process.env.PORT || 5000;

server.listen(port, () => console.log("server started on port :" + port))


// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
// env file is not working for me ?? 
// need to look into it more 
const appy = new App({
    token: "xoxb-4249473565-1436504183284-5YvkBmPc5AT6IxztFd7j84iD",
    signingSecret: "df8904bd1b81faa5bcee6db100d6ef8a"
});



// All the room in the world for your code
appy.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
  });
  


(async () => {
    // Start your app
    await appy.start(process.env.PORT || 3030);

    console.log('⚡️ Bolt app is running on 3030! ');
})();



// === this will load all the users will there name 
// SELECT name from standapp.users

// ----------------------------------------------------------------------------

// === this will return all active users for today 

// SELECT users.id,users.name, items.isCompleted, items.createdAt
// FROM standapp.items 
// inner join standapp.users on items.userId = users.id 
// where date(items.createdAt) = current_date()

// ----------------------------------------------------------------------------

//This will get the users done and not done for today 

// pass in user ID
// `select sum(isCompleted =1)as done,sum(isCompleted =0)as notDone from standapp.items where userId = ${user.userId} and date(createdAt) = current_date()`