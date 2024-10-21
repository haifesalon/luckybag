<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
import { useMainStore } from "../../stores/main.js";
import Footer from "../Layouts/FooterLayout.vue";

import moment from "moment";
import VueQrcode from "vue-qrcode";
import axios from "../../setting/axios.js";

const { t } = useI18n({});

const router = useRouter();
const mainStore = useMainStore();
const currentURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

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
  price: "",
  prize: "",
  date: "",
  isExchange: false,
});

// 預先讀取資料
onMounted(async () => {
  mainStore.setLoading(true);
  const result = { code: props.code };
  const response = await axios.post("/draw/winnerDate", result);
  const { success, data } = response.data;
  if (success) {
    form.userName = data[0].winnerName;
    form.phone = data[0].phone;
    form.price = data[0].price;
    form.prize = data[0].prizeName + data[0].prizeTime;
    form.isExchange = data[0].isExchange === 1 ? true : false;
    form.date = moment(data[0].expiryDate).format("YYYY.MM.DD");
  }
  mainStore.setLoading(false);
});
</script>

<template>
  <main>
    <div class="container">
      <!-- 已兌換標籤 -->
      <a class="sold_out" v-if="form.isExchange">
        {{ t("prizePage.alreadExchange") }}
      </a>

      <!-- 中獎卡片 -->
      <div class="card">
        <div class="main">
          <div class="co-img">
            <img src="../../assets/image/logo.png" alt="" />
            <vue-qrcode
              type="image/png"
              :color="{ dark: '#000000ff', light: '#ffffffff' }"
              :value="currentURL + '/draw/check?code=' + props.code"
            />
          </div>
          <div class="content">
            <h2>
              {{ form.userName }} <br />
              {{ form.phone }}
            </h2>
            <h1>
              {{ form.price }} <span>{{ form.prize }}</span>
            </h1>
            <p v-if="!form.isExchange">
              {{ $t("prizePage.expiryDate") }} {{ form.date }}
            </p>
            <p v-else>{{ $t("prizePage.directions") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 社群連結 -->
    <div class="social_media">
      <a href="https://www.facebook.com/haifesalon" target="_blank">
        <i aria-hidden="true" class="fab fa-facebook-square"></i>
      </a>
      &emsp;&emsp;&emsp;
      <a href="https://www.instagram.com/haifesalon/" target="_blank">
        <i aria-hidden="true" class="fab fa-instagram"></i>
      </a>
      &emsp;&emsp;&emsp;
      <a href="https://maps.app.goo.gl/P38eoM4RVYNHpoeEA" target="_blank">
        <i aria-hidden="true" class="fab fa-google"></i>
      </a>
    </div>

    <Footer></Footer>
  </main>
</template>

<style lang="scss" scoped>
main {
  background-color: rgb(132, 162, 122) !important;
}

.container {
  width: 100%;
  height: 100vh;
}

.card {
  width: 200px;
  height: 400px;
  border-radius: 5px;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
  padding: 10px 10px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.main {
  justify-content: space-between;
  align-items: center;
}

.card::after {
  position: absolute;
  content: "";
  height: 40px;
  right: -10px;
  border-radius: 40px;
  z-index: 1;
  top: 110px;
  background-color: rgb(132, 162, 122);
  width: 40px;
}

.card::before {
  position: absolute;
  content: "";
  height: 40px;
  left: -10px;
  border-radius: 40px;
  z-index: 1;
  top: 110px;
  background-color: rgb(132, 162, 122);
  width: 40px;
}

.co-img {
  padding-left: 24%;
}

.co-img img {
  width: 100px;
}

.content {
  margin-top: 25%;
  margin-left: 15%;
  text-align: center;
  font-weight: bold;
}

.content h1 {
  font-size: 25px;
  margin-left: -20px;
  margin-top: 15%;
  margin-bottom: 5%;
  color: #565656;
}

.content h1 span {
  font-size: 14px;
}

.content h2 {
  font-size: 16px;
  margin-left: -20px;
  color: #565656;
}

.content p {
  font-size: 14px;
  color: #696969;
  margin-left: -20px;
}

.social_media {
  position: absolute;
  content: "";
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.social_media a {
  text-decoration: none;
  color: white;
}

.social_media i {
  font-size: 25px;
}

.sold_out {
  top: 2em;
  left: -4em;
  color: #fff;
  display: block;
  position: absolute;
  text-align: center;
  text-decoration: none;
  letter-spacing: 0.06em;
  background-color: #a00;
  padding: 0.5em 5em 0.4em 5em;
  text-shadow: 0 0 0.75em #444;
  box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
  font:
    bold 16px/1.2em Arial,
    Sans-Serif;
  -webkit-text-shadow: 0 0 0.75em #444;
  -webkit-box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
  transform: rotate(-45deg) scale(0.75, 1);
  z-index: 10;
}
.sold_out:before {
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  margin: -0.3em -5em;
  transform: scale(0.7);
  -webkit-transform: scale(0.7);
  border: 2px rgba(255, 255, 255, 0.7) dashed;
}
</style>
