// 匯入套件和函式庫
const express = require("express");
const moment = require("moment");
const db = require("../model");

const config = require("../config");
const crypto = require("../helper/crypto");
const shuffle = require("../helper/shuffle");

const codesService = require("../service/codesService");
const prizesService = require("../service/prizesService");
const winnersService = require("../service/winnersService");
const activityCodesPrizesWinnersViewService = require("../service/activityCodesPrizesWinnersViewService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 抽獎
router.post("/", async (req, res, next) => {
  try {
    const { code, userName, phone } = req.body;
    const codes = await codesService.query({
      data: { code: code },
    });
    if (codes.total) {
      const winners = await winnersService.query({
        data: { codeId: codes.data[0].id },
      });
      if (!winners.total) {
        // 獎項必須要開放、剩餘數量必須大於 0
        const prizes = await prizesService.query({
          data: {
            [Op.and]: [
              { isEnabled: true },
              { remainingQty: { [Op.gt]: 0 } },
              { activityId: codes.data[0].activityId },
            ],
          },
        });
        if (prizes.total) {
          // 取出獎項 id 並打亂放入陣列
          const prizeIds = shuffle.shuffleArray(
            prizes.data
              .flatMap((item) => Array(item.remainingQty).fill(item.id))
              .sort()
          );
          // 隨機抽出一個獎項
          const draw = prizeIds[Math.floor(Math.random() * prizeIds.length)];
          const prize = prizes.data.find((item) => item.id === draw);
          const [NUM, UNIT] = (config.webConfig.WINNER_EXPIRES_NUM =
            config.webConfig.WINNER_EXPIRES.split(" "));
          await prizesService.update(
            { remainingQty: prize.remainingQty - 1 },
            { id: draw }
          );
          await winnersService.create({
            codeId: codes.data[0].id,
            name: userName,
            phone: phone,
            prizeId: draw,
            expiryDate: moment(new Date().setHours(0, 0, 0, 0)).add(
              parseInt(NUM),
              UNIT
            ),
          });
          return res.status(200).json({
            success: true,
            isValid: true,
            isDraw: false,
            isPrizeEmpty: false,
            prizeId: draw,
            prize: prize.price + prize.name + prize.time,
          });
        } else {
          return res.status(200).json({
            success: true,
            isValid: true,
            isDraw: false,
            isPrizeEmpty: true,
          });
        }
      } else {
        return res
          .status(200)
          .json({ success: true, isValid: true, isDraw: true });
      }
    }
    return res.status(200).json({ success: true, isValid: false });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 取得中獎紀錄
router.post("/winnerDate", async (req, res, next) => {
  try {
    const { code } = req.body;
    const winnerDate = await activityCodesPrizesWinnersViewService.query({
      data: { code: code },
    });
    return res.status(200).json({ success: true, data: winnerDate.data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 驗證中獎
router.post("/verificationCode", async (req, res, next) => {
  try {
    const { code } = req.body;
    const codes = await codesService.query({
      data: { code: code },
    });
    if (codes.total) {
      const winners = await activityCodesPrizesWinnersViewService.query({
        data: { codeId: codes.data[0].id },
      });
      if (winners.total) {
        const winner = winners.data[0];
        const isExpired = new Date(winner.expiryDate) < new Date();
        const result = {
          name: winner.winnerName,
          phone: winner.phone,
          prize: winner.price + winner.prizeName + winner.prizeTime,
          createTime: winner.createTime,
          isExchange: winner.isExchange === 1 ? true : false,
          expiryDate: winner.expiryDate,
        };
        return res.status(200).json({
          success: true,
          isValid: true,
          isDraw: true,
          isExpired,
          prize: result,
        });
      } else {
        return res
          .status(200)
          .json({ success: true, isValid: true, isDraw: false });
      }
    }
    return res.status(200).json({ success: true, isValid: false });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 兌換核銷
router.post("/exchangePrize", async (req, res, next) => {
  try {
    const { code, checkCode } = req.body;
    const codes = await codesService.query({
      data: { code: code },
    });
    if (
      codes.total &&
      checkCode ===
        crypto.decrypt(
          config.webConfig.CHECK_CODE,
          config.webConfig.CHECK_CODE_KEY
        )
    ) {
      await winnersService.update(
        { isExchange: true, modifyTime: new Date().getTime() },
        { codeId: codes.data[0].id }
      );
      return res
        .status(200)
        .json({ success: true, isValid: true, isExchange: true });
    }
    return res
      .status(200)
      .json({ success: true, isValid: false, isExchange: false });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 取得所有獎項
router.post("/getAllPrize", async (req, res, next) => {
  try {
    const { code } = req.body;
    const codes = await codesService.query({
      data: { code: code },
    });
    if (codes.total) {
      const prizes = await prizesService.query({
        data: { activityId: codes.data[0].activityId },
      });

      const prizeArray = [];
      prizes.data.forEach((element) => {
        prizeArray.push({
          id: element.id,
          fonts: [
            {
              text: element.name,
              top: "10%",
              fontSize: "14px",
              fontWeight: "800",
            },
          ],
          background: element.id % 2 ? "#e9e8fe" : "#b8c5f2",
        });
      });

      return res
        .status(200)
        .json({ success: true, isValid: true, prizeArray: prizeArray });
    }
    return res
      .status(200)
      .json({ success: true, isValid: false, prizes: prizes.data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 導出路由
module.exports = router;
