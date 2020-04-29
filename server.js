const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const connection = require("./db");
const Item = require("./models/item");
const db = config.get("mongoURI");
const models = require("./models")
const app = express();


// the information from the user is being import and used

app.use(express.json());

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err));

app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

// console.log(items)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server statered on port :" + port));
