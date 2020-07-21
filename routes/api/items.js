const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const models = require("../../models");
const connection = require('../../db');
const moment = require("moment")



router.get("/user/:id", (req, res) => {
  // 
  models.Item.findAll({ where: { userId: req.params.id } }).then(
    items => {
      var today =[]
      var yesterday = []
      var blocker = [] 
      var beyoundYesturday = []
      items.forEach(item => {

        const createdAt = moment(item.createdAt.toLocaleString('en-GB', { timeZone: 'UTC' }), "MM/DD/YYYY")
        const now = moment()
        console.log(createdAt, createdAt.toDate(), now.toDate())
       if(item.name === "Blocker"){
         blocker.push(item)
       }else 
       {
        if(now.diff(createdAt, "days") >=2){
          item.name = "BeyoundYesturday"
          beyoundYesturday.push(item)
        }else if(now.diff(createdAt, "days") ==1){
          item.name ="Yesterday"
          yesterday.push(item)
        } else{
          item.name ="Today"
          today.push(item)
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

       const BeyoundYesturday =  beyoundYesturday
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
          BeyoundYesturday
        }
      };
      return res.json(itemObj);
    }); 
});

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

router.delete("/:id", auth, (req, res) => {
  models.Item.destroy({ where: { id: req.params.id } }).then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ msg: "Failed to delete" }));
});

router.patch("/:id", auth, (req, res) => {
  const id = { id: req.body.id };
  models.Item.update(req.body, { where: id })
    .then((item) => { 
      res.json(item)})
    .catch(err => res.status(404).json({ msg: false }));
});

module.exports = router;
