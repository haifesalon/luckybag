// 匯入套件和函式庫
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuestic } from "vuestic-ui";
import VueLuckyCanvas from "@lucky-canvas/vue";

import App from "./App.vue";
import router from "./router";
import i18n from "./setting/i18n.js";
import vuesticGlobalConfig from "./assets/scss/vuestic-ui/global-config.js";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "./assets/fragments/fontawesome/css/all.css";

// 初始化 Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 持久保存

// 建立 Vue App
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(createVuestic({ config: vuesticGlobalConfig }));
app.use(VueLuckyCanvas);

console.log = function () {};

app.mount("#app");
