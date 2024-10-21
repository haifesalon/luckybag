// 匯入檔案
const middleware = require("../helper/middleware");
const publicController = require("./publicController");
const roleController = require("./roleController");
const userController = require("./userController");
const pageController = require("./pageController");
const actionController = require("./actionController");
const activityController = require("./activityController");
const codesController = require("./codesController");
const prizesController = require("./prizesController");
const winnersController = require("./winnersController");
const drawController = require("./drawController");
const dashboardController = require("./dashboardController");
const rolePageActionController = require("./rolePageActionController");

// API 路由整合
const routes = (app) => {
  app.use(middleware);
  app.use("/api/public", publicController);
  app.use("/api/role", roleController);
  app.use("/api/user", userController);
  app.use("/api/page", pageController);
  app.use("/api/action", actionController);
  app.use("/api/activity", activityController);
  app.use("/api/codes", codesController);
  app.use("/api/prizes", prizesController);
  app.use("/api/winners", winnersController);
  app.use("/api/draw", drawController);
  app.use("/api/dashboard", dashboardController);
  app.use("/api/permission", rolePageActionController);
};

// 導出 API 路由
module.exports = routes;
