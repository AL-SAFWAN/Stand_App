const express = require("express");
const router = express.Router();

const connection = require('../../db');
const auth = require("../../middleware/auth");
const models = require("../../models");

//This is for the login page to auth the user and give accses



router.post("/supportDate", auth, (req, res) => {
    connection.sync().then(() => {
        models.supportDate.create(
            req.body
        ).then(date => {
            res.json(date)
        }
        )
    });
});

router.post("/standupDate", auth,(req, res) => {
    connection.sync().then(() => {
        models.standupDate.create(
            req.body
        ).then(date => {
            res.json(date)
        }
        )
    });

});

router.get("/supportDates", (req, res) => {
    models.supportDate.findAll()
        .then((dates) => {
            res.json({ dates });
        });
});

router.get("/standupDates", (req, res) => {

    models.standupDate
        .findAll()
        .then((dates) => {
            res.json({ dates });
        });

});

module.exports = router;

