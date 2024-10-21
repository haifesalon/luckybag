// 匯入套件和函式庫
const express = require("express");

const actionService = require("../service/actionService");

// 路由
const router = express.Router();

// 查詢全部操作狀態
router.get("/", async (req, res, next) => {
  try {
    const actions = await actionService.query({});
    return res.status(200).json({ success: true, data: actions.data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 導出路由
module.exports = router;
