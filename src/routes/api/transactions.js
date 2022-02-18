const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");
const authenticate = require("../../middlewares/authenticate");

const { Transaction, incomeSchema, expenseSchema } = require("../../models");

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

router.delete("/:transactionId", authenticate, async (req, res, next) => {
  try {
    const { transactionId, _id } = req.params;
    const deleteTransaction = await Transaction.findByIdAndRemove({
      _id: transactionId,
      owner: _id,
    });

    if (!deleteTransaction) {
      throw new NotFound();
    }
    res.json({ message: "transaction deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
