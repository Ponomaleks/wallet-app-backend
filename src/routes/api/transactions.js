const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");
const authenticate = require("../../middlewares/authenticate");

const countBalance = require("../../helpers/countBalance");
const { Transaction, joiSchemaTransaction, User } = require("../../models");

router.post("/add", authenticate, async (req, res, next) => {
  console.log(authenticate);
  try {
    const { error } =
      joiSchemaTransaction.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { _id } = req.user;
    console.log(req.user);
    const newTransaction = await Transaction.create({
      ...req.body,
      owner: _id,
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
  console.log(authenticate);
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

router.delete("/:transactionId", authenticate, async (req, res, next) => {
  try {
    const { error } = joiSchemaTransaction.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { transactionId, _id } = req.params;
    const { balance } = req.user;
    const { typeTransaction } = req.body;

    const deleteTransaction = await Transaction.findByIdAndRemove({
      _id: transactionId,
      owner: _id,
    });

    if (!deleteTransaction) {
      throw new NotFound();
    }

    const transactionBalance = countBalance(typeTransaction, balance, payload);
    const updateBalance = await User.findByIdAndUpdate(
      _id,
      transactionBalance,
      { new: true }
    );
    if (!updateBalance) {
      throw new NotFound();
    }
    res.json({ message: "transaction deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
