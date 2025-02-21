const Joi = require("joi");
const CustomError = require("../utils/customError");

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const firstError = error.details[0];
    const attribute = firstError.path[0]; // Extract field name

    return next(new CustomError("FIELD_VALIDATION", attribute));
  }

  next();
};

module.exports = validateUser;
