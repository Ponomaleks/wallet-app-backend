const countBalance = (typeTransaction, balance, payload) =>
  typeTransaction === "+"
    ? (balance * 100 + payload * 100) / 100
    : (balance * 100 + payload * 100) / 100;

module.exports = countBalance;
