// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const codesService = require("../service/codesService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 主要 URL (for 頁面驗證)
const URL = "/activity";

// 新增序號
router.post(
  "/",
  permission(URL, ActionType.CREATE.value),
  async (req, res, next) => {
    try {
      await codesService.create(req.body);
      return res.status(201).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 更新角色
router.patch(
  "/:id",
  permission(URL, ActionType.UPDATE.value),
  async (req, res, next) => {
    try {
      await codesService.update(req.body, { id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 刪除角色
router.delete(
  "/:id",
  permission(URL, ActionType.DELETE.value),
  async (req, res, next) => {
    try {
      await codesService.destroy({ id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部序號 (分頁查詢)
router.post(
  "/:activityId/pagination",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const { rowsPerPage, page, sortBy, sortType, search = "" } = req.body;

      const perPage = rowsPerPage == null ? null : parseInt(rowsPerPage);
      const currentPage = page == null ? null : parseInt(page);
      const order = sortBy && sortType ? [sortBy, sortType] : null;
      const start = (currentPage - 1) * perPage;
      const searchValue = search.trim();

      const searchData = {
        [Op.and]: [
          {
            code: { [Op.like]: `%${searchValue}%` },
          },
          {
            activityId: req.params.activityId,
          },
        ],
      };

      const codes = await codesService.query({
        perPage,
        start,
        order,
        data: searchData,
      });

      return res.status(200).json({
        success: true,
        data: codes.data,
        recordsFiltered: codes.total,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
