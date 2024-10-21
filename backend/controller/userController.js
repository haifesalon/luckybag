// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const config = require("../config");
const crypto = require("../helper/crypto");
const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const userService = require("../service/userService");
const userRoleService = require("../service/userRoleService");
const userRoleViewService = require("../service/userRoleViewService");

// 路由
const router = express.Router();

// 系統設定
const webConfig = config.webConfig;

// 資料庫參數
const Op = db.op;

// 主要 URL
const URL = "/user";

// 新增使用者
router.post(
  "/",
  permission(URL, ActionType.CREATE.value),
  async (req, res, next) => {
    try {
      // 密碼加密
      req.body.password = crypto.getHash(
        crypto.HashType.SHA512,
        req.body.password + webConfig.PWD_SALT
      );
      // 同時新增使用者資料並將使用者加入角色
      const { role, ...other } = req.body;
      const user = await userService.create(other);
      await userRoleService.create({ userId: user.id, roleId: role });
      return res.status(201).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部使用者
router.get(
  "/",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const users = await userService.query({});
      return res.status(200).json({ success: true, data: users.data });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢單一使用者
router.get(
  "/:id",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const user = await userService.query({ data: { id: req.params.id } });
      return res.status(200).json({ success: true, data: user.data });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 更新使用者
router.patch(
  "/:id",
  permission(URL, ActionType.UPDATE.value),
  async (req, res, next) => {
    try {
      const user = await userService.query({ data: { id: req.params.id } });
      // 判斷是否要更新密碼
      if (req.body.password != user.data[0].password) {
        req.body.password = crypto.getHash(
          crypto.HashType.SHA512,
          req.body.password + webConfig.PWD_SALT
        );
      }

      // 判斷是否要更新角色
      const { role, ...other } = req.body;
      const userRole = await userRoleService.query({
        data: { userId: req.params.id },
      });
      if (role != userRole.data[0].roleId) {
        await userRoleService.destroy({
          userId: req.params.id,
          roleId: userRole.data[0].roleId,
        });
        await userRoleService.create({
          userId: req.params.id,
          roleId: role,
        });
      }
      await userService.update(other, { id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 刪除使用者
router.delete(
  "/:id",
  permission(URL, ActionType.DELETE.value),
  async (req, res, next) => {
    try {
      await userService.destroy({ id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢全部使用者 (分頁查詢)
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

      const userRole = await userRoleViewService.query({
        data: { account: req.decoded.account },
      });
      const currentRoleId = userRole.data.map(
        (userRoleItem) => userRoleItem.roleId
      )[0];

      const searchData = {
        [Op.and]: [
          {
            roleId: { [Op.ne]: 1, [Op.gte]: currentRoleId },
          },
          {
            [Op.or]: [
              {
                realName: { [Op.like]: `%${searchValue}%` },
              },
              {
                nickName: { [Op.like]: `%${searchValue}%` },
              },
              {
                roleName: { [Op.like]: `%${searchValue}%` },
              },
              {
                account: { [Op.like]: `%${searchValue}%` },
              },
            ],
          },
        ],
      };

      const users = await userRoleViewService.query({
        perPage,
        start,
        order,
        data: searchData,
      });

      return res.status(200).json({
        success: true,
        data: users.data,
        recordsFiltered: users.total,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

module.exports = router;
