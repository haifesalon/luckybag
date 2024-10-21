// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const winnersService = require("../service/winnersService");
const activityCodesPrizesWinnersViewService = require("../service/activityCodesPrizesWinnersViewService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 主要 URL (for 頁面驗證)
const URL = "/activity";

// 查詢全部中獎人 (分頁查詢)
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
                prizeName: { [Op.like]: `%${searchValue}%` },
              },
              {
                price: { [Op.like]: `%${searchValue}%` },
              },
              {
                prizeTime: { [Op.like]: `%${searchValue}%` },
              },
              {
                code: { [Op.like]: `%${searchValue}%` },
              },
              {
                activityName: { [Op.like]: `%${searchValue}%` },
              },
              {
                winnerName: { [Op.like]: `%${searchValue}%` },
              },
              {
                phone: { [Op.like]: `%${searchValue}%` },
              },
            ],
          },
        ],
      };

      const activityCodesPrizesWinnersView =
        await activityCodesPrizesWinnersViewService.query({
          perPage,
          start,
          order,
          data: searchData,
        });

      activityCodesPrizesWinnersView.data.map((item) => {
        item.prizeName = item.prizeName + item.price + " " + item.prizeTime;
      });

      return res.status(200).json({
        success: true,
        data: activityCodesPrizesWinnersView.data,
        recordsFiltered: activityCodesPrizesWinnersView.total,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 修改中獎人資料
router.patch(
  "/:id",
  permission(URL, ActionType.UPDATE.value),
  async (req, res, next) => {
    try {
      await winnersService.update(req.body, { id: req.params.id });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
