const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const models = require("../../models");
const connection = require('../../db')



router.get("/user/:id", (req, res) => {
  // 
  models.Item.findAll({ where: { userId: req.params.id } }).then(
    items => {
      const Today = items
        .filter(val => val.name === "Today")
        .map(val => {
          const item = {
            name: val.name,
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt
          };
          return item;
        })
        .sort((a, b) => a.index - b.index);

      const Yesterday = items
        .filter(val => val.name === "Yesterday")
        .map(val => {
          const item = {
            text: val.text, 
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index, 
            createdAt: val.createdAt
          };
          return item;
        })
        .sort((a, b) => a.index - b.index);
        
      const Blocker = items
        .filter(val => val.name === "Blocker")
        .map(val => {
          const item = {
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt
          };
          return item;
        })
        .sort((a, b) => a.index - b.index);

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
  connection.sync().then(() => {
    models.Item.create({
      name: req.body.name,
      text: req.body.text,
      isCompleted: req.body.isCompleted,
      index: req.body.index,
      userId: req.body.userId
    }).then(item => {
      res.json(item)
    }
    )
  });
});

router.delete("/:id", auth, (req, res) => {
  models.Item.destroy({ where: { id: req.params.id } }).then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ msg: "Failed to delete" }));
});

router.patch("/:id", auth, (req, res) => {
  const id = { id: req.body.id };
  models.Item.update(req.body, { where: id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
