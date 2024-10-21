<script setup>
import { storeToRefs } from "pinia";
import { useBreakpoint } from "vuestic-ui";
import { onBeforeRouteUpdate } from "vue-router";
import { onBeforeUnmount, onMounted, ref, computed } from "vue";

import { useMainStore } from "../../stores/main.js";

import AppNavbar from "../../components/navbar/AppNavbar.vue";
import AppSidebar from "../../components/sidebar/AppSidebar.vue";

const MainStore = useMainStore();
const breakpoints = useBreakpoint();
const { isSidebarMinimized } = storeToRefs(MainStore);

const isMobile = ref(false);
const isTablet = ref(false);

const sidebarWidth = ref("16rem");
const sidebarMinimizedWidth = ref(undefined);

const onResize = () => {
  isSidebarMinimized.value = breakpoints.mdDown;
  isMobile.value = breakpoints.smDown;
  isTablet.value = breakpoints.mdDown;
  sidebarMinimizedWidth.value = isMobile.value ? "0" : "4.5rem";
  sidebarWidth.value = isTablet.value ? "100%" : "16rem";
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  onResize();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});

onBeforeRouteUpdate(() => {
  if (breakpoints.mdDown) {
    isSidebarMinimized.value = true;
  }
});

const isFullScreenSidebar = computed(
  () => isTablet.value && !isSidebarMinimized.value
);

const onCloseSidebarButtonClick = () => {
  isSidebarMinimized.value = true;
};
</script>

<template>
  <VaLayout
    :top="{ fixed: true, order: 2 }"
    :left="{
      fixed: true,
      absolute: breakpoints.mdDown,
      order: 1,
      overlay: breakpoints.mdDown && !isSidebarMinimized,
    }"
    @leftOverlayClick="isSidebarMinimized = true"
  >
    <!-- 上方 Navbar -->
    <template #top>
      <AppNavbar :is-mobile="isMobile" />
    </template>

    <!-- 左側 sidebar -->
    <template #left>
      <AppSidebar
        :minimized="isSidebarMinimized"
        :animated="!isMobile"
        :mobile="isMobile"
      />
    </template>

    <!-- 右側內容 -->
    <template #content>
      <div
        :class="{ minimized: isSidebarMinimized }"
        class="app-layout__sidebar-wrapper"
      >
        <div v-if="isFullScreenSidebar" class="flex justify-end">
          <VaButton
            class="px-4 py-4"
            icon="md_close"
            preset="plain"
            @click="onCloseSidebarButtonClick"
          />
        </div>
      </div>
      <main class="p-4 pt-0">
        <article>
          <RouterView />
        </article>
      </main>
    </template>
  </VaLayout>
</template>

<style lang="scss">
.va-sidebar {
  width: unset !important;
  min-width: unset !important;
}
</style>
