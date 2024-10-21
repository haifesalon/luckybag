const db = require("../model");
const Winners = require("./baseService")(db.winners);

module.exports = Winners;
