const { Schema, model } = require("mongoose");
const Joi = require("joi");

const transactionSchema = Schema({
  date: {
    type: String,
    require: true,
  },
  year: {
    type: Number,
  },
  month: {
    type: Number,
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
      // "basic expenses",
      // "food",
      // "car",
      // "personal",
      // "children",
      // "home",
      // "education",
      // "leisure",
      // "other expenses",
    ],
    default: "Basic",
  },
  сommentary: {
    type: String,
  },
  amountTransaction: {
    type: Number,
    require: true,
    set: (data) => Number(data),
  },
  balance: {
    type: Number,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const incomeSchema = Joi.object({
  date: Joi.date().required(),
  typeTransaction: Joi.string().valid("+", "-").required(),
  сommentary: Joi.string(),
  amountTransaction: Joi.number().required(),
});

const expenseSchema = Joi.object({
  date: Joi.date().required(),
  typeTransaction: Joi.string().valid("+", "-").required(),
  сommentary: Joi.string(),
  amountTransaction: Joi.number().required(),
});

const Transaction = model("transaction", transactionSchema);

module.exports = {
  Transaction,
  incomeSchema,
  expenseSchema,
};
