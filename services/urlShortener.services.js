const { isValidObjectId } = require("mongoose");
const Url = require("../model/url");
const validator = require("../shared/urlJoiValidation");
const { pick } = require("lodash");
const randomBytes = require("randombytes");
const config = require("config");

const getAll = async (req, res, next) => {
  const urls = await Url.find({ userId: req.user._id });
  res.send(urls);
};
const get = async (req, res, next) => {
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ message: "Invalid URL Id" });

  const url = await Url.findOne({ userId: req.user._id, _id: id });
  res.send(url);
};
const create = async (req, res, next) => {
  const { error, value } = validator(req.body);
  if (error) return res.status(400).send({ message: error.message });

  const newUrl = await new Url(pick(value, ["url"]));
  newUrl.userId = req.user._id;

  const urlId = randomBytes(5).toString("hex");
  const link = `${config.get("frontend")}/${urlId}`;
  newUrl.shortUrl = link;

  await newUrl.save();

  return res.send({ url: newUrl, message: "New URL is Created" });
};
const update = async (req, res, next) => {
  // validating params id
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ message: "Invalid URL Id" });

  // validating body
  const { error, value } = validator(req.body);
  if (error) return res.status.send({ message: error.message });

  const urlData = await Url.findOne({ userId: req.user._id, _id: id });
  if (!urlData) return res.status(400).send({ message: "URL not found" });
  urlData.url = value.url;

  await urlData.save();

  return res.send({ url: urlData, message: "URL is Updated" });
};
const remove = async (req, res, next) => {
  // validating params id
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ message: "Invalid URL Id" });

  const urlData = await Url.findOneAndDelete({ userId: req.user._id, _id: id });
  if (!urlData) return res.status(400).send({ message: "URL not found" });

  return res.send({ url: {}, message: "URL is Deleted" });
};

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
};
