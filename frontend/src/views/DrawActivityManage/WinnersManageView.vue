<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { ref, computed, reactive } from "vue";
import { useMainStore } from "../../stores/main.js";
import { validators } from "../../setting/rules.js";
import { showPopup, miniAlertBox } from "../../setting/alert.js";

import axios from "../../setting/axios.js";
import Swal from "sweetalert2";
import dataTable from "@/components/datatable/AppTable.vue";

const url = "/winners";

const { t } = useI18n();
const mainStore = useMainStore();

const isModalActive = ref(false);
const table = ref(null);
const selectedItem = ref(null);

// 外部傳遞參數
const props = defineProps({
  activityId: {
    type: Number,
  },
});

// 表單資料
const formData = reactive({
  dateTime: new Date(),
});

// 定義欄位
const tableColumns = computed(() => {
  return [
    { label: t("winner_manage.id"), key: "id", sortable: true },
    { label: t("winner_manage.name"), key: "winnerName", sortable: true },
    { label: t("winner_manage.phone"), key: "phone", sortable: true },
    { label: t("winner_manage.isExchange"), key: "isExchange", sortable: true },
    { label: t("winner_manage.code"), key: "code", sortable: true },
    { label: t("winner_manage.prize"), key: "prizeName", sortable: true },
    { label: t("winner_manage.expiryDate"), key: "expiryDate", sortable: true },
    { label: " ", key: "actions", width: "5%", align: "right" },
  ];
});

// 兌換按鈕
const exchangeItem = async (rowData) => {
  Swal.fire({
    title: t("winner_manage.exchange_reason"),
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: t("alert.ok"),
    cancelButtonText: t("alert.cancel"),
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    preConfirm: async (text) => {
      try {
        const result = {
          isExchange: true,
          remark: text,
          modifyId: mainStore.userId,
          modifyTime: new Date().getTime(),
        };
        const response = await axios.patch(url + "/" + rowData.id, result);
        const { success } = response.data;
        if (success) {
          table.value.getData();
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
      } catch (e) {
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
    },
  });
};

// 顯示兌換期限框
const changeExpiryDate = async (rowData) => {
  formData.dateTime = new Date(rowData.expiryDate);
  isModalActive.value = true;
  selectedItem.value = rowData.id;
};

// 修改兌換期限
const editItem = async () => {
  try {
    const result = {
      expiryDate: formData.dateTime,
      modifyId: mainStore.userId,
      modifyTime: new Date().getTime(),
    };
    const response = await axios.patch(url + "/" + selectedItem.value, result);
    const { success } = response.data;
    if (success) {
      table.value.getData();
      isModalActive.value = false;
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
  } catch (e) {
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

// 日期格式
const formatDate = (date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// 日期轉換
const parseDate = (text) => {
  const [day, month, year] = text.split("/");
  return new Date(year, month - 1, day);
};

// 清空資料
const clearForm = () => {
  formData.dateTime = new Date();
};
</script>

<template>
  <br />
  <!-- 列表 -->
  <dataTable
    :columns="tableColumns"
    :url="url + '/' + props.activityId"
    showRefreshBtn
    noCreate
    ref="table"
    noEdit
    noDelete
  >
    <template #otherAction="slotProps">
      <VaButton
        preset="primary"
        size="medium"
        icon="mso-partner_exchange"
        color="success"
        v-if="slotProps.data.isExchange === 0"
        @click="exchangeItem(slotProps.data)"
      >
        {{ t("winner_manage.exchange") }}
      </VaButton>
      <VaButton
        preset="primary"
        size="medium"
        icon="mso-calendar_month"
        color="primary"
        @click="changeExpiryDate(slotProps.data)"
      >
        {{ t("winner_manage.changeExpiryDate") }}
      </VaButton>
    </template>
  </dataTable>
  <!-- 修改框 -->
  <VaModal
    v-slot="{ cancel }"
    v-model="isModalActive"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    noOutsideDismiss
  >
    <h1 class="va-h5">{{ t("modal.edit") }}</h1>
    <br />
    <VaForm
      v-slot="{ isValid }"
      class="flex-col justify-start items-start gap-4 inline-flex w-full"
    >
      <div class="self-stretch flex-col justify-start items-start gap-4 flex">
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 兌換期限 -->
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
          <VaButton :disabled="!isValid" @click="editItem()">
            {{ t("btn.update") }}
          </VaButton>
        </div>
      </div>
    </VaForm>
  </VaModal>
</template>

<style lang="scss" scoped></style>
