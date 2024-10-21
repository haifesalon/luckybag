<script setup>
// 匯入套件和 logo 圖片
import { useI18n } from "vue-i18n";
import Logo from "@/assets/image/logo.png";

// 初始化 i18n
const { t } = useI18n();
</script>

<template>
  <div
    class="flex flex-col justify-between h-screen items-center bg-[var(--va-background-secondary)]"
  >
    <!-- 顯示 Logo -->
    <RouterLink to="/">
      <VaImage
        fit="contain"
        :src="Logo"
        style="max-height: 200px; --va-image-content-position: relative"
      />
    </RouterLink>
    <!-- 顯示錯誤訊息 -->
    <div class="flex flex-col items-center gap-6 px-4 my-8">
      <h1 class="va-h1 text-center sm:text-5xl text-4xl">
        {{ t("error_page.title") }}
      </h1>
      <p class="text-center">{{ t("error_page.detail") }}</p>
    </div>
    <div />
  </div>
</template>

<style lang="scss" scoped></style>
