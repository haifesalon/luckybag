// 匯入套件和函式庫
const express = require("express");

const permission = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const prizesService = require("../service/prizesService");
const winnersService = require("../service/winnersService");

// 路由
const router = express.Router();

// 主要 URL (for 頁面驗證)
const URL = "/home";

// 取得所有 dashboard 所需數據資料
router.post(
  "/",
  permission(URL, ActionType.READ.value),
  async (req, res, next) => {
    try {
      const { activityId } = req.body;

      // 根據活動取得該活動所有獎項
      var prizes = await prizesService.query({
        data: { activityId: activityId },
      });

      // 計算獎項總數量
      const numOfPrizes = prizes.data.reduce(
        (total, item) => total + item.quantity,
        0
      );

      // 將獎項所有 id 取出為陣列
      const prizeIds = prizes.data.map((item) => item.id);

      // 根據獎項取得所有得獎者
      const winners = await winnersService.query({
        data: { prizeId: prizeIds },
      });

      // 計算兌換總數量
      const numOfExchanges = winners.data.reduce(
        (total, item) => total + (item.isExchange ? 1 : 0),
        0
      );

      // 計算個別兌換數量
      const exchangeData = prizeIds.map((id) => {
        const numOfExchange = winners.data.filter(
          (item) => item.prizeId === id && item.isExchange === 1
        ).length;
        return { id, numOfExchange };
      });

      // dashboard 所需數據整合
      const dashboardData = {
        numOfExchanges: numOfExchanges,
        numOfPrizes: numOfPrizes,
        numOfWinners: winners.total,
        prizes: prizes.data
          .map((prize) => ({
            id: prize.id,
            name: prize.name,
            quantity: prize.quantity,
            winners: prize.quantity - prize.remainingQty,
            exchange: exchangeData.find((item) => item.id === prize.id)
              .numOfExchange,
          })),
      };

      return res.status(200).json({ success: true, data: dashboardData });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
