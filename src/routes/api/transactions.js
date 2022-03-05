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
    const previousTransactionBalance = userTransactions[
      userTransactions.length - 1
    ]
      ? userTransactions[userTransactions.length - 1].balance
      : 0;

    const newBalance = countBalanceAdd(
      typeTransaction,
      previousTransactionBalance,
      amountTransaction
    );

    await User.findByIdAndUpdate(
      _id,
      { balance: newBalance ? newBalance : 0 },
      { new: true }
    );

    const newTransaction = await Transaction.create({
      ...req.body,
      owner: _id,
      balance: newBalance,
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
    const transactionDeleteId = req.params._id;
    const transactionDelete = await Transaction.findById(transactionDeleteId);
    if (!transactionDelete) {
      throw new NotFound();
    }

    const userId = req.user._id;

    const userTransactions = await Transaction.find({ owner: userId });

    const deleteAmountTransaction = transactionDelete.amountTransaction;
    const deleteTypeTransaction = transactionDelete.typeTransaction;
    const deleteIndexEl = userTransactions.findIndex(
      (transaction) => transaction._id.toString() === transactionDeleteId
    );

    await Transaction.findByIdAndDelete(transactionDeleteId);

    const userTransactionsAfterDelete = await Transaction.find({
      owner: userId,
    });

    const updateTransactionId = userTransactionsAfterDelete
      .map((transaction) => transaction._id.toString())
      .filter((el, index) => index >= deleteIndexEl);

    for (const id of updateTransactionId) {
      await Transaction.updateOne(
        { _id: id, owner: userId },
        {
          $set: {
            balance: countBalanceDelete(
              deleteTypeTransaction,
              (
                await Transaction.findById(id)
              ).balance,
              deleteAmountTransaction
            ),
          },
        },
        { new: true }
      );
    }

    const newUserTransactions = await Transaction.find({ owner: userId });
    const lastUserTransactionBalance = newUserTransactions[
      newUserTransactions.length - 1
    ]
      ? newUserTransactions[newUserTransactions.length - 1].balance
      : 0;

    await User.findByIdAndUpdate(
      userId,
      { balance: lastUserTransactionBalance },
      { new: true }
    );

    res.json({ message: "transaction deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
