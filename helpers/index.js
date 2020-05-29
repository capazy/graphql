const dateToString = (date) => new Date(date).toISOString().slice(0, 10);

module.exports = { dateToString };
