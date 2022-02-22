const countBalanceAdd = (typeTransaction, balance, payload) =>
  typeTransaction === "+"
    ? (balance * 100 + payload * 100) / 100
    : (balance * 100 - payload * 100) / 100;

const countBalanceDelete = (typeTransaction, balance, payload) =>
  typeTransaction === "+"
    ? (balance * 100 - payload * 100) / 100
    : (balance * 100 + payload * 100) / 100;

module.exports = { countBalanceAdd, countBalanceDelete };
