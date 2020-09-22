
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const models = require("../../models");
const connection = require('../../db');
const moment = require("moment")

router.get("/dates", (req, res) => {
    models.standupDate.findAll({where :{userId: req.params.id}}).then(
        dates => {
            return res.json(dates)
        }
    ).catch(err => {res.json("no notes")} )
});


router.post("/", (req, res) => {
    connection.sync().then(() => {
      console.log(req.body, "from the post in notes")
      models.standupDate.create(
        req.body
      ).then(note => {
        res.json(note)
      }
      )
    });
  });

  router.delete("/:id",  (req, res) => {
    models.standupDate.destroy({ where: { id: req.params.id } }).then(() => res.json({ success: true }))
      .catch(err => res.status(404).json({ msg: "Failed to delete" }));
  });
  
  router.patch("/:id",  (req, res) => {
    console.log(req,body)
    models.standupDate.update(req.body, { where:{ id: req.params.id}  })
      .then((item) => { 
        res.json(item)})
      .catch(err => res.status(404).json({ msg: false }));
  });

module.exports = router;