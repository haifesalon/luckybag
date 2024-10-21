// 匯入套件和函式庫
const config = require("../config");
const crypto = require("../helper/crypto");
const userService = require("./userService");
const roleService = require("./roleService");
const userRoleService = require("./userRoleService");
const rolePageActionViewService = require("./rolePageActionViewService");

// 系統設定
const webConfig = config.webConfig;

// 驗證帳密
exports.auth = async (obj) => {
  const { account, password } = obj;
  // 查詢是否有該帳號存在
  const user = await userService.query({ data: { account: account } });
  if (user.total) {
    // 查詢使用者角色
    const userData = user.data[0];
    const userRoleData = await userRoleService.query({
      data: { userId: userData.id },
    });
    const roleData = await roleService.query({
      data: { id: userRoleData.data[0].roleId },
    });
    // 判斷帳號可用、角色可用、密碼正確與否
    if (
      roleData.data[0].isEnabled &&
      userData.isEnabled &&
      userData.authError < 5 &&
      userData.password ===
        crypto.getHash(crypto.HashType.SHA512, password + webConfig.PWD_SALT)
    ) {
      // 根據權限產生頁面選單
      const rolePageData = await rolePageActionViewService.query({
        data: { roleId: userRoleData.data[0].roleId },
        order: ["sort", "asc"],
      });
      const pages = rolePageData.data.reduce((acc, current) => {
        const { pageId, displayName, path, parentId, sort, icon } = current;
        if (!acc.some((page) => page.pageId === pageId)) {
          acc.push({ pageId, displayName, path, parentId, sort, icon });
        }
        return acc;
      }, []);
      const menu = pages
        .filter((page) => page.parentId === 0)
        .map((page) => ({
          pageId: page.pageId,
          name: page.path,
          displayName: page.displayName,
          meta: { icon: page.icon },
        }));
      pages
        .filter((page) => page.parentId !== 0)
        .map((page) => {
          const parentPage = menu.find(
            (parent) => parent.pageId === page.parentId
          );
          if (parentPage.children) {
            parentPage.children.push({
              pageId: page.pageId,
              name: page.path,
              displayName: page.displayName,
              meta: { icon: page.icon },
            });
          } else {
            parentPage.children = [
              {
                pageId: page.pageId,
                name: page.path,
                displayName: page.displayName,
                meta: { icon: page.icon },
              },
            ];
          }
        });

      await userService.update(
        { authError: 0, lastLogin: new Date().getTime() },
        { id: userData.id }
      );
      return { isAuth: true, user: userData, menu: menu };
    } else {
      if (userData.authError >= 4) {
        // 密碼錯誤超過三次，封鎖帳號
        await userService.update(
          { authError: 0, isEnabled: false },
          { id: userData.id }
        );
      } else if (
        userData.password !==
        crypto.getHash(crypto.HashType.SHA512, password + webConfig.PWD_SALT)
      ) {
        // 密碼輸入錯誤
        await userService.update(
          { authError: userData.authError + 1 },
          { id: userData.id }
        );
      }
      return { isAuth: false };
    }
  } else {
    // 帳號不存在
    return { isAuth: false };
  }
};
