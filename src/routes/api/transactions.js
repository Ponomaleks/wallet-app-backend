const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");
const authenticate = require("../../middlewares/authenticate");

const {
  countBalanceAdd,
  countBalanceDelete,
} = require("../../helpers/countBalance");
const { Transaction, joiSchemaTransaction, User } = require("../../models");

router.post("/add", authenticate, async (req, res, next) => {
  try {
    const { error } = joiSchemaTransaction.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { _id } = req.user;

    const { typeTransaction, amountTransaction } = req.body;

    const userTransactions = await Transaction.find({ owner: _id });
    const oldBalance = userTransactions[userTransactions.length - 1]
      ? userTransactions[userTransactions.length - 1].balance
      : 0;

    const transactionBalance = countBalanceAdd(
      typeTransaction,
      oldBalance,
      amountTransaction
    );

    await User.findByIdAndUpdate(
      _id,
      { balance: transactionBalance ? transactionBalance : 0 },
      { new: true }
    );

    const newTransaction = await Transaction.create({
      ...req.body,
      owner: _id,
      balance: transactionBalance,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { _id } = req.user;
    const skip = (page - 1) * limit;

    const data = await Transaction.find(
      { owner: _id, ...req.query },
      {},
      { skip, limit: +limit }
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.delete("/:_id", authenticate, async (req, res, next) => {
  try {
    const transactionId = req.params._id;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new NotFound();
    }

    const userId = req.user._id;

    const userTransactions = await Transaction.find({ owner: userId });

    const deleteAmountTransaction = transaction.amountTransaction;
    const deleteTypeTransaction = transaction.typeTransaction;
    // const deleteIndexEl = userTransactions.findIndex(
    //   (transaction) => (transaction._id = transactionId)
    // );

    // console.log(deleteIndexEl);

    await Transaction.findByIdAndDelete(transactionId);

    // for (let i = deleteIndexEl; i < userTransactions.length; i++) {
    //   userTransactions.map((transaction) => {
    //     const id = transaction._id;
    //     const oldBalance = transaction.balance;
    //     const balance =
    //       deleteTypeTransaction === "+"
    //         ? (oldBalance * 100 - deleteAmountTransaction * 100) / 100
    //         : (oldBalance * 100 + deleteAmountTransaction * 100) / 100;

    //     transaction.balance = balance;
    //     // console.log(transaction);
    //     return transaction;
    //   });
    // }

    const newUserTransactions = await Transaction.find({ owner: userId });

    res.json(newUserTransactions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
