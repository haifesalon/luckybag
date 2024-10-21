<script setup>
import { useBreakpoint } from "vuestic-ui";
import Logo from "@/assets/image/logo.png";

const breakpoint = useBreakpoint();
</script>

<template>
  <!-- 大畫面 -->
  <VaLayout
    v-if="breakpoint.lgUp"
    class="h-screen bg-[var(--va-background-secondary)]"
  >
    <!-- 左側顯示 logo -->
    <template #left>
      <RouterLink
        class="bg-custom h-full flex items-center justify-center"
        style="width: 35vw"
        to="/login"
        aria-label="Visit homepage"
      >
        <VaImage
          :src="Logo"
          style="max-height: 200px; --va-image-content-position: relative"
        />
      </RouterLink>
    </template>
    <!-- 右側顯示內容 -->
    <template #content>
      <main
        class="h-full flex items-center justify-center mx-auto max-w-[420px]"
      >
        <RouterView />
      </main>
    </template>
  </VaLayout>

  <!-- 小畫面 -->
  <VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
    <template #content>
      <div class="p-4">
        <main
          class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]"
        >
          <!-- 上方顯示 logo、下方顯示內容 -->
          <div class="flex flex-col items-start">
            <RouterLink to="/login">
              <VaImage
                fit="contain"
                :src="Logo"
                style="max-height: 200px; --va-image-content-position: relative"
              />
            </RouterLink>
            <RouterView />
          </div>
        </main>
      </div>
    </template>
  </VaLayout>
</template>

<style lang="scss">
.bg-custom {
  background-color: #e4eae2 !important;
}
</style>
