const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const models = require("../../models");
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
      models.myUser
        .findOne({
          where: { email: email },
        })
        .then((users) => {
          if (users != null)
            return res.status(400).json({ msg: "User already exsists" });
        });

      // check the validation
      models.myUser.validationFailed((i, o, e) => {
        e.errors.forEach((e) => {
          return res.status(400).json({ msg: e.message });
        });
      });

      models.myUser.beforeCreate(async (user, options) => {
        // the password seemed to be created twice 
        if(user["_previousDataValues"].password ==undefined ) {
        const hash = await bcrypt.hashSync(user.password);
        user.password = hash;
      } 
        
      });

      models.myUser.create({ name, email, password }).then((user) => {
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
