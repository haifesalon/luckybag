// 匯入套件
const jwt = require("jsonwebtoken");

const crypto = require("./crypto");
const config = require("../config");

const middleware = async (req, res, next) => {
  try {
    // 取得目前呼叫的 URL
    const url = req.originalUrl;
    // 若呼叫為非公開 API 皆須驗證 token
    if (
      url.includes("/api/") &&
      !url.includes("/public/") &&
      !url.includes("/api/draw")
    ) {
      const token = req.headers.authorization || "";
      const decryptedToken = crypto.decrypt(
        token,
        config.webConfig.TOKEN_CRYPTO_KEY
      );
      const decoded = await jwt.verify(
        decryptedToken,
        config.webConfig.JWT_SIGN_SECRET
      );
      req.decoded = decoded;
    }
    next();
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

module.exports = middleware;
