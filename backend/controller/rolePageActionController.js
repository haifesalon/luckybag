// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const pageService = require("../service/pageService");
const actionService = require("../service/actionService");
const rolePageActionService = require("../service/rolePageActionService");
const rolePageActionViewService = require("../service/rolePageActionViewService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 取得角色頁面權限表
router.get("/:roleId", async (req, res, next) => {
  try {
    // 取得所有操作狀態
    const actions = {};
    const actionsData = await actionService.query({});
    actionsData.data.forEach((item) => {
      actions[item.name.toLowerCase()] = true;
    });

    // 權限列表
    const permission = [];
    // 取得每個角色頁面權限
    const pagesData = await pageService.query({});
    for (const page of pagesData.data) {
      const pageActions = [];
      const rolePageActions = await rolePageActionViewService.query({
        data: { roleId: req.params.roleId, pageId: page.id },
      });
      rolePageActions.data.forEach((item) => {
        pageActions.push({
          action: item.actionName,
        });
      });

      const result = { page: page.displayName, pageId: page.id };
      Object.keys(actions).forEach((action) => {
        result[action] = false;
      });

      pageActions.forEach((pageAction) => {
        const actionKey = pageAction.action.toLowerCase();
        result[actionKey] = actions[actionKey] || false;
      });

      permission.push(result);
    }

    return res.status(200).json({
      success: true,
      data: { actions: Object.keys(actions), permission },
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 修改角色頁面權限
router.post("/", async (req, res, next) => {
  try {
    const { roleId, pageId, action, currentValue, ...other } = req.body;
    const actionsData = await actionService.query({
      data: { [Op.or]: [{ name: { [Op.like]: `%${action}%` } }] },
    });
    const actionId = actionsData.data[0]["id"];
    // 判斷是要新增權限或刪除權限
    if (currentValue) {
      await rolePageActionService.destroy({ roleId, pageId, actionId });
    } else {
      const result = { roleId, pageId, actionId, ...other };
      await rolePageActionService.create(result);
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

module.exports = router;
