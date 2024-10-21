// 匯入套件
const express = require("express");
const bodyParser = require("body-parser");

// 初始化
const app = express();

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

// 引用 API
require("./controller")(app);

// 監聽連線
app.listen(process.env.PORT || 3000);
