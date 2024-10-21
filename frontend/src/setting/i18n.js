// 匯入套件和函式庫
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

// 預設語系為繁體中文
let locale = "zh_TW";

// 檢查 localStorage 是否有儲存語言設定
if (localStorage.getItem("locale")) {
  // 如果有儲存的語言設定，使用儲存的語言
  locale = localStorage.getItem("locale");
} else {
  // 如果沒有儲存的語言設定，使用預設語系並儲存到 localStorage 中
  localStorage.setItem("locale", locale);
}

// 創建 i18n 實例
export default createI18n({
  legacy: false, // 非遺留模式，使用 Composition API 的方式設定 i18n
  globalInjection: true, // 全局注入，將 $i18n 注入到全局的 Vue 實例中，使其在整個應用中都可用
  locale: locale, // 設定當前的語言
  fallbackLocale: locale, // 設定回退語言為當前語言，表示找不到匹配的翻譯時將使用當前語言作為回退語言
  messages, // 包含多語言翻譯資料的對象，由 @intlify/unplugin-vue-i18n 提供
});
