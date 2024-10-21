const db = require("../model");
const Role = require("./baseService")(db.role);

module.exports = Role;
