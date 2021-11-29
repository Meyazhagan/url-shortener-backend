const Url = require("../model/url");

const FindUrl = async (req, res) => {
  const url = req.headers.x_url;
  console.log(url);
  if (!url) return res.status(404).send({ message: "No URL Found" });

  const urlData = await Url.findOneAndUpdate(
    { shortUrl: url },
    { $inc: { clicked: 1 } }
  );
  if (!urlData) return res.status(404).send({ message: "Invalid Url" });

  res.send(urlData);
};

module.exports = FindUrl;
