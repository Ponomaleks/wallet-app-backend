const { Schema, model } = require("mongoose");
const Joi = require("joi");

const transactionSchema = Schema({
  // Блок дат
  date: {
    type: Date,
    min: "2020-01-01",
  },
  year: {
    type: Date, //???
  },
  month: {
    type: Date, //???
  },
  // Тип транзакции доход=true, расход=false
  typeTransaction: {
    type: Boolean,
    default: false,
  },
  // Категории расходов
  category: {
    type: String,
    enum: [
      "basic expenses",
      "food",
      "car",
      "personal",
      "children",
      "home",
      "education",
      "leisure",
      "other expenses",
    ],
    default: "basic expenses",
  },
  // Комментарий к доходу
  сommentary: {
    type: String,
    // required: [true],
  },
  // Сумма транзакции
  amountTransaction: {
    type: Number,
  },
  // Баланс счета
  balance: {
    type: Number,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

// Joi схема для записи дохода
const earningsSchema = Joi.object({
  date: Joi.date().required(),
  year: Joi.date().required(),
  month: Joi.date().required(),
  typeTransaction: Joi.boolean().required(),
  сommentary: Joi.string(),
  amountTransaction: Joi.number().required(),
  balance: Joi.number().required(),
});

// Joi схема для записи расходов
const expenseSchema = Joi.object({
  date: Joi.date().required(),
  year: Joi.date().required(),
  month: Joi.date().required(),
  typeTransaction: Joi.boolean().required(),
  category: Joi.string().required(),
  amountTransaction: Joi.number().required(),
  balance: Joi.number().required(),
});

// Joi схема статистики для дашборда(таблица, график)
const statisticSchema = Joi.object({
  date: Joi.date().required(),
  year: Joi.date().required(),
  month: Joi.date().required(),
  typeTransaction: Joi.boolean().required(),
  category: Joi.string().required(),
  amountTransaction: Joi.number().required(),
  balance: Joi.number().required(),
});

const Transaction = model("transaction", transactionSchema);

module.exports = {
  Transaction,
  earningsSchema,
  expenseSchema,
  statisticSchema,
};
