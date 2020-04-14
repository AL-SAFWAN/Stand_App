const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  register_date: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", UserSchema);
console.log("here from user model", User);
module.exports = User;

//This is exporting the user model


