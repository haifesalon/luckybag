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

const url = "/user";
const roleUrl = "/role";

const table = ref(null);
const isEdit = ref(false);
const isModalActive = ref(false);
const selectedItem = ref(null);

const roleOptions = ref(null);

// 表單資料
const formData = reactive({
  realName: "",
  nickName: "",
  role: "",
  account: "",
  password: "",
  isEnabled: false,
});

// 定義欄位
const tableColumns = computed(() => {
  return [
    { label: t("user_manage.realName"), key: "realName", sortable: true },
    { label: t("user_manage.nickName"), key: "nickName", sortable: true },
    { label: t("user_manage.role"), key: "roleName", sortable: true },
    { label: t("user_manage.account"), key: "account", sortable: true },
    {
      label: t("user_manage.isEnabled"),
      key: "userIsEnabled",
      name: "isEnabled",
    },
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
  selectedItem.value = data.userId;
  formData.realName = data.realName;
  formData.nickName = data.nickName;
  formData.role = data.roleId;
  formData.account = data.account;
  formData.password = data.password;
  formData.isEnabled = data.userIsEnabled == 1 ? true : false;
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
      const userId = data.userId;
      const response = await axios.delete(url + "/" + userId);
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
    (key) => (formData[key] = key === "isEnabled" ? false : "")
  );
};

// 預先載入角色資料供列表使用
watchEffect(async () => {
  const response = await axios.get(roleUrl);
  const { success, data } = response.data;
  if (success) {
    roleOptions.value = data.map((item) => ({
      text: item.name,
      value: item.id,
    }));
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
  <h1 class="page-title">{{ t("user_manage.title") }}</h1>

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
          <!-- 真實姓名 -->
          <VaInput
            v-model="formData.realName"
            :placeholder="t('user_manage.realName')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="realName"
          />
          <!-- 暱稱 -->
          <VaInput
            v-model="formData.nickName"
            :placeholder="t('user_manage.nickName')"
            class="w-full sm:w-1/2"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="nickName"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 帳號 -->
          <VaInput
            v-model="formData.account"
            :placeholder="t('user_manage.account')"
            class="w-full"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="account"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 密碼 -->
          <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput
              v-model="formData.password"
              :type="isPasswordVisible.value ? 'text' : 'password'"
              :placeholder="t('user_manage.password')"
              class="w-full"
              :rules="[validators.required(t('alert.blank_error'))]"
              name="password"
              @clickAppendInner.stop="
                isPasswordVisible.value = !isPasswordVisible.value
              "
              clearable
            >
              <template #appendInner>
                <VaIcon
                  :name="
                    isPasswordVisible.value
                      ? 'mso-visibility_off'
                      : 'mso-visibility'
                  "
                  class="cursor-pointer"
                  color="secondary"
                />
              </template>
            </VaInput>
          </VaValue>
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 角色選擇 -->
          <VaSelect
            v-model="formData.role"
            :placeholder="t('user_manage.role')"
            class="w-full"
            :options="roleOptions"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="role"
            value-by="value"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 啟用開關 -->
          <VaSwitch
            v-model="formData.isEnabled"
            :true-inner-label="t('btn.enabled')"
            :false-inner-label="t('btn.disabled')"
            color="success"
            off-color="danger"
            left-label
          >
            {{ t("user_manage.isEnabled") }}
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

<style lang="scss" scoped>
.page-title {
  font-size: 2rem;
}
</style>
