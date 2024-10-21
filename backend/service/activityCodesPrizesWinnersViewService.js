const db = require("../model");
const ActivityCodesPrizesWinnersView = require("./baseService")(
  db.activityCodesPrizesWinnersView
);

module.exports = ActivityCodesPrizesWinnersView;
