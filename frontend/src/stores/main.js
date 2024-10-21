// 匯入 pinia 套件
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  persist: true, // 設置狀態持久化，使得狀態在頁面刷新後仍然保留
  state: () => {
    return {
      isLoading: false, // 是否載入中
      userId: 0, // 使用者 id
      userName: null, // 使用者暱稱
      userToken: null, // 使用者 token
      isSidebarMinimized: false, // sidebar 是否縮小
      sidebarMenu: {
        // sidebar 選單
        root: {
          name: "/",
          displayName: "home",
        },
        routes: [],
      },
    };
  },
  actions: {
    // 設定 sidebar 縮放
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized;
    },
    // 設定使用者資料
    setUser(payload) {
      if (payload.id) {
        this.userId = payload.id;
      }
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.token) {
        this.userToken = payload.token;
      }
    },
    // 設定 sidebar 選單
    setSidebarMenu(payload) {
      this.sidebarMenu.routes = payload;
    },
    // 設定載入狀態
    setLoading(newLoading) {
      this.isLoading = newLoading;
    },
    // 重置狀態
    resetState() {
      this.userId = 0;
      this.userName = null;
      this.userToken = null;
      this.isSidebarMinimized = false;
      this.sidebarMenu.routes = [];
      this.isLoading = false;
    },
  },
});
