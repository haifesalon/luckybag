<script setup>
// 匯入套件和函式庫
import moment from "moment";
import { ref, computed, onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { validators } from "../../setting/rules.js";
import { showPopup, miniAlertBox } from "../../setting/alert.js";
import { useMainStore } from "../../stores/main.js";

import axios from "../../setting/axios.js";

import WinnersView from "./WinnersManageView.vue";
import CodesView from "./CodesManageView.vue";
import PrizesView from "./PrizesManageView.vue";

const { t } = useI18n();
const mainStore = useMainStore();

const url = "/activity";

const showActivityList = ref(true);
const activies = ref([]);
const isLoading = ref(false);

const isEdit = ref(false);
const isModalActive = ref(false);
const selectedItem = ref(null);

// 標籤
const tabs = computed(() => {
  return [
    { key: "winners", text: t("activity_manage.winners") },
    { key: "codes", text: t("activity_manage.codes") },
    { key: "prizes", text: t("activity_manage.prizes") },
  ];
});

// 預設標籤
const defalutTab = tabs.value[0].key;

// 表單資料
const formData = reactive({
  name: "",
  dateTime: {
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

// 新增資料
const createItem = async () => {
  const result = {
    name: formData.name,
    startTime: formData.dateTime.start,
    endTime: formData.dateTime.end,
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
    createId: mainStore.userId,
    createTime: new Date().getTime(),
  };
  const response = await axios.post(url, result);
  const { success } = response.data;
  if (success) {
    isModalActive.value = false;
    getData();
    clearForm();
    miniAlertBox("success", t("alert.create_success"));
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
};

// 修改資料
const editItem = async () => {
  const result = {
    name: formData.name,
    startTime: formData.dateTime.start,
    endTime: formData.dateTime.end,
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
  };
  const response = await axios.patch(url + "/" + selectedItem.value, result);
  const { success } = response.data;
  if (success) {
    isModalActive.value = false;
    getData();
    clearForm();
    miniAlertBox("success", t("alert.update_success"));
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
};

// 刪除資料
const deleteItem = async (id) => {
  const deleteAction = async () => {
    try {
      const response = await axios.delete(url + "/" + id);
      const { success } = response.data;
      if (success) {
        getData();
        miniAlertBox("success", t("alert.delete_success"));
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
  };
  showPopup(
    null,
    t("alert.delete_tip"),
    null,
    t("alert.ok"),
    t("alert.cancel"),
    true,
    null,
    null,
    deleteAction
  );
};

// 顯示新增框
const showCreateItem = async () => {
  clearForm();
  isModalActive.value = true;
  isEdit.value = false;
};

// 顯示修改框
const showEditModal = async (data) => {
  clearForm();
  isModalActive.value = true;
  isEdit.value = true;
  formData.name = data.name;
  formData.dateTime = { start: data.startTime, end: data.endTime };
  selectedItem.value = data.id;
};

// 開啟進入活動畫面
const itemDetail = async (data) => {
  showActivityList.value = false;
  selectedItem.value = data.id;
};

// 關閉活動管理畫面
const closeItemDetail = async () => {
  showActivityList.value = true;
};

// 取得資料
const getData = async () => {
  isLoading.value = true;
  const response = await axios.get(url);
  const { success, data } = response.data;
  if (success) {
    activies.value = data;
    isLoading.value = false;
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
};

// 清空資料
const clearForm = () => {
  formData.name = "";
  formData.dateTime = {
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
};

// 日期格式
const formatDate = (date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// 日期轉換
const parseDate = (text) => {
  const [day, month, year] = text.split("/");
  return new Date(year, month - 1, day);
};

onMounted(async () => {
  try {
    getData();
  } catch (error) {
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
</script>

<template>
  <br />
  <!-- 標題 -->
  <div class="flex justify-between items-center">
    <h1 class="page-title">{{ t("activity_manage.title") }}</h1>
    <VaButton
      preset="secondary"
      icon="mso-close"
      color="secondary"
      v-if="!showActivityList"
      @click="closeItemDetail()"
    />
  </div>

  <!-- 活動列表 -->
  <VaCard v-if="showActivityList">
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="showCreateItem()">
          {{ t("btn.create") }}
        </VaButton>
      </div>
      <VaInnerLoading
        v-if="activies.length > 0 || isLoading"
        :loading="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[4rem]"
      >
        <VaCard
          v-for="activiy in activies"
          :key="activiy.id"
          :style="{
            '--va-card-outlined-border':
              '1px solid var(--va-background-element)',
          }"
          outlined
        >
          <VaCardContent class="flex flex-col h-full">
            <!-- 編輯與刪除按鈕 -->
            <div class="flex justify-between">
              <VaButton
                preset="secondary"
                icon="mso-delete"
                color="danger"
                @click="deleteItem(activiy.id)"
              />
              <VaButton
                preset="secondary"
                icon="mso-edit"
                color="secondary"
                @click="showEditModal(activiy)"
              />
            </div>
            <!-- 活動名稱 & 起迄日期 -->
            <div class="flex flex-col items-center gap-4 grow">
              <h4
                class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis"
              >
                {{ activiy.name }}
              </h4>
              <p>
                <span>
                  {{ moment(activiy.startTime).format("YYYY-MM-DD") }}
                  ~
                  {{ moment(activiy.endTime).format("YYYY-MM-DD") }}
                </span>
              </p>
            </div>
            <br />
            <!-- 活動狀態 -->
            <div class="flex flex-col items-center gap-4 grow">
              <VaBadge
                :text="t('activity_manage.close')"
                color="danger"
                style="--va-badge-font-size: 80%"
                v-if="moment().isSameOrAfter(moment(activiy.endTime))"
              />
              <VaBadge
                :text="t('activity_manage.yetStart')"
                color="danger"
                style="--va-badge-font-size: 80%"
                v-else-if="moment().isBefore(moment(activiy.startTime))"
              />
              <VaBadge
                :text="t('activity_manage.start')"
                color="success"
                style="--va-badge-font-size: 80%"
                v-else
              />
            </div>
            <VaDivider class="my-6" />
            <!-- 進入活動按鈕 -->
            <div class="flex justify-between">
              <VaButton
                icon="mso-login"
                color="warning"
                @click="itemDetail(activiy)"
                block
              >
                {{ t("activity_manage.enter") }}
              </VaButton>
            </div>
          </VaCardContent>
        </VaCard>
      </VaInnerLoading>
    </VaCardContent>
  </VaCard>
  <!-- Tab 切換 -->
  <VaTabs v-model="defalutTab" stateful grow v-else>
    <template #tabs>
      <VaTab v-for="tab in tabs" :key="tab.key" :name="tab.key">
        <!-- Tab 文字 -->
        {{ tab.text }}
      </VaTab>
    </template>
    <br />
    <!-- 切換不同標籤顯示不同組件 -->
    <template v-if="defalutTab === tabs[0].key">
      <WinnersView :activityId="selectedItem" />
    </template>
    <template v-if="defalutTab === tabs[1].key">
      <CodesView :activityId="selectedItem" />
    </template>
    <template v-if="defalutTab === tabs[2].key">
      <PrizesView :activityId="selectedItem" />
    </template>
  </VaTabs>

  <!-- 新增與修改框 -->
  <VaModal
    v-slot="{ cancel }"
    v-model="isModalActive"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    noOutsideDismiss
  >
    <h1 class="va-h5">{{ isEdit ? t("modal.edit") : t("modal.create") }}</h1>
    <br />
    <VaForm
      v-slot="{ isValid }"
      class="flex-col justify-start items-start gap-4 inline-flex w-full"
    >
      <div class="self-stretch flex-col justify-start items-start gap-4 flex">
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 活動名稱 -->
          <VaInput
            v-model="formData.name"
            :placeholder="t('activity_manage.name')"
            class="w-full"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="name"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <VaDateInput
            v-model="formData.dateTime"
            :readonly="false"
            :format-date="formatDate"
            :parse-date="parseDate"
            :rules="[validators.required(t('alert.blank_error'))]"
          />
        </div>
        <!-- 按鈕 -->
        <div
          class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center"
        >
          <VaButton preset="secondary" color="secondary" @click="cancel()">
            {{ t("btn.cancel") }}
          </VaButton>
          <VaButton
            :disabled="!isValid"
            @click="isEdit ? editItem() : createItem()"
          >
            {{ isEdit ? t("btn.update") : t("btn.create") }}
          </VaButton>
        </div>
      </div>
    </VaForm>
  </VaModal>
</template>

<style lang="scss" scoped>
.page-title {
  font-size: 2rem;
}
</style>
