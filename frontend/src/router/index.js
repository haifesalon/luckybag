// 匯入套件和函式庫
import { useMainStore } from "../stores/main.js";
import { createRouter, createWebHistory } from "vue-router";

import axios from "../setting/axios.js";

import AppLayout from "../views/Layouts/AppLayout.vue";
import AuthLayout from "../views/Layouts/AuthLayout.vue";
import DrawLayout from "../views/Layouts/DrawLayout.vue";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import ErrorView from "../views/ErrorView.vue";

import MainView from "../views/DrawActivity/MainView.vue";
import PrizeView from "../views/DrawActivity/PrizeView.vue";
import CheckView from "../views/DrawActivity/CheckView.vue";

import UserManageView from "../views/SystemManage/UserManageView.vue";
import RoleManageView from "../views/SystemManage/RoleManageView.vue";
import PageManageView from "../views/SystemManage/PageManageView.vue";

import ActivityManageView from "../views/DrawActivityManage/ActivityManageView.vue";

import { defaultDocumentTitle } from "../setting/config.js";

// 定義路由配置
const routes = [
  {
    path: "/",
    component: DrawLayout,
    name: "DrawView",
    redirect: { name: "draw" },
    children: [
      {
        name: "draw",
        path: "/draw/home",
        component: MainView,
        meta: { requiresAuth: false },
        props: (route) => ({
          code: route.query.code,
        }),
      },
      {
        name: "prize",
        path: "/draw/prize",
        component: PrizeView,
        meta: { requiresAuth: false },
        props: (route) => ({
          code: route.query.code,
        }),
      },
      {
        name: "check",
        path: "/draw/check",
        component: CheckView,
        meta: { requiresAuth: false },
        props: (route) => ({
          code: route.query.code,
        }),
      },
    ],
  },
  {
    path: "/admin",
    component: AppLayout,
    name: "AdminView",
    redirect: { name: "home" },
    children: [
      {
        name: "home",
        path: "/admin/home",
        component: HomeView,
        meta: { requiresAuth: true },
      },
      {
        name: "activity",
        path: "/admin/activity",
        component: ActivityManageView,
        meta: { requiresAuth: true },
      },
      {
        name: "user",
        path: "/admin/user",
        component: UserManageView,
        meta: { requiresAuth: true },
      },
      {
        name: "role",
        path: "/admin/role",
        component: RoleManageView,
        meta: { requiresAuth: true },
      },
      {
        name: "page",
        path: "/admin/page",
        component: PageManageView,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    name: "auth",
    redirect: { name: "login" },
    children: [
      {
        name: "login",
        path: "/login",
        component: LoginView,
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: "/error",
    component: ErrorView,
    name: "error",
    meta: { requiresAuth: false },
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/error",
  },
];

// 創建路由實例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用模式
  // 設置滾動行為，回到頂部或根據 savedPosition 恢復位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    } else {
      window.scrollTo(0, 0);
    }
  },
  routes, // 路由配置
});

// 路由進入前
router.beforeEach(async (to, from, next) => {
  // 路由
  const path = to.path;
  // 查詢參數
  const query = to.query;
  // 存取庫
  const mainStore = useMainStore();
  // 判斷頁面是否需要驗證權限
  if (to.meta.requiresAuth) {
    // 如果有 token 則驗證 token，否則重置狀態並跳轉到登入頁
    if (mainStore.userToken) {
      const response = await axios.post("/public/authenticateToken", {
        token: mainStore.userToken,
      });
      const { success } = response.data;
      // 判斷 token 若驗證不成功跳轉到登入頁
      if (!success) {
        mainStore.resetState();
        return next({ name: "login" });
      }
    } else {
      mainStore.resetState();
      return next({ name: "login" });
    }
  }
  // 判斷抽獎頁面狀態
  if (path !== "/error" && path.includes("/draw/")) {
    if ("code" in query) {
      if (path !== "/draw/check") {
        const checkData = await axios.post("/draw/verificationCode", {
          code: query.code,
        });
        const isValid = checkData.data.isValid;
        const isDraw = checkData.data.isDraw;
        if (isValid) {
          if (path === "/draw/home" && isDraw) {
            return next({ name: "prize", query: { code: query.code } });
          } else if (path === "/draw/prize" && !isDraw) {
            return next({ name: "draw", query: { code: query.code } });
          }
        } else {
          return next({ name: "error" });
        }
      }
    } else {
      return next({ name: "error" });
    }
  }

  return next(); // 繼續執行
});

// 路由進入後
router.afterEach((to) => {
  // 設置網頁頁籤標題
  document.title = to.meta?.title
    ? `${to.meta.title} | ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});

// 導出路由
export default router;
