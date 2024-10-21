<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "../../stores/main.js";

import Swal from "sweetalert2";

const { t } = useI18n({});

const mainStore = useMainStore();
const isLoading = ref(mainStore.isLoading);

const checkOrientation = () => {
  var orientation =
    screen.orientation || screen.mozOrientation || screen.msOrientation;
  if (
    location.pathname !== "/draw/check" &&
    orientation.type !== "portrait-primary"
  ) {
    Swal.fire({
      icon: "warning",
      title: t("alert.orientation"),
      grow: "fullscreen",
      showConfirmButton: false,
      backdrop: true,
      allowOutsideClick: false,
    });
  } else {
    if (location.pathname !== "/draw/check") Swal.close();
  }
};

onMounted(async () => {
  checkOrientation();
  window.addEventListener("orientationchange", checkOrientation);
});

onBeforeUnmount(async () => {
  window.removeEventListener("orientationchange", checkOrientation);
});

watch(
  () => mainStore.isLoading,
  (value) => {
    isLoading.value = value;
  }
);
</script>

<template>
  <div id="app">
    <div class="loading" v-show="isLoading">{{ $t("loading") }}</div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0px;
}

main {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  background-size: 400px auto;
  color: white;
  height: 100vh;
  width: 100vw;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right bottom,
    rgb(132, 162, 122),
    rgb(87, 124, 78)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 9999;
}
</style>
