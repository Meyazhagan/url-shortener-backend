const jwt = require("jsonwebtoken");
const User = require("../model/user");
const config = require("config");

const authVerify = async (req, res, next) => {
  try {
    // getting auth token from header and verifying
    const token = req.headers.auth_token;
    const token_payload = jwt.verify(token, config.get("screteKey"));
    // checking for user is valid
    const user = await User.findById(token_payload?.id);
    if (!user) return res.status(404).send({ message: "User is Not  Found" });
    req.user = user;
    // moving to next middleware
    next();
  } catch (err) {
    return res.status(400).send({ message: "Invalid Token" });
  }
};

module.exports = authVerify;
