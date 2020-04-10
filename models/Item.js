const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: String,
  text: String,
  isCompleted: Boolean,
  index: Number, 
  ID: String,
  date: {
    type: Date,
    default: Date.now()
  }
});

const Item = mongoose.model("item", ItemSchema);
module.exports = Item;
