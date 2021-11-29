const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicked: {
    type: Number,
    default: 0,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

const Url = mongoose.model("Urls", urlSchema);

module.exports = Url;
