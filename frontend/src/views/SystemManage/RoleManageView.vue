<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { ref, computed, reactive } from "vue";
import { validators } from "../../setting/rules.js";
import { showPopup, miniAlertBox } from "../../setting/alert.js";
import { useMainStore } from "../../stores/main.js";

import axios from "../../setting/axios.js";
import dataTable from "@/components/datatable/AppTable.vue";

const { t } = useI18n();
const mainStore = useMainStore();

const roleUrl = "/role";
const rolePageActionUrl = "/permission";

const table = ref(null);
const isEdit = ref(false);
const isEditModalActive = ref(false);
const isGrantModalActive = ref(false);
const selectedItem = ref(null);
const selectedRole = ref(null);
const grantModalTitle = ref(null);

// 角色表單資料
const roleFormData = reactive({
  name: "",
  isEnabled: false,
});

// 角色定義欄位
const roleTableColumns = computed(() => {
  return [
    { label: t("role_manage.id"), width: "5%", key: "id", sortable: true },
    { label: t("role_manage.name"), key: "name", sortable: true },
    { label: t("role_manage.isEnabled"), key: "isEnabled" },
    { label: " ", key: "actions", width: "5%", align: "right" },
  ];
});

// 權限表定義欄位
const grantTableColumns = ref([]);

// 權限表內容
const grantItems = ref([]);

// 顯示角色新增框
const showCreateModal = async () => {
  clearRoleForm();
  isEdit.value = false;
  isEditModalActive.value = true;
};

// 顯示角色修改框
const showEditModal = async (rowData) => {
  clearRoleForm();
  selectedItem.value = rowData.id;
  roleFormData.name = rowData.name;
  roleFormData.isEnabled = rowData.isEnabled == 1 ? true : false;
  isEdit.value = true;
  isEditModalActive.value = true;
};

// 顯示角色權限框
const showPageGrantModal = async (rowData) => {
  clearGrantForm();
  const roleId = rowData.id;
  selectedRole.value = roleId;
  grantModalTitle.value = rowData.name;
  const response = await axios.get(rolePageActionUrl + "/" + roleId);
  const { success, data } = response.data;
  if (success) {
    data.actions.map((actionItem) =>
      grantTableColumns.value.push({
        label: actionItem,
        width: "20%",
        key: actionItem.toLowerCase(),
      })
    );
    grantItems.value = data.permission;
    isGrantModalActive.value = true;
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

// 新增資料
const createItem = async () => {
  const result = {
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
    createId: mainStore.userId,
    createTime: new Date().getTime(),
    ...roleFormData,
  };
  const response = await axios.post(roleUrl, result);
  const { success } = response.data;
  if (success) {
    isEditModalActive.value = false;
    table.value.getData();
    clearRoleForm();
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
    ...roleFormData,
  };
  const response = await axios.patch(
    roleUrl + "/" + selectedItem.value,
    result
  );
  const { success } = response.data;
  if (success) {
    isEditModalActive.value = false;
    table.value.getData();
    clearRoleForm();
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
      const response = await axios.delete(roleUrl + "/" + id);
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

// 修改權限
const changeGrant = async (pageId, action, currentValue) => {
  const result = {
    roleId: selectedRole.value,
    pageId: pageId,
    action: action,
    currentValue: currentValue,
    modifyId: mainStore.userId,
    modifyTime: new Date().getTime(),
    createId: mainStore.userId,
    createTime: new Date().getTime(),
  };
  const response = await axios.post(rolePageActionUrl, result);
  const { success } = response.data;
  if (success) {
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

// 清空角色資料
const clearRoleForm = () => {
  Object.keys(roleFormData).forEach((key) => (roleFormData[key] = ""));
};

// 清空權限資料
const clearGrantForm = () => {
  grantModalTitle.value = null;
  grantTableColumns.value = [{ label: " ", width: "20%", key: "page" }];
  grantItems.value = [];
};
</script>

<template>
  <br />
  <!-- 標題 -->
  <h1 class="page-title">{{ t("role_manage.title") }}</h1>

  <!-- 角色列表 -->
  <dataTable
    :columns="roleTableColumns"
    :url="roleUrl"
    :showCreateModal="showCreateModal"
    :showEditModal="showEditModal"
    :createItem="createItem"
    :editItem="editItem"
    :deleteItem="deleteItem"
    ref="table"
  >
    <template #otherAction="slotProps">
      <VaButton
        preset="primary"
        size="medium"
        icon="mso-list_alt_add"
        color="textPrimary"
        @click="showPageGrantModal(slotProps.data)"
      >
        {{ t("role_manage.pageGrant") }}
      </VaButton>
    </template>
  </dataTable>

  <!-- 角色新增與修改框 -->
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
          <!-- 角色名稱 -->
          <VaInput
            v-model="roleFormData.name"
            :placeholder="t('role_manage.name')"
            class="w-full sm:w-9/10"
            :rules="[validators.required(t('alert.blank_error'))]"
            name="name"
          />
          <!-- 啟用開關 -->
          <VaSwitch
            v-model="roleFormData.isEnabled"
            :true-inner-label="t('btn.enabled')"
            :false-inner-label="t('btn.disabled')"
            color="success"
            off-color="danger"
            left-label
            class="w-full sm:w-1/2"
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

  <!-- 權限框 -->
  <VaModal
    v-slot="{ cancel }"
    v-model="isGrantModalActive"
    size="large"
    mobile-fullscreen
    close-button
    hide-default-actions
    noOutsideDismiss
  >
    <h1 class="va-h5">{{ grantModalTitle }}</h1>
    <br /><br />
    <VaForm class="flex-col justify-start items-start gap-4 inline-flex w-full">
      <div class="self-stretch flex-col justify-start items-start gap-4 flex">
        <div class="flex gap-4 flex-col sm:flex-row w-full">
          <!-- 權限列表 -->
          <VaDataTable
            :columns="grantTableColumns"
            :items="grantItems"
            :wrapper-size="300"
            :item-size="30"
            virtual-scroller
            sticky-header
          >
            <!-- 顯示頁面名稱與 checkbox -->
            <template
              v-for="item in grantTableColumns"
              #[`cell(${item.key})`]="{ value, row }"
            >
              <VaCheckbox
                v-if="item.key != 'page'"
                v-model="row.rowData[item.key]"
                @click="
                  changeGrant(
                    row.rowData['pageId'],
                    item.key,
                    !row.rowData[item.key]
                  )
                "
              />
              <template v-if="item.key === 'page'"> {{ t(value) }} </template>
            </template>
          </VaDataTable>
        </div>
        <!-- 關閉按鈕 -->
        <div
          class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center"
        >
          <VaButton @click="cancel()">
            {{ t("btn.close") }}
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
