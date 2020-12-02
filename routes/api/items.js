const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const models = require("../../models");
const connection = require('../../db');
const moment = require("moment")


/**
 * @route   GET api/items
 * @desc    Get All Items
 * @access  Public
 */

router.get("/user/:id", (req, res) => {
  // 
  models.Item.findAll({ where: { userId: req.params.id } }).then(
    items => {
      var today = []
      var yesterday = []
      var blocker = []
      var beyoundYesturday = []
      var beyoundToday = []
      items.forEach(item => {

        const createdAt = moment(item.createdAt).format("MM/DD/YYYY")
        const date = new Date()
        const now = moment(date.toDateString(), "ddd MMM DD YYYY")
        const diff = now.diff(moment(createdAt), "days")
        console.log(createdAt, now, diff)

        if (item.name === "Blocker") {
          blocker.push(item)
        } else {
          if (diff >= 2) {
            item.name = "BeyoundYesturday"
            beyoundYesturday.push(item)
          } else if (diff == 1) {
            item.name = "Yesterday"
            yesterday.push(item)
          } else if (diff == 0) {
            item.name = "Today"
            today.push(item)
          } else {
            item.name = "BeyoundToday"
            beyoundToday.push(item)
          }
        }
      })

      const Today = today
        .map(val => {
          const item = {
            name: val.name,
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt,
            endAt: val.endAt
          };
          return item;
        })
        .sort((a, b) => a.index - b.index);

      const BeyoundYesturday = beyoundYesturday
        .map(val => {
          const item = {
            name: val.name,
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt,
            endAt: val.endAt
          };
          return item;
        }).sort((a, b) => a.index - b.index);

      const BeyoundToday = beyoundToday
        .map(val => {
          const item = {
            name: val.name,
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt,
            endAt: val.endAt
          };
          return item;
        }).sort((a, b) => a.index - b.index);

      const Yesterday = yesterday
        .map(val => {
          const item = {
            name: val.name,
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt,
            endAt: val.endAt
          };
          return item;
        })
        .sort((a, b) => a.index - b.index);

      const Blocker = blocker
        .map(val => {
          const item = {
            name: val.name,
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt,
            endAt: val.endAt
          };
          return item;
        })
        .sort((a, b) => a.index - b.index);

      const itemObj = {
        Items: {
          Yesterday,
          Today,
          Blocker,
          BeyoundYesturday,
          BeyoundToday
        }
      };
      return res.json(itemObj);
    });
});


router.get("/user/Yesterday/:id", (req, res) => {
  // 
  models.Item.findAll({ where: { userId: req.params.id } }).then(
    items => {
   
      var yesterday = []
      
      items.forEach(item => {

        const createdAt = moment(item.createdAt).format("MM/DD/YYYY")
        const date = new Date()
        const now = moment(date.toDateString(), "ddd MMM DD YYYY")
        const diff = now.diff(moment(createdAt), "days")
        console.log(createdAt, now, diff)

        if (diff == 1) {
            item.name = "Yesterday"
            yesterday.push(item)
          } 
        }
      )
      const Yesterday = yesterday
        .map(val => {
          const item = {
            name: val.name,
            text: val.text,
            isCompleted: val.isCompleted,
            id: val.id,
            index: val.index,
            createdAt: val.createdAt,
            endAt: val.endAt
          };
          return item;
        })
        .sort((a, b) => a.index - b.index);

  

      return res.json(Yesterday);
    });
});
 
/**
 * @route   POST api/items
 * @desc    Create An Item
 * @access  Private
 */

router.post("/", auth, (req, res) => {
  connection.sync().then(() => {
    models.Item.create(
      req.body
    ).then(item => {
      res.json(item)
    }
    )
  });
});

/**
 * @route   DELETE api/items/:id
 * @desc    Delete A Item
 * @access  Private
 */

router.delete("/:id", auth, (req, res) => {
  models.Item.destroy({ where: { id: req.params.id } }).then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ msg: "Failed to delete" }));
});

router.patch("/:id", auth, (req, res) => {
  const id = { id: req.body.id };
  models.Item.update(req.body, { where: id })
    .then((item) => {
      res.json(item)
    })
    .catch(err => res.status(404).json({ msg: "Failed to update" }));
});

module.exports = router;
