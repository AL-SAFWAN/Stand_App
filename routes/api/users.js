const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const myUser = require("../../models/myUser");
const connection = require("../../db");

router.post("/", (req, res) => {
  let { name, email, password } = req.body;
  // might want to use hooks to crpyt the pass

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }
  const salt = bcrypt.genSaltSync();
  connection
    .sync()
    .then(() => {
      // throw the error on this if the contraints are wrong
      myUser
        .findAll({
          where: { email: email },
        })
        .then((users) => {
          if (users[0] != null)
            return res.status(400).json({ msg: "User already exsists" });
        });
      // check the validation
      myUser.validationFailed((i, o, e) => {
        e.errors.forEach((e) => {
          console.log(e.message);
          console.log("VALIDATION IS DONE");
          return res.status(400).json({ msg: e.message });
        });
      });

      myUser.afterValidate(async (user, options) => {
        user.password = bcrypt.hashSync(user.password, salt);
        console.log("HASED? ", user);
      });

      myUser.create({ name, email, password }).then((user) => {
        console.log("password during create", password);
        jwt.sign({ id: user.id }, config.get("jwtSecret"), (err, token) => {
          if (err) throw err;
          // sends a responce to the client side with the token and user information
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
    })
    .catch((err) => console.log("the error form mysql", err));
});

module.exports = router;
