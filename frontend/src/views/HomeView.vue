<script setup>
// 匯入套件和函式庫
import { reactive, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { showPopup } from "../setting/alert.js";

import axios from "../setting/axios.js";

const { t } = useI18n();

const activityOptions = ref([]);

// dashboard 資訊
const dashboardData = reactive({
  activity: 1,
  numOfExchanges: -1,
  numOfPrizes: -1,
  numOfWinners: -1,
  prizes: [],
});

// 取得 dashboard 資訊
const getData = async () => {
  // 載入頁面時取得所需資訊
  const result = { activityId: dashboardData.activity };
  const response = await axios.post("/dashboard", result);
  const { success, data } = response.data;
  if (success) {
    dashboardData.numOfExchanges = data.numOfExchanges;
    dashboardData.numOfPrizes = data.numOfPrizes;
    dashboardData.numOfWinners = data.numOfWinners;
    dashboardData.prizes = data.prizes;
  }
};

// 預先載入資料供列表使用
onMounted(async () => {
  const response = await axios.get("/activity");
  const { success, data } = response.data;
  if (success) {
    activityOptions.value = data.map((item) => ({
      text: item.name,
      value: item.id,
    }));
    await getData();
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
});

// 監聽是否有變動
watch(
  dashboardData,
  () => {
    getData();
  },
  { deep: true }
);
</script>

<template>
  <br />
  <!-- 標題 -->
  <h1 class="page-title">Dashboard</h1>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <VaCard class="w-full flex flex-col">
        <VaCardTitle class="flex items-start justify-between">
          <h1 class="card-title text-secondary font-bold uppercase">
            {{ t("dashboard.drawStatistics") }}
          </h1>
          <div class="flex gap-2">
            <p class="whitespace-nowrap mt-2">{{ t("dashboard.activity") }}:</p>
            <VaSelect
              v-model="dashboardData.activity"
              preset="small"
              :options="activityOptions"
              class="w-28"
              value-by="value"
            />
            <!-- 刷新按鈕 -->
            <VaButton @click="getData" color="warning" size="small">
              <VaIcon aria-hidden="true" name="mso-restart_alt" size="12px" />
              &nbsp;{{ t("btn.refresh") }}
            </VaButton>
          </div>
        </VaCardTitle>
        <VaCardContent
          class="flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 h-full"
        >
          <section
            class="flex flex-col items-start w-full sm:w-1/3 md:w-2/5 lg:w-1/4 gap-2 md:gap-8 pl-4"
          >
            <div></div>
            <div class="flex flex-col sm:flex-col gap-2 md:gap-8 w-full">
              <div>
                <div class="flex items-center">
                  <span class="text-secondary">
                    {{ t("dashboard.numOfExchanges") }}
                  </span>
                </div>
                <div class="mt-2 text-xl font-semibold">
                  {{ dashboardData.numOfExchanges }}
                </div>
              </div>
              <div>
                <div class="flex items-center">
                  <span class="text-secondary">
                    {{ t("dashboard.numOfWinners") }}
                  </span>
                </div>
                <div class="mt-2 text-xl font-semibold">
                  {{ dashboardData.numOfWinners }}
                </div>
              </div>
              <div>
                <div class="flex items-center">
                  <span class="text-secondary">
                    {{ t("dashboard.numOfPrizes") }}
                  </span>
                </div>
                <div class="mt-2 text-xl font-semibold">
                  {{ dashboardData.numOfPrizes }}
                </div>
              </div>
            </div>
          </section>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <VaCard v-for="prize in dashboardData.prizes">
        <VaCardContent>
          <section>
            <header class="flex items-center justify-between">
              <div class="text-lg font-semibold grow">{{ prize.name }}</div>
            </header>
            <br />
            <div>
              <p class="mb-2">
                {{ prize.exchange }} / {{ prize.winners }} /
                {{ prize.quantity }}
              </p>
              <p class="text-xs text-secondary">
                {{ t("dashboard.exchange") }} / {{ t("dashboard.winners") }} /
                {{ t("dashboard.quantity") }}
              </p>
            </div>
          </section>
        </VaCardContent>
      </VaCard>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
