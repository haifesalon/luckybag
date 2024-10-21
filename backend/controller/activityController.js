// 匯入套件和函式庫
const express = require("express");

const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const activityService = require("../service/activityService");

// 路由
const router = express.Router();

// 主要 URL
const URL = "/activity";

// 新增活動
router.post(
  "/",
  permission(URL, ActionType.CREATE.value),
  async (req, res, next) => {
    try {
      await activityService.create(req.body);
      return res.status(201).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部活動
router.get(
  "/",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const actions = await activityService.query({});
      return res.status(200).json({ success: true, data: actions.data });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 更新活動
router.patch(
  "/:id",
  permission(URL, ActionType.UPDATE.value),
  async (req, res, next) => {
    try {
      await activityService.update(req.body, { id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 刪除活動
router.delete(
  "/:id",
  permission(URL, ActionType.DELETE.value),
  async (req, res, next) => {
    try {
      await activityService.destroy({ id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
