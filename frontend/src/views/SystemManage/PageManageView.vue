<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { ref, computed, reactive, watchEffect } from "vue";
import { validators } from "../../setting/rules.js";
import { showPopup, miniAlertBox } from "../../setting/alert.js";
import { useMainStore } from "../../stores/main.js";

import axios from "../../setting/axios.js";
import dataTable from "@/components/datatable/AppTable.vue";

const { t } = useI18n();
const mainStore = useMainStore();

const url = "/page";

const table = ref(null);
const isEdit = ref(false);
const isModalActive = ref(false);
const selectedItem = ref(null);
const pageOptions = ref(null);

// 表單資料
const formData = reactive({
  name: "",
  displayName: "",
  path: "",
  parentId: 0,
  sort: 0,
  icon: "",
});

// 定義欄位
const tableColumns = computed(() => {
  return [
    { label: t("page_manage.id"), width: "5%", key: "id", sortable: true },
    { label: t("page_manage.name"), key: "name", width: "30%", sortable: true },
    { label: t("page_manage.path"), key: "path", width: "30%", sortable: true },
    { label: t("page_manage.icon"), key: "icon", width: "30%" },
    { label: " ", key: "actions", width: "5%", align: "right" },
  ];
});

// 顯示新增框
const showCreateModal = async () => {
  clearForm();
  isEdit.value = false;
  isModalActive.value = true;
};

// 顯示修改框
const showEditModal = async (data) => {
  clearForm();
  selectedItem.value = data.id;
  formData.name = data.name;
  formData.displayName = data.displayName;
  formData.path = data.path;
  formData.parentId = data.parentId;
  formData.sort = data.sort;
  formData.icon = data.icon;
  isEdit.value = true;
  isModalActive.value = true;
};

// 新增資料
const createItem = async () => {
  const result = {
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
    createId: mainStore.userId,
    createTime: new Date().getTime(),
    ...formData,
  };
  const response = await axios.post(url, result);
  const { success } = response.data;
  if (success) {
    isModalActive.value = false;
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
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
    ...formData,
  };
  const response = await axios.patch(url + "/" + selectedItem.value, result);
  const { success } = response.data;
  if (success) {
    isModalActive.value = false;
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
const deleteItem = async (data) => {
  const deleteAction = async () => {
    try {
      const id = data.id;
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
  Object.keys(formData).forEach((key) => (formData[key] = ""));
};

// 預先載入頁面資料供列表使用
watchEffect(async () => {
  const response = await axios.get(url + "/parent");
  const { success, data } = response.data;
  if (success) {
    pageOptions.value = [
      { text: t("page_manage.noParent"), value: 0 },
      ...data.map((item) => ({ text: item.name, value: item.id })),
    ];
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
</script>

<template>
  <br />
  <!-- 標題 -->
  <h1 class="page-title">{{ t("page_manage.title") }}</h1>

  <!-- 列表 -->
  <dataTable
    :columns="tableColumns"
    :url="url"
    :showCreateModal="showCreateModal"
    :showEditModal="showEditModal"
    :createItem="createItem"
    :editItem="editItem"
    :deleteItem="deleteItem"
    ref="table"
  >
  </dataTable>

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
          <!-- 頁面名稱 -->
          <VaInput
            v-model="formData.name"
            :placeholder="t('page_manage.name')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="name"
          />
          <!-- 顯示名稱 -->
          <VaInput
            v-model="formData.displayName"
            :placeholder="t('page_manage.displayName')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="displayName"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 路徑 -->
          <VaInput
            v-model="formData.path"
            :placeholder="t('page_manage.path')"
            class="w-full sm:w-1/2"
            name="path"
          />
          <!-- 圖標 -->
          <VaInput
            v-model="formData.icon"
            :placeholder="t('page_manage.icon')"
            class="w-full sm:w-1/2"
            name="icon"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 父頁面 -->
          <VaSelect
            v-model="formData.parentId"
            :placeholder="t('page_manage.parentId')"
            class="w-full sm:w-1/2"
            :options="pageOptions"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="parent"
            value-by="value"
          />
          <!-- 排序 -->
          <VaInput
            type="number"
            v-model="formData.sort"
            :placeholder="t('page_manage.sort')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="sort"
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
