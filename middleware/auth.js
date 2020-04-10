const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  console.log("---IN AUTH--")

  const token = req.header("x-auth-token");
  console.log("token =>", token)

  if (!token)  return res.status(401).json({ msg: "No token, auth denied " });
  

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;

    next();
  } catch (e) { res.status(400).json({ msg: "Token is not valid" });
  }
}

console.log("---out AUTH--")
module.exports = auth;
