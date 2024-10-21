// 匯入資料庫 model 和檔案
const db = require("../model");

const userRoleView = require("../service/userRoleViewService.js");
const rolePageActionView = require("../service/rolePageActionViewService.js");

// 資料庫參數
const Op = db.op;

// 權限檢查
const permission = (url, action) => {
  return async (req, res, next) => {
    // 查詢使用者角色
    const userRole = await userRoleView.query({
      data: { account: req.decoded.account },
    });
    const roleIds = userRole.data.map((userRoleItem) => userRoleItem.roleId);
    // 查詢角色頁面權限
    const rolePageAction = await rolePageActionView.query({
      data: {
        roleId: { [Op.in]: roleIds },
        path: url.slice(1),
        actionId: action,
      },
    });
    // 檢查是否存在角色頁面權限
    if (rolePageAction.total) return next();
    else return res.status(403).json({ success: false, message: "Forbidden" });
  };
};

module.exports = permission;
