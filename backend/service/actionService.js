const db = require("../model");
const Action = require("./baseService")(db.action);

module.exports = Action;
