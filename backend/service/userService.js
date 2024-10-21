const db = require("../model");
const User = require("./baseService")(db.user);

module.exports = User;
