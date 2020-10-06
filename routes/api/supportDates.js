const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const models = require("../../models");
const connection = require('../../db');
const moment = require("moment")

router.get("/", (req, res) => {
  models.supportDate.findAll({
    attributes: { exclude: ["createdAt","updatedAt"] },
    include: {
      model: models.myUser,
      attributes: { exclude: ["accountType","createdAt","updatedAt","isStandup","email","password"] }
    }
    }).then(
      dates => {
        let formatedArr =[]
        dates.forEach(date => {
          console.log(date.dataValues.user)
          let formatedObj ={
            id: date.dataValues.id,
            start: moment( date.dataValues.start).local().format("YYYY-MM-DD"),
            end:moment(date.dataValues.end).local().format("YYYY-MM-DD"),
            name: date.dataValues.user.dataValues.name,
            userId: date.dataValues.user.dataValues.id,
            supportType: date.dataValues.supportType
          }
          formatedArr.push(formatedObj)
        });
        console.log(formatedArr)
        return res.json(formatedArr)
      }
    ).catch(err => { res.json("no notes") })
});


router.post("/", (req, res) => {
  connection.sync().then(() => {
    console.log(req.body, "from the post in notes")
    models.supportDate.create(
      req.body
    ).then(date => {
    let formatedObj ={
      id: date.dataValues.id,
      name:req.body.name,
      start: moment( date.dataValues.start).local().format("YYYY-MM-DD"),
      end:moment(date.dataValues.end).local().format("YYYY-MM-DD"),
      userId: date.userId,
      supportType: date.dataValues.supportType
    }
    console.log(formatedObj)
      res.json(formatedObj)
    }
    )
  });
});

router.delete("/:id", (req, res) => {
  models.supportDate.destroy({ where: { id: req.params.id } }).then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ msg: "Failed to delete" }));
});

router.patch("/:id", (req, res) => {

  console.log(req.body)

  models.supportDate.update(req.body, { where: {id:req.params.id} })
    .then((item) => {
      res.json(item)
    })
    .catch(err => res.status(404).json({ msg: false }));
});

module.exports = router;