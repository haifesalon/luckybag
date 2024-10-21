<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { ref, computed, reactive } from "vue";
import { validators } from "../../setting/rules.js";
import { showPopup, miniAlertBox } from "../../setting/alert.js";
import { useMainStore } from "../../stores/main.js";

import axios from "../../setting/axios.js";
import dataTable from "@/components/datatable/AppTable.vue";

const url = "/prizes";

const { t } = useI18n();
const mainStore = useMainStore();

const table = ref(null);
const isEdit = ref(false);
const isEditModalActive = ref(false);
const selectedItem = ref(null);

// 外部傳遞參數
const props = defineProps({
  activityId: {
    type: Number,
  },
});

// 序號表單資料
const formData = reactive({
  name: "",
  price: "",
  time: "",
  quantity: 0,
  isEnabled: true,
});

// 定義欄位
const tableColumns = computed(() => {
  return [
    { label: t("prizes_manage.name"), key: "name", sortable: true },
    { label: t("prizes_manage.price"), key: "price", sortable: true },
    { label: t("prizes_manage.time"), key: "time", sortable: true },
    { label: t("prizes_manage.quantity"), key: "quantity", sortable: true },
    {
      label: t("prizes_manage.remainingQty"),
      key: "remainingQty",
      sortable: true,
    },
    { label: t("prizes_manage.isEnabled"), key: "isEnabled", sortable: true },
    { label: " ", key: "actions", width: "5%", align: "right" },
  ];
});

// 顯示新增框
const showCreateModal = async () => {
  clearForm();
  isEdit.value = false;
  isEditModalActive.value = true;
};

// 顯示修改框
const showEditModal = async (rowData) => {
  clearForm();
  selectedItem.value = rowData.id;
  formData.name = rowData.name;
  formData.price = rowData.price;
  formData.time = rowData.time;
  formData.quantity = rowData.quantity;
  formData.isEnabled = rowData.isEnabled == 1 ? true : false;
  isEdit.value = true;
  isEditModalActive.value = true;
};

// 新增資料
const createItem = async () => {
  const result = {
    remainingQty: formData.quantity,
    activityId: props.activityId,
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
    createId: mainStore.userId,
    createTime: new Date().getTime(),
    ...formData,
  };
  const response = await axios.post(url, result);
  const { success } = response.data;
  if (success) {
    isEditModalActive.value = false;
    table.value.getData();
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
    remainingQty: formData.quantity,
    activityId: props.activityId,
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
    ...formData,
  };
  const response = await axios.patch(url + "/" + selectedItem.value, result);
  const { success } = response.data;
  if (success) {
    isEditModalActive.value = false;
    table.value.getData();
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
const deleteItem = async (rowData) => {
  const deleteAction = async () => {
    try {
      const id = rowData.id;
      const response = await axios.delete(url + "/" + id);
      const { success } = response.data;
      if (success) {
        table.value.getData();
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

// 清空資料
const clearForm = () => {
  Object.keys(formData).forEach(
    (key) => (formData[key] = key === "isEnabled" ? true : "")
  );
};
</script>

<template>
  <br />
  <!-- 列表 -->
  <dataTable
    :columns="tableColumns"
    :url="url + '/' + props.activityId"
    :showCreateModal="showCreateModal"
    :showEditModal="showEditModal"
    :createItem="createItem"
    :editItem="editItem"
    :deleteItem="deleteItem"
    ref="table"
  ></dataTable>

  <!-- 獎項新增與修改框 -->
  <VaModal
    v-slot="{ cancel }"
    v-model="isEditModalActive"
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
          <!-- 獎項名稱 -->
          <VaInput
            v-model="formData.name"
            :placeholder="t('prizes_manage.name')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="name"
          />
          <!-- 金額 -->
          <VaInput
            v-model="formData.price"
            :placeholder="t('prizes_manage.price')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="price"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 次數 -->
          <VaInput
            v-model="formData.time"
            :placeholder="t('prizes_manage.time')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="time"
          />
          <!-- 數量 -->
          <VaInput
            type="number"
            v-model="formData.quantity"
            :placeholder="t('prizes_manage.quantity')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="quantity"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 啟用開關 -->
          <VaSwitch
            v-model="formData.isEnabled"
            :true-inner-label="t('btn.enabled')"
            :false-inner-label="t('btn.disabled')"
            class="w-full"
            color="success"
            off-color="danger"
            left-label
          >
            {{ t("prizes_manage.isEnabled") }}
          </VaSwitch>
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

<style lang="scss" scoped></style>
