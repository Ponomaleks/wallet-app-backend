const sortArray = arr => arr.sort(function (a, b) {
    var dateA = new Date(a.date);
    var dateB = new Date(b.date);
    return dateA - dateB;
  });

module.exports = { sortArray };