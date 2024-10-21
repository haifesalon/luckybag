const db = require("../model");
const UserRoleView = require("./baseService")(db.userRoleView);

module.exports = UserRoleView;
