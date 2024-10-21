// 匯入套件和函式庫
const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../config");
const crypto = require("../helper/crypto");

const publicService = require("../service/publicService");

// 路由
const router = express.Router();

// 系統登入
router.post("/login", async (req, res, next) => {
  try {
    // 驗證帳密
    const { isAuth, user, menu } = await publicService.auth(req.body);
    if (isAuth) {
      // 產生 JWT
      const token = crypto.encrypt(
        jwt.sign(
          { name: user.nickName, account: user.account },
          config.webConfig.JWT_SIGN_SECRET,
          { expiresIn: config.webConfig.JWT_EXPIRES }
        ),
        config.webConfig.TOKEN_CRYPTO_KEY
      );
      return res.status(200).json({
        success: true,
        id: user.id,
        name: user.nickName,
        token: token,
        menu: menu,
      });
    } else {
      return res.status(403).json({ success: false });
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 驗證 Token
router.post("/authenticateToken", async (req, res, next) => {
  try {
    const token = req.body.token;
    jwt.verify(
      crypto.decrypt(token, config.webConfig.TOKEN_CRYPTO_KEY),
      config.webConfig.JWT_SIGN_SECRET
    );
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(200).json({ success: false, message: e.message });
  }
});

module.exports = router;
