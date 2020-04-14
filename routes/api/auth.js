const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");
const myUser = require("../../models/myUser");

//This is for the login page to auth the user and give accses
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  myUser.findOne({ where: { email } }).then((user) => {
    if (user === null)
      return res.status(400).json({ msg: "User Does not exsists" });
    // comparing the password you wrote and the hash password in the db
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      jwt.sign({ id: user.id }, config.get("jwtSecret"), (err, token) => {
        console.log("token from jwt sign", token);
        if (err) throw err;
        console.log(token, user);
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      });
    });
  });
});

router.get("/user", auth, (req, res) => {
  console.log(req.user.id);
  // send the user information without the password
  // use attribuite to remove the password then return the user at the promise
  myUser
    .findOne({
      attributes: { exclude: ["password"] },
      where: { id: req.user.id },
    })
    .then((user) => {
      console.log("CHECK HERE_+_+_+_+_+_+_", user);
      res.json(user);
    });
});

module.exports = router;
