<template>
    <n-card>
        <n-form label-placement="left" label-width="100">
            <n-grid
                item-responsive
                :cols="3"
                :x-gap="16"
                :collapsed="gridCollapsed"
                :collapsed-rows="gridCollapsedRows"
            >
                <n-form-item-gi
                    v-for="item in searchFieldColumns"
                    :key="item.key"
                    :label="item.title"
                    :path="item.key">
                    <n-select
                        v-if="item.valueType === 'select'"
                        v-model:value="searchFormData[item.key]"
                        :options="item.filterOptions"
                    />
                    <n-date-picker
                        v-else-if="item.valueType === 'date'"
                        v-model:value="searchFormData[item.key]"
                        type="date"
                    />
                    <n-input
                        v-else
                        v-model:value="searchFormData[item.key]"
                        :placeholder="`Input ${item.key}`" />
                </n-form-item-gi>
                <n-gi suffix #="{ overflow }">
                    <n-space justify="end">
                        <n-button @click="handleReset">重置</n-button>
                        <n-button type="primary" @click="handleSearch">查询</n-button>
                        <n-button type="info" @click="gridCollapsed = !gridCollapsed">
                            {{ gridCollapsed ? '展开': '折叠' }}
                        </n-button>
                    </n-space>
                </n-gi>
            </n-grid>
        </n-form>
    </n-card>
    <n-card class="flex-1 mt-12px shadow-sm">
        <template #header>
            <n-skeleton v-if="loading" text width="40%" />
            <template v-else>{{ pageTitle }}</template>
        </template>
        <template #header-extra>
            <n-space>
                <create-button
                    v-if="showCreate !== false"
                    @click="handleCreate" />
                <n-button-group>
                    <refresh-button
                        @click="() => loadData(1)"
                        :loading="loading" />
                    <density-button @update:select="handleSelectForTableSize" />
                    <!-- <column-setting v-model:columns="columns" secondary /> -->
                </n-button-group>
            </n-space>
        </template>
        <n-data-table
            remote
            :columns="tableColumns"
            :data="dataSource"
            :pagination="pagination"
            :loading="loading"
            :row-key="rowKey"
            :scroll-x="1000"
            :size="size"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            @update:checked-row-keys="handleCheck"
            :bordered="false" />
    </n-card>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import {
        DataTableColumns,
        NButtonGroup,
        NCard,
        NSpace,
        NSkeleton,
        NDataTable,
        NGrid,
        NGi,
        NForm,
        NFormItemGi,
        NInput,
        NSelect,
        NButton
    } from 'naive-ui'
    import { ProtableProps, ProtableEmits } from './Protable'
    import { CreateButton, RefreshButton, DensityButton } from './components'
    // import ColumnSetting from './components/ColumnSetting.vue'

    // 定义props
    const {
        columns,
        pageTitle,
        loading,
        dataSource,
        rowKey,
        pagination,
        showCreate,
    } = defineProps<ProtableProps>()

    // 定义emits
    const emit = defineEmits<ProtableEmits>()

    const tableColumns = computed(() => {
        const res = columns.filter((column) => !column?.hideInTable)
        return res as DataTableColumns<any>
    })

    const searchFieldColumns = computed(() => {
        return columns.filter((column) => !column?.hideInSearch)
    })

    type TableSize = 'small' | 'medium' | 'large' | undefined
    const size = ref<TableSize>('medium')

    const handleSelectForTableSize = (key: TableSize) => {
        size.value = key
    }

    // const searchFormRef = ref<HTMLElement | null>(null)
    // 默认折叠
    const gridCollapsed = ref(true)
    // 默认折叠后的行数
    const gridCollapsedRows = ref(1)

    const searchFormData = ref({
        // TODO 初始化搜索表单的值
    })

    // const createSearchFormData = () => ({})

    const loadData = (page: number) => {
        emit('loadData', page)
    }

    const handleCreate = () => {
        emit('create')
    }

    const handleSearch = () => {
        loadData(1)
    }

    const handleReset = () => {
        // TODO 充值表单
        loadData(1)
    }

    const handlePageSizeChange = (pageSize: number) => {
        emit('update:pageSize', pageSize)
    }

    const handlePageChange = (page: number) => {
        emit('update:page', page)
    }

    const handleCheck = (
        keys: (string | number)[],
        rows: object[],
        meta: any
    ) => {
        emit('update:checked', keys, rows, meta)
    }
</script>

<style scoped>
    .card {
        flex: 1;
        margin-top: 12px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
</style>
