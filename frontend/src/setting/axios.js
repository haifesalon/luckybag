// 匯入 axios 套件
import axios from "axios";
// 匯入存取庫
import { useMainStore } from "../stores/main.js";

// 建立 axios 實例
const instance = axios.create({
  baseURL: "/api", // 設定請求的基礎 URL
  timeout: 1000, // 設定請求的超時時間 1000 毫秒
  withCredentials: false, // 設定跨域請求是否攜帶跨域憑證
});

// 設定請求攔截器
instance.interceptors.request.use((config) => {
  // 主要存取庫
  const mainStore = useMainStore();
  //  設定 header 跨域
  config.headers["Access-Control-Allow-Origin"] = "*";
  // 判斷是否為 public 請求
  if (!config.url.includes("/public")) {
    // 設定 header 帶 authorization 為 token (從存取庫取出)
    config.headers["authorization"] = mainStore.userToken;
  }
  // 返回 config
  return config;
});

// 導出 axios 實例
export default instance;
