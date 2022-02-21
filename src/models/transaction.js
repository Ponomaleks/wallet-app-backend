const { Schema, model } = require("mongoose");
const Joi = require("joi");

const transactionSchema = Schema({
  date: {
    type: String,
    require: true,
  },
  year: {
    type: Number,
    require: true,
  },
  month: {
    type: Number,
    require: true,
  },
  typeTransaction: {
    type: String,
    enum: ["+", "-"],
    require: true,
  },
  category: {
    type: String,
    enum: [
      "Regular income",
      "Irregular income",
      "Basic",
      "Food",
      "Car",
      "Development",
      "Children",
      "House",
      "Education",
      "Other",
    ],
    require: true,
  },
  commentary: {
    type: String,
  },
  amountTransaction: {
    type: Number,
    require: true,
  },
  balance: {
    type: Number,
  },
  owner: {
    type: String,
    ref: "user",
  },
});

const joiSchemaTransaction = Joi.object({
  date: Joi.string().required(),
  year: Joi.number().required(),
  month: Joi.number().required(),
  typeTransaction: Joi.string().valid("+", "-").required(),
  category: Joi.string()
    .valid(
      "Regular income",
      "Irregular income",
      "Basic",
      "Food",
      "Car",
      "Development",
      "Children",
      "House",
      "Education",
      "Other"
    )
    .required(),
  commentary: Joi.string(),
  amountTransaction: Joi.number().required(),
});

const Transaction = model("transaction", transactionSchema);

module.exports = {
  Transaction,
  joiSchemaTransaction,
};
