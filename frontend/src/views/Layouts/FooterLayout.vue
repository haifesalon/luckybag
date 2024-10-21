<script setup>
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({});

const setLang = (newLang) => {
  locale.value = newLang;
  localStorage.setItem("locale", newLang);
  location.reload();
};
</script>

<template>
  <footer
    id="footer"
    class="footer bg-main"
    style="position: fixed; bottom: 0px; height: 50px; text-align: center"
  >
    <span id="copyright" class="copyright">
      <div>
        Copyroght © {{ new Date().getFullYear() }} {{ $t("title") }} All rights
        reserved.
      </div>
      <div>
        <span class="lang">
          <a @click="setLang('zh_TW')">繁體中文</a>&emsp; |&emsp;
          <a @click="setLang('en')">English</a>
        </span>
      </div>
    </span>
  </footer>
</template>

<style scoped>
.copyright {
  font-size: 10px;
}

.lang {
  font-size: 10px;
  cursor: pointer;
}
</style>
