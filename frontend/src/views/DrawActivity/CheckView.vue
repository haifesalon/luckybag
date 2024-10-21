<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { useMainStore } from "../../stores/main.js";

import moment from "moment";
import Swal from "sweetalert2";
import axios from "../../setting/axios.js";

import Footer from "../Layouts/FooterLayout.vue";

const { t } = useI18n({});
const router = useRouter();
const mainStore = useMainStore();

const icon = ref("");
const title = ref("");
const text = ref("");
const VerificationData = ref(null);

// 外部傳遞參數
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  try {
    mainStore.setLoading(true);
    const result = { code: props.code };
    const VerificationCode = await axios.post("/draw/verificationCode", result);

    VerificationData.value = VerificationCode.data;

    icon.value = !VerificationData.value.isValid
      ? "error"
      : VerificationData.value.isExpired
        ? "warning"
        : VerificationData.value.prize.isExchange
          ? "warning"
          : "success";

    title.value = !VerificationData.value.isValid
      ? t("checkPage.unqualified")
      : VerificationData.value.isExpired
        ? t("checkPage.expired")
        : VerificationData.value.prize.isExchange
          ? t("checkPage.hasExchange")
          : t("checkPage.qualified");

    text.value = !VerificationData.value.isDraw
      ? t("checkPage.notDraw")
      : VerificationData.value.prize.name +
        " (" +
        VerificationData.value.prize.phone +
        ")<br>" +
        t("checkPage.get") +
        VerificationData.value.prize.prize.replace(/\s/g, "") +
        "<br>" +
        t("checkPage.expiryDate") +
        moment(VerificationData.value.prize.expiryDate).format("YYYY.MM.DD");

    mainStore.setLoading(false);
    Swal.fire({
      icon: icon.value,
      title: title.value,
      html: text.value,
      showConfirmButton: icon.value !== "success" ? false : true,
      confirmButtonText: t("checkPage.exchange"),
      confirmButtonColor: "#3085d6",
      backdrop: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: t("checkCodeBox.title"),
          input: "text",
          confirmButtonText: t("checkCodeBox.confirmButtonText"),
          footer: t("checkCodeBox.notice"),
          confirmButtonColor: "#3085d6",
          backdrop: false,
          allowOutsideClick: false,
          preConfirm: async (checkCode) => {
            if (checkCode !== "") {
              mainStore.setLoading(true);
              const result = { code: props.code, checkCode: checkCode };
              const exchangePrize = await axios.post(
                "/draw/exchangePrize",
                result
              );
              if (!exchangePrize.data.isValid) {
                mainStore.setLoading(false);
                Swal.showValidationMessage(t("checkCodeBox.errorText"));
              }
            } else {
              mainStore.setLoading(false);
              Swal.showValidationMessage(t("checkCodeBox.errorText"));
            }
          },
        }).then((result) => {
          mainStore.setLoading(false);
          Swal.fire({
            icon: "success",
            text: t("checkCodeBox.successExchange"),
            showConfirmButton: false,
            backdrop: false,
            allowOutsideClick: false,
          });
        });
      }
    });
  } catch (e) {
    router.push({ path: "error" });
  }
});
</script>

<template>
  <main>
    <Footer></Footer>
  </main>
</template>

<style lang="scss" scoped>
main {
  background-color: rgb(132, 162, 122) !important;
}
</style>
