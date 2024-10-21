// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const roleService = require("../service/roleService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 主要 URL
const URL = "/role";

// 新增角色
router.post(
  "/",
  permission(URL, ActionType.CREATE.value),
  async (req, res, next) => {
    try {
      await roleService.create(req.body);
      return res.status(201).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部角色
router.get(
  "/",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const roles = await roleService.query({});
      return res.status(200).json({ success: true, data: roles.data });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢單一角色
router.get(
  "/:id",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const role = await roleService.query({ data: { id: req.params.id } });
      return res.status(200).json({ success: true, data: role.data });
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
      await roleService.update(req.body, { id: req.params.id });
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
      await roleService.destroy({ id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部角色 (分頁查詢)
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
            name: { [Op.like]: `%${searchValue}%` },
          },
        ],
      };

      const roles = await roleService.query({
        perPage,
        start,
        order,
        data: searchData,
      });

      return res.status(200).json({
        success: true,
        data: roles.data,
        recordsFiltered: roles.total,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

module.exports = router;
