const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const { Transaction } = require('../../models');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const year = req.query.year;
    const month = req.query.month;
    const { _id } = req.user;
    const data = await Transaction.find({
      owner: _id,
      month,
      year,
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
