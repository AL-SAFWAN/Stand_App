const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const models = require("../../models");
const connection = require('../../db');
const note = require("../../models/note");






router.get("/:id", (req, res) => {
    models.note.findOne({where :{itemId: req.params.id}}).then(
        note => {
            return res.json(note)
        }
    ).catch(err => {res.json("no notes")} )
});

router.post("/", (req, res) => {
    connection.sync().then(() => {
      console.log(req.body, "from the post in notes")
      models.note.create(
        req.body
      ).then(note => {
        res.json(note)
      }
      )
    });
  });

  router.delete("/:id",  (req, res) => {
    models.note.destroy({ where: { id: req.params.id } }).then(() => res.json({ success: true }))
      .catch(err => res.status(404).json({ msg: "Failed to delete" }));
  });
  
  router.patch("/:id",  (req, res) => {
    const id = { itemId: req.body.itemId };
    console.log(req.body)
    models.note.update(req.body, { where: id })
      .then((item) => { 
        res.json(item)})
      .catch(err => res.status(404).json({ msg: false }));
  });

module.exports = router;
