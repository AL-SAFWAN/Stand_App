const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");
const models = require("../../models");

//This is for the login page to auth the user and give accses


/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  models.myUser.findOne({ where: { email } }).then((user) => {

    if (user === null)
      return res.status(400).json({ msg: "User Does not exists" });
    bcrypt.compare(password, user.password).then((isMatch) => {

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      jwt.sign({ id: user.id }, config.get("jwtSecret"), (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            filePath: user.filePath
          },
        });
      });
    });
  });
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get("/user", auth, (req, res) => {
  models.myUser
    .findOne({
      attributes: { exclude: ["password"] },
      where: { id: req.user.id },
    })
    .then((user) => {
      res.json(user);
    });
});

router.get("/key/:id", (req, res) => {
 
  models.myUser
    .findOne({
      attributes: { exclude: ["password", "createdAt", "updatedAt", "email","name"]  },
      where: { id: req.params.id },
    })
    .then((user) => {
      res.json(user);
    });
});

router.patch("/update/:id", (req, res) => {

  models.myUser.update(req.body, { where: {id:req.params.id} })
    .then((item) => {
      res.json(item)
    })
    .catch(err => res.status(404).json({ msg: "Failed to update" }));
});

router.get("/users", (req, res) => {
  models.myUser
    .findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt", "email"] },
    })
    .then((users) => {
    res.json({ users});
    });
    
});

module.exports = router;

     
      // var userCnt = 0
    // users.forEach(user => {
        
    //     // user is called here 
    //     models.Item.findAll({ where: { userId: user.id } }).then(
    //       items => {
    //        