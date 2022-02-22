const { Schema, model } = require('mongoose');
const Joi = require('joi');

// eslint-disable-next-line no-useless-escape
const emailRegexp = /.+@.+\..+/i;

const userSchema = Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    token: {
      type: String,
      default: null,
    },
    balance: { type: Number, default: 0 },
    //если не будем использовать верификацию пользователя через email то удалим
    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
    // verificationToken: {
    //   type: String,
    //   required: [true, 'Verify token is required'],
    // },
  },
  { versionKey: false, timestamps: true }
);

const RegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).max(12).required(),
  name: Joi.string().min(1).max(12).required(),
  token: Joi.string(),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).max(12).required(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  RegisterSchema,
  joiLoginSchema,
};
