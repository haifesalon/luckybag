<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { reactive, onMounted, ref, watch } from "vue";
import { useMainStore } from "../../stores/main.js";

import Swal from "sweetalert2";
import axios from "../../setting/axios.js";
import Footer from "../Layouts/FooterLayout.vue";

const { t, locale } = useI18n({});

const router = useRouter();
const mainStore = useMainStore();

const isModalActive = ref(false);

// 外部傳遞參數
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

// 定義欄位
const form = reactive({
  userName: "",
  phone: "",
});

// 定義變數
const showRegister = ref(true);
const isDrawing = ref(false);
const luckyWheel = ref(null);

const blocks = [{ padding: "13px", background: "#617df2" }];

var prizes = [];

const buttons = [
  {
    radius: "35%",
    background: "#8a9bf3",
    pointer: true,
    fonts: [
      { text: t("drawPage.buttonText"), top: "-10px", fontWeight: "800" },
    ],
  },
];

// 前往抽獎頁面
const goDraw = () => {
  isDrawing.value = true;
  if (form.userName && form.phone) {
    Swal.fire({
      title: t("confirmBox.title"),
      html:
        "<br>" +
        t("confirmBox.name") +
        `${form.userName}` +
        "<br>" +
        t("confirmBox.phone") +
        `${form.phone}`,
      footer: t("confirmBox.notice"),
      confirmButtonText: t("confirmBox.confirmButtonText"),
      confirmButtonColor: "#52a551",
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonColor: "#dd3333",
      cancelButtonText: t("confirmBox.cancelButtonText"),
      allowOutsideClick: false,
    }).then((result) => {
      isDrawing.value = false;
      if (result.isConfirmed) {
        showRegister.value = false;
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: t("alert.blank_error"),
      showConfirmButton: false,
      showCloseButton: true,
    }).then((result) => {
      isDrawing.value = false;
    });
  }
};

// 開始抽獎
const startDraw = async () => {
  if (props.code) {
    if (form.userName && form.phone) {
      luckyWheel.value.play();
      const result = {
        code: props.code,
        userName: form.userName,
        phone: form.phone,
      };
      const response = await axios.post("/draw", result);
      const { success, prize, prizeId } = response.data;
      if (success) {
        setTimeout(() => {
          const index = prizes.findIndex((element) => element.id === prizeId);
          luckyWheel.value.stop(index);
          setTimeout(() => {
            Swal.fire({
              title: t("congratulationBox.title"),
              html: t("congratulationBox.text") + prize.replace(/\s/g, ""),
              confirmButtonText: t("congratulationBox.confirmButtonText"),
              confirmButtonColor: "#3085d6",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                router.push({
                  path: "/draw/prize",
                  query: { code: props.code },
                });
              }
            });
          }, 3000);
        }, 3000);
      }
    } else {
      showRegister.value = true;
    }
  } else {
    router.push({ path: "error" });
  }
};

// 開啟活動辦法
const openAgreementModal = () => {
  isModalActive.value = true;
};

onMounted(async () => {
  // 載入頁面時取得所有獎項放入轉盤
  mainStore.setLoading(true);
  const result = { code: props.code };
  const response = await axios.post("/draw/getAllPrize", result);
  const { success, prizeArray } = response.data;
  if (success) {
    prizes = prizeArray;
  }
  luckyWheel;
  mainStore.setLoading(false);
});
</script>

<template>
  <main>
    <!-- 抽獎人資訊表單 -->
    <div class="registerForm" v-if="showRegister">
      <!-- 標題 -->
      <h3>{{ $t("title") }}</h3>

      <!-- 真實姓名 -->
      <label for="userName">{{ $t("userInput.name") }}</label>
      <input
        type="text"
        :placeholder="$t('userInput.namePlaceholder')"
        id="userName"
        v-model="form.userName"
      />

      <!-- 電話 -->
      <label for="phone">{{ $t("userInput.phone") }}</label>
      <input
        type="tel"
        :placeholder="$t('userInput.phonePlaceholder')"
        id="phone"
        v-model="form.phone"
      />

      <!-- 開始抽獎按鈕 -->
      <button @click="goDraw" :disabled="isDrawing">
        {{ $t("userInput.startDraw") }}
      </button>

      <!-- 活動辦法同意文字 -->
      <div class="agreement">
        <a @click="openAgreementModal">{{ $t("userInput.agreement") }}</a>
      </div>
    </div>

    <!-- 抽獎轉盤 -->
    <LuckyWheel
      ref="luckyWheel"
      width="250px"
      height="250px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startDraw"
      v-else
    />

    <!-- 活動辦法 -->
    <VaModal
      v-slot="{ cancel }"
      v-model="isModalActive"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      noOutsideDismiss
    >
    </VaModal>

    <Footer></Footer>
  </main>
</template>

<style lang="scss" scoped>
main {
  background: linear-gradient(
    to right bottom,
    rgb(132, 162, 122),
    rgb(87, 124, 78)
  );
}

.background {
  width: 430px;
  height: 520px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}

.registerForm {
  height: 520px;
  width: 270px;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
}

.registerForm * {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}

.registerForm h3 {
  font-size: 28px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}

.agreement {
  font-size: 12px;
  margin-top: 5%;
}

label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}

input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(224, 224, 224, 0.7);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

::placeholder {
  color: #e5e5e5;
}

button {
  margin-top: 50px;
  width: 100%;
  background-color: #ffffff;
  color: #080710 !important;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
}

.container {
  text-align: center;
}
</style>
