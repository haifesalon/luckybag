const db = require("../model");
const Codes = require("./baseService")(db.codes);

module.exports = Codes;
