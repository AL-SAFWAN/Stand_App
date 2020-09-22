const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/notes", require("./routes/api/notes"));

app.use("/api/standupDates", require("./routes/api/standupDates"));

app.use("/api/supportDates", require("./routes/api/supportDates"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server statered on port :" + port));
 