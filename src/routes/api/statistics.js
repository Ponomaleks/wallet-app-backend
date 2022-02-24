const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const { Transaction } = require('../../models');
const costCategories = require('../../helpers/categoriesList');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const year = req.query.year;
    const month = req.query.month;
    const { _id } = req.user;
    let query;
    if (year !== 'full' && month !== 'full') {
      query = {
        owner: _id,
        month,
        year,
      };
    } else if (year === 'full' && month !== 'full') {
      query = {
        owner: _id,
        month,
      };
    } else if (year !== 'full' && month === 'full') {
      query = {
        owner: _id,
        year,
      };
    } else query = { owner: _id };

    const data = await Transaction.find(query);

    const income = getIncome(data);
    const costs = getCosts(data);
    const formatedData = formatForRender(data);
    console.log(costs);

    res.json({ formatedData, costs, income });
  } catch (error) {
    next(error);
  }
});
module.exports = router;

function getIncome(transactions) {
  return transactions.reduce((acc, el) => {
    if (el.typeTransaction === '+') {
      return acc + el.amountTransaction;
    }
    return acc;
  }, 0);
}

function getCosts(transactions) {
  return transactions.reduce((acc, el) => {
    if (el.typeTransaction === '-') {
      return acc + el.amountTransaction;
    }
    return acc;
  }, 0);
}

function formatForRender(filteredData) {
  const result = [];
  for (const category of costCategories) {
    const { value, color } = category;

    const categorySum = filteredData.reduce(
      (acc, curr) => {
        if (curr.category === value) {
          acc.category = value;
          acc.sum = acc.sum + curr.amountTransaction;
        }

        return acc;
      },
      { category: '', sum: 0, color: color }
    );
    if (categorySum.category !== '') {
      result.push(categorySum);
    }
  }
  return result;
}
