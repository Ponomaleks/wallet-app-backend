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

    const { _id } = req.user;

    const userTransactions = await Transaction.find({ owner: _id });

    const deleteAmountTransaction = transactionDelete.amountTransaction;
    const deleteTypeTransaction = transactionDelete.typeTransaction;
    const deleteIndexEl = userTransactions.findIndex(
      (transaction) => transaction._id.toString() === transactionDeleteId
    );

    await Transaction.findByIdAndDelete(transactionDeleteId);

    const newUserTransactions = await Transaction.find({ owner: _id });

    newUserTransactions.map((transaction, index) => {
      const oldBalance = transaction.balance;

      const newBalance = countBalanceDelete(
        deleteTypeTransaction,
        oldBalance,
        deleteAmountTransaction
      );

      const previousTransactionBalance =
        newUserTransactions[newUserTransactions.length - 1].balance;

      if (index >= deleteIndexEl) {
        transaction.balance = newBalance;

        const userUpdate = User.findByIdAndUpdate(
          { _id: _id },
          { balance: newBalance ? newBalance : 0 },
          { new: true }
        );

        const transactionsUpdate = Transaction.findByIdAndUpdate(
          { _id },
          { balance: newBalance ? newBalance : 0 },
          { new: true }
        );
        return { userUpdate, transactionsUpdate };
      }

      if ((index = newUserTransactions.length - 1)) {
        const userUpdate = User.findByIdAndUpdate(
          { _id: _id },
          {
            balance: previousTransactionBalance,
          },
          { new: true }
        );
        return { userUpdate };
      }

      return transaction;
    });

    res.json({ message: "transaction deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
