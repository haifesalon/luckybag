<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
import { showPopup } from "../setting/alert.js";
import { useMainStore } from "../stores/main.js";

import axios from "../setting/axios.js";

// 初始化 i18n
const { t } = useI18n();

// 頁面路由
const router = useRouter();
// 存取庫
const mainStore = useMainStore();

// 定義欄位
const formData = reactive({
  account: "",
  password: "",
});

// 清除表單
const clearForm = () => {
  formData.account = "";
  formData.password = "";
};

// 登入送出
const submit = async () => {
  if (formData.account && formData.password) {
    try {
      const response = await axios.post("/public/login", {
        account: formData.account,
        password: formData.password,
      });
      const { success, id, name, token, menu } = response.data;
      if (success) {
        mainStore.setUser({ id, name, token });
        mainStore.setSidebarMenu(menu);
        router.push({ name: "home" });
      } else {
        showPopup(
          t("alert.send_error"),
          null,
          "error",
          t("alert.ok"),
          null,
          null,
          null,
          null,
          null
        );
      }
    } catch (error) {
      showPopup(
        t("login.auth_error"),
        null,
        "error",
        t("alert.ok"),
        null,
        null,
        null,
        null,
        null
      );
      clearForm();
    }
  } else {
    showPopup(
      t("alert.blank_error"),
      null,
      "info",
      t("alert.ok"),
      null,
      null,
      null,
      null,
      null
    );
  }
};

// 頁面掛載初始
onMounted(async () => {
  mainStore.resetState();
});
</script>

<template>
  <!-- 登入 Form -->
  <VaForm @submit.prevent="submit">
    <!-- 標題 -->
    <h1 class="font-semibold text-4xl mb-4">{{ t("login.title") }}</h1>
    <!-- 帳號輸入 -->
    <VaInput
      v-model="formData.account"
      class="mb-4"
      :label="t('login.account')"
      type="email"
    />
    <!-- 密碼輸入 -->
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('login.password')"
        @clickAppendInner.stop="
          isPasswordVisible.value = !isPasswordVisible.value
        "
      >
        <template #appendInner>
          <!-- 密碼顯示或隱藏 -->
          <VaIcon
            :name="
              isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'
            "
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>
    <!-- 登入按鈕 -->
    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit">
        {{ t("login.button") }}
      </VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped></style>
