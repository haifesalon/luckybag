// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const prizesService = require("../service/prizesService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 主要 URL (for 頁面驗證)
const URL = "/activity";

// 新增獎項
router.post(
  "/",
  permission(URL, ActionType.CREATE.value),
  async (req, res, next) => {
    try {
      await prizesService.create(req.body);
      return res.status(201).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 更新獎項
router.patch(
  "/:id",
  permission(URL, ActionType.UPDATE.value),
  async (req, res, next) => {
    try {
      await prizesService.update(req.body, { id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 刪除獎項
router.delete(
  "/:id",
  permission(URL, ActionType.DELETE.value),
  async (req, res, next) => {
    try {
      await prizesService.destroy({ id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部獎項 (分頁查詢)
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
            activityId: req.params.activityId,
          },
          {
            [Op.or]: [
              {
                name: { [Op.like]: `%${searchValue}%` },
              },
              {
                price: { [Op.like]: `%${searchValue}%` },
              },
              {
                time: { [Op.like]: `%${searchValue}%` },
              },
            ],
          },
        ],
      };

      const prizes = await prizesService.query({
        perPage,
        start,
        order,
        data: searchData,
      });

      return res.status(200).json({
        success: true,
        data: prizes.data,
        recordsFiltered: prizes.total,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
