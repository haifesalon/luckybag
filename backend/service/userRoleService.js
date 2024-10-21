const db = require("../model");
const UserRole = require("./baseService")(db.userRole);

module.exports = UserRole;
