const Joi = require("joi");

const schema = Joi.object({
  url: Joi.string().uri().required(),
});

const validator = (url) => schema.validate(url);

module.exports = validator;
