const db = require("../model");
const Prizes = require("./baseService")(db.prizes);

module.exports = Prizes;
