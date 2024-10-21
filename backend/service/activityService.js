const db = require("../model");
const Activity = require("./baseService")(db.activity);

module.exports = Activity;
