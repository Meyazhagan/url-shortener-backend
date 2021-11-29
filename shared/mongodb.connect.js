const mongoose = require("mongoose");
const config = require("config");

const connect = () => {
  const url = config.get("mongodb.url");
  // Connecting to mongodb Client
  mongoose
    .connect(url)
    .then(() => console.log("Connected to Mongo DB..."))
    .catch((err) => console.log("Error while connecting to db ... " + err));

  if (!process.env.NODE_ENV) {
    console.log(`DB URL - ${url}`);
  }
};

module.exports = {
  connect,
};
