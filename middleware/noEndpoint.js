const noEndpoint = (req, res) => {
  return res.status(404).send({ message: "No Such Endpoint" });
};

module.exports = noEndpoint;
