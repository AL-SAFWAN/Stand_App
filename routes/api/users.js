const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const models = require("../../models");
const connection = require("../../db");

router.post("/", (req, res) => {
  let { name, email, password, filePath,accountType } = req.body;
  // might want to use hooks to crpyt the pass
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }
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
        if (user["_previousDataValues"].password == undefined) {
          const hash = await bcrypt.hashSync(user.password);
          user.password = hash;
        }
      });
      models.myUser.create({ name, email, password, filePath,accountType, supportType: 0, }).then((user) => {

        jwt.sign({ id: user.id }, config.get("jwtSecret"), (err, token) => {
          if (err) throw err;
          // sends a responce to the client side with the token and user information
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              filePath: user.filePath,
              accountType: user.accountType
            },
          });
        });
      });
    })
    .catch((err) => console.log("the error form mysql", err));
});

router.patch("/userDetails", (req, res) => {
  let { name, email, filePath, id } = req.body;

  if (!name || !email) {
    return res.status(400).json({ msg: "please enter the username and email fields" });
  }

  connection
    .sync()
    .then(() => {
      models.myUser
        .findOne({
          where: { email: email },
        })
        .then((users) => {
          if (users != null)
            return res.status(400).json({ msg: "User email already exists" });

        });

      // check the validation
      models.myUser.validationFailed((i, o, e) => {
        e.errors.forEach((e) => {
          return res.status(400).json({ msg: e.message });
        });
      });

      models.myUser.update({ name, email, filePath }, { where: { id: id } }).then((user) => {
        // sends a responce to the client side with the token and user information
        console.log("this is the user?", user)
        res.json({
          user: {
            id: id,
            name: name,
            email: email,
            filePath: filePath
          },
        });
      });
    })
    .catch((err) => console.log("the error form mysql", err));
});


router.patch("/userPassword", (req, res) => {
  let { password, id } = req.body;
  // might want to use hooks to crpyt the pass
  if (!password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  connection
    .sync()
    .then(() => {

      // check the validation
      models.myUser.validationFailed((i, o, e) => {
        e.errors.forEach((e) => {
          return res.status(400).json({ msg: e.message });
        });
      });

     models.myUser.beforeUpdate(async (user, options) => {
        // the password seemed to be created twice 

        console.log(" I AM LOOKING TO SEE THE PASSWORD HASH HERE OR EVENT BEING CALLED \n\n", user)
        const hash = await bcrypt.hashSync(user.password);
        user.password = hash;
        console.log( "",user.password)

      });

      models.myUser.update({ password }, { where: { id: id },individualHooks: true }).catch(err => {
        return res.status(400).json({ msg: "Could not change password" });
      })

   

})
  .catch((err) => console.log("the error form mysql", err));
});


module.exports = router;
