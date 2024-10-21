// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const pageService = require("../service/pageService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 主要 URL
const URL = "/page";

// 新增頁面
router.post(
  "/",
  permission(URL, ActionType.CREATE.value),
  async (req, res, next) => {
    try {
      await pageService.create(req.body);
      return res.status(201).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部頁面
router.get(
  "/",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const pages = await pageService.query({});
      return res.status(200).json({ success: true, data: pages.data });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢父頁面
router.get(
  "/parent",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const page = await pageService.query({ data: { parentId: 0 } });
      return res.status(200).json({ success: true, data: page.data });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢單一頁面
router.get(
  "/:id",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const page = await pageService.query({ data: { id: req.params.id } });
      return res.status(200).json({ success: true, data: page.data });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 更新頁面
router.patch(
  "/:id",
  permission(URL, ActionType.UPDATE.value),
  async (req, res, next) => {
    try {
      await pageService.update(req.body, { id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 刪除頁面
router.delete(
  "/:id",
  permission(URL, ActionType.DELETE.value),
  async (req, res, next) => {
    try {
      await pageService.destroy({ id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部頁面 (分頁查詢)
router.post(
  "/pagination",
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
        [Op.or]: [
          {
            id: { [Op.like]: `%${searchValue}%` },
          },
          {
            name: { [Op.like]: `%${searchValue}%` },
          },
          {
            path: { [Op.like]: `%${searchValue}%` },
          },
          {
            icon: { [Op.like]: `%${searchValue}%` },
          },
        ],
      };

      const pages = await pageService.query({
        perPage,
        start,
        order,
        data: searchData,
      });

      return res.status(200).json({
        success: true,
        data: pages.data,
        recordsFiltered: pages.total,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

module.exports = router;
