<script setup>
// 匯入套件和函式庫
import { useI18n } from "vue-i18n";
import { watch, ref, onMounted, computed } from "vue";
import { showPopup } from "../../setting/alert.js";

import axios from "../../setting/axios.js";

const { t } = useI18n();

const items = ref([]);
const isLoading = ref(false);
const itemsLength = ref(0);

// 外部傳遞參數
const props = defineProps({
  columns: Array,
  url: String,
  currentPage: {
    type: Number,
    default: 1,
  },
  rowsPerPage: {
    type: Number,
    default: 5,
  },
  sortBy: {
    type: String,
    default: "id",
  },
  sortType: {
    type: String,
    default: "asc",
  },
  noSearch: {
    type: Boolean,
    default: false,
  },
  noCreate: {
    type: Boolean,
    default: false,
  },
  noEdit: {
    type: Boolean,
    default: false,
  },
  noDelete: {
    type: Boolean,
    default: false,
  },
  showRefreshBtn: {
    type: Boolean,
    default: false,
  },
  showCreateModal: Function,
  showEditModal: Function,
  createItem: Function,
  editItem: Function,
  deleteItem: Function,
});

// 表格分頁項目
const tableOptions = ref({
  page: props.currentPage,
  rowsPerPage: props.rowsPerPage,
  sortBy: props.sortBy,
  sortType: props.sortType,
  search: "",
});

// 取得資料
const getData = async () => {
  isLoading.value = true;
  const response = await axios.post(
    props.url + "/pagination",
    tableOptions.value
  );
  const { data, recordsFiltered } = response.data;
  items.value = data;
  itemsLength.value = recordsFiltered;
  // 如果該頁面為空則往前跳一頁
  if (tableOptions.value.page > 1 && data.length === 0) {
    tableOptions.value.page--;
  }
  isLoading.value = false;
};

// 計算總頁數
const totalPages = computed(() =>
  Math.ceil(itemsLength.value / tableOptions.value.rowsPerPage)
);

// 初始預設取得資料
onMounted(() => {
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

// 監聽是否有變動
watch(
  tableOptions,
  () => {
    getData();
  },
  { deep: true }
);

// 回傳 getData 函式給外部使用
defineExpose({ getData });
</script>

<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <!-- 搜尋框 -->
          <VaInput
            v-model="tableOptions.search"
            :placeholder="t('table.search')"
            v-if="!noSearch"
          ></VaInput>
        </div>
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <!-- 新增按鈕 -->
          <VaButton @click="showCreateModal" v-if="!noCreate" color="success">
            <VaIcon aria-hidden="true" name="mso-add" size="20px" />
            {{ t("btn.create") }}
          </VaButton>
          <!-- 刷新按鈕 -->
          <VaButton @click="getData" v-if="showRefreshBtn" color="warning">
            <VaIcon aria-hidden="true" name="mso-restart_alt" size="20px" />
            {{ t("btn.refresh") }}
          </VaButton>
        </div>
      </div>

      <!-- 表格 -->
      <VaDataTable
        v-model:sort-by="tableOptions.sortBy"
        v-model:sorting-order="tableOptions.sortType"
        :columns="props.columns"
        :items="items"
        :loading="isLoading"
        :noDataHtml="t('table.no_data')"
        selected-color="secondary"
        hoverable
      >
        <!-- 如果是 expiryDate 顯示特殊樣式 -->
        <template #cell(expiryDate)="{ value }">
          {{ new Date(value).toLocaleDateString() }}
        </template>
        <!-- 如果是 isExchange 顯示特殊樣式 -->
        <template #cell(isExchange)="{ value }">
          <VaBadge
            v-if="value === '1'"
            :text="t('btn.exchange')"
            color="success"
            style="--va-badge-font-size: 80%"
          />
          <VaBadge
            v-else
            :text="t('btn.noExchange')"
            color="danger"
            style="--va-badge-font-size: 80%"
          />
        </template>
        <!-- 如果是 isEnabled 顯示特殊樣式 -->
        <template #cell(isEnabled)="{ value }">
          <VaBadge
            v-if="value === '1'"
            :text="t('btn.enabled')"
            color="success"
            style="--va-badge-font-size: 80%"
          />
          <VaBadge
            v-else
            :text="t('btn.disabled')"
            color="danger"
            style="--va-badge-font-size: 80%"
          />
        </template>
        <!-- 每列後面顯示編輯與刪除按鈕 -->
        <template #cell(actions)="{ rowData }">
          <div class="flex gap-2 justify-end">
            <VaButton
              v-if="!noEdit"
              preset="primary"
              size="medium"
              icon="mso-edit"
              color="primary"
              @click="showEditModal(rowData)"
            >
              {{ t("btn.update") }}
            </VaButton>
            <VaButton
              v-if="!noDelete"
              preset="primary"
              size="medium"
              icon="mso-delete"
              color="danger"
              @click="deleteItem(rowData)"
            >
              {{ t("btn.delete") }}
            </VaButton>
            <slot name="otherAction" :data="rowData"></slot>
          </div>
        </template>
      </VaDataTable>

      <div
        class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2"
      >
        <!-- 顯示資料數量 -->
        <div>
          <b>{{ t("table.total", { num: itemsLength }) }}</b>
        </div>
        <!-- 分頁按鈕 -->
        <div v-if="totalPages > 1" class="flex">
          <!-- 上一頁 -->
          <VaButton
            preset="secondary"
            icon="va-arrow-left"
            aria-label="Previous page"
            :disabled="tableOptions.page === 1"
            @click="tableOptions.page--"
          />
          <!-- 當前頁數選擇 -->
          <VaPagination
            v-model="tableOptions.page"
            buttons-preset="secondary"
            :pages="totalPages"
            :visible-pages="5"
            :boundary-links="false"
            :direction-links="false"
          />
          <!-- 下一頁 -->
          <VaButton
            class="mr-2"
            preset="secondary"
            icon="va-arrow-right"
            aria-label="Next page"
            :disabled="tableOptions.page === totalPages"
            @click="tableOptions.page++"
          />
        </div>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<style lang="scss" scoped></style>
