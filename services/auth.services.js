const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const User = require("../model/user");
const validator = require("../shared/userJoiValidation");
const sendMail = require("../shared/mailServices");

const login = async (req, res, next) => {
  // Body Validation
  const { error, value } = validator("login", req.body);
  if (error) return res.status(406).send({ message: error.message });

  // Check Email is registered
  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(400).send({ message: "Invalid Email ID" });

  if (user.resetToken)
    return res.status(400).send({
      message: "Reset password is in progress... Try login with new password",
    });

  if (!user.verified)
    return res.status(400).send({
      message: "Email Verification is pending...",
    });

  // Hashing Password
  const isValid = await bcrypt.compare(value.password, user.password);
  if (!isValid)
    return res.status(401).send({ message: "Invalid Email ID or Password" });

  // Creating an token
  const token = jwt.sign(
    { id: user._id, username: user.firstName },
    config.get("screteKey"),
    {
      expiresIn: "1d",
    }
  );
  // sending the response
  res.send({ token });
};

const register = async (req, res, next) => {
  // Body Validation
  const { error, value } = validator("register", req.body);
  if (error) return res.status(406).send({ message: error.message });

  // Check Email is registered
  const user = await User.findOne({ email: value.email });
  if (user)
    return res
      .status(401)
      .send({ message: "This Email ID is already register" });

  // Hashing Password
  const salt = await bcrypt.genSalt(10);
  value.password = await bcrypt.hash(value.password, salt);

  // Creating an User
  const newUser = await User(
    _.pick(value, ["firstName", "lastName", "email", "password"])
  );
  // Saving the new User
  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, config.get("screteKey"), {
    expiresIn: "2d",
  });

  const link = `${config.get("frontend")}/verify-user/${token}`;

  await sendMail(
    newUser.email,
    "Verification For User",
    `Click the Link to Verify your email \n\n ${link} \n\n This Link will be expires in 48 hr`
  );
  // sending the response
  res.send({
    user: _.pick(newUser, ["_id", "email", "name"]),
  });
};

const resendVerification = async (req, res, next) => {
  // Body Validation
  const { error, value } = validator("resendVerification", req.body);
  if (error) return res.status(406).send({ message: error.message });

  // Check Email is registered
  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(400).send({ message: "Invalid Email ID" });

  if (user.verified)
    return res.status(400).send({
      message: "User is already verified...",
    });

  // Creating an token
  const token = jwt.sign({ id: user._id }, config.get("screteKey"), {
    expiresIn: "2d",
  });

  const link = `${config.get("frontend")}/verify-user/${token}`;

  await sendMail(
    user.email,
    "Email Verification",
    `Click the Link to Verify your email \n\n ${link} \n This Link will be expires in 48 hr`
  );

  res.send({ message: "Email is send" });
};

const forgot = async (req, res, next) => {
  // Body Validation
  const { error, value } = validator("forgot", req.body);
  if (error) return res.status(406).send({ message: error.message });

  // Check Email is registered
  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).send({ message: "Invalid Email ID" });

  // Creating an token
  const token = jwt.sign({ id: user._id }, config.get("screteKey"), {
    expiresIn: "1h",
  });
  user.resetToken = token;

  const link = `${config.get("frontend")}/verify-reset/${token}`;

  await sendMail(
    user.email,
    "Password Resetting Link",
    `Click the Link to reset your password \n\n ${link} \n\n This Link will be expires in 1 hr`
  );
  await user.save();

  res.send({ message: "Email is send" });
};

const reset = async (req, res, next) => {
  try {
    const token = req.headers.auth_token;
    //token Verification
    const verify = jwt.verify(token, config.get("screteKey"));
    //body validation
    const { error, value } = validator("reset", req.body);
    if (error) return res.status(406).send({ message: error.message });
    // Creating salt and Hashing password
    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);

    const user = await User.findOne({ resetToken: token });
    user.resetToken = "";
    user.password = value.password;

    await user.save();

    res.send({ message: "Password changed Successfully" });
  } catch (er) {
    return res
      .status(401)
      .send({ message: "Auth token is not Valid", error: er.message });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    //token Verification
    const token = req.params.token;
    const token_payload = jwt.verify(token, config.get("screteKey"));

    const user = await User.findById(token_payload.id);
    user.verified = true;

    await user.save();

    res.send({ message: "Verified Email Successfully" });
  } catch (er) {
    res
      .status(400)
      .send({ message: "Auth token is not Valid", error: er.message });
  }
};

const verifyResetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const token_payload = jwt.verify(token, config.get("screteKey"));

    const user = await User.findById(token_payload?.id);
    if (!user) return res.status(404).send({ message: "User is Not  Found" });

    return res.send({ message: "user is verified", userId: user.id });
  } catch (er) {
    return res.status(400).send({ message: "Invalid Token" });
  }
};
module.exports = {
  login,
  register,
  resendVerification,
  forgot,
  reset,
  verifyUser,
  verifyResetPassword,
};
