const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const Item = require("../../models/Item");

router.get("/", (req, res) => {
  Item.find().then(items => {
    const Today = items
      .filter(val => val.name === "Today")

      .map(val => {
        const item = {
          name: val.name,
          text: val.text,
          isCompleted: val.isCompleted,
          ID: val.ID,
          index: val.index
        };
        return item;
      })
      .sort((a,b)=> a.index-b.index);      

    const Yesterday = items
      .filter(val => val.name === "Yesterday")
      .map(val => {
        const item = {
          text: val.text,
          isCompleted: val.isCompleted,
          ID: val.ID,
          index: val.index
        };
        return item;
      })
      .sort((a,b)=> a.index-b.index);

    const Blocker = items
      .filter(val => val.name === "Blocker")
      .map(val => {
        const item = {
          text: val.text,
          isCompleted: val.isCompleted,
          ID: val.ID,
          index: val.index
        };
        return item;
      })
      .sort((a,b)=> a.index-b.index);
    const itemObj = {
      Items: {
        Yesterday,
        Today,
        Blocker
      }
    };

    return res.json(itemObj);
  });
});
router.post("/", auth, (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    text: req.body.text,
    isCompleted: req.body.isCompleted,
    index: req.body.index,
    ID: req.body.ID
  });

  newItem.save().then(item => res.json(item));
});

router.delete("/:id",auth, (req, res) => {
  Item.findOneAndDelete({ ID: req.params.id })
    .exec()
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ msg: "Failed to delete" }));
});

router.patch("/:id", auth, (req, res) => {
  const id = { ID: req.body.ID };

  Item.updateOne(id, req.body)
    .exec()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
