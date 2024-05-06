<template>
    <n-card>
        <n-form
            label-placement="left"
            label-width="100"
            :show-feedback="false"
            :show-require-mark="false">
            <n-grid
                item-responsive
                :cols="gridCols"
                :x-gap="16"
                :y-gap="16"
                :collapsed="gridCollapsed"
                :collapsed-rows="gridCollapsedRows"
                ref="gridRef">
                <n-form-item-gi
                    v-for="item in searchFieldColumns"
                    :key="item.key"
                    :label="item.title"
                    :path="item.key">
                    <n-select
                        v-if="item.valueType === 'select'"
                        v-model:value="searchFormData[item.key]"
                        :options="item.filterOptions" 
                        :placeholder="`选择${item.title}`"
                    />
                    <n-date-picker
                        v-else-if="item.valueType === 'date'"
                        v-model:value="searchFormData[item.key]"
                        type="date" />
                    <n-input
                        v-else
                        v-model:value="searchFormData[item.key]"
                        :placeholder="`输入${item.title}`" />
                </n-form-item-gi>
                <n-gi suffix #="{ overflow }">
                    <n-space justify="end">
                        <n-button @click="handleReset">
                            <template #icon>
                                <Icon icon="ant-design:reload-outlined" />
                            </template>
                            重置
                        </n-button>
                        <n-button type="primary" @click="handleSearch">
                            <template #icon>
                                <Icon icon="ant-design:search-outlined" />
                            </template>
                            查询
                        </n-button >
                        <n-button
                            v-if="showSuffix"
                            @click="handleToggleCollapsed">
                            <template #icon>
                                <Icon
                                    :icon="`mdi:chevron-${
                                        overflow ? 'down' : 'up'
                                    }`" />
                            </template>
                            {{ overflow ? '展开' : '折叠' }}
                        </n-button>
                    </n-space>
                </n-gi>
            </n-grid>
        </n-form>
    </n-card>
    <n-card class="flex-1 mt-12px shadow-sm">
        <template #header>
            <slot v-if="$slots.tableHeader" name="table-header"></slot>
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
                    <column-setting
                        v-model:columns="columnSettingOptions"
                        secondary />
                </n-button-group>
            </n-space>
        </template>
        <n-data-table
            remote
            :columns="tableColumns"
            :data="dataSource"
            :pagination="paginationData"
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
    import { computed, ref, onMounted, watchEffect, shallowRef } from 'vue'
    import {
        DataTableColumns,
        NButtonGroup,
        NCard,
        NSpace,
        NDataTable,
        NGrid,
        NGi,
        NForm,
        NFormItemGi,
        NInput,
        NSelect,
        NButton,
    } from 'naive-ui'
    import { ProtableProps, ProtableEmits } from './Protable'
    import { CreateButton, RefreshButton, DensityButton } from './components'
    import ColumnSetting from './components/ColumnSetting.vue'
    import { useShowSuffix } from './hooks/useShowSuffix'
    import { getDefaultPagination } from './utils/pagination'
    import { Icon } from '@iconify/vue'

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

    const paginationData = getDefaultPagination(pagination as any)

    // 定义emits
    const emit = defineEmits<ProtableEmits>()

    const columnSettingOptions = ref()

    watchEffect(() => {
        columnSettingOptions.value = columns
    })

    const tableColumns = computed(() => {
        const res = columnSettingOptions.value.filter(
            (column: { hideInTable: any }) => !column?.hideInTable
        )
        return res as DataTableColumns
    })

    const searchFieldColumns = computed(() => {
        return columnSettingOptions.value.filter(
            (column: { hideInSearch: any }) => !column?.hideInSearch
        )
    })

    type TableSize = 'small' | 'medium' | 'large' | undefined
    const size = ref<TableSize>('medium')

    const handleSelectForTableSize = (key: TableSize) => {
        size.value = key
    }

    // const searchFormRef = ref<HTMLElement | null>(null)
    const gridRef = shallowRef()
    // 搜索栏显示列数
    const gridCols = ref(3)
    // 显示隐藏的节点
    const { showSuffix } = useShowSuffix(gridRef, gridCols.value)

    // 默认折叠
    const gridCollapsed = ref(true)
    // 默认折叠后的行数
    const gridCollapsedRows = ref(1)
    // 切换折叠
    const handleToggleCollapsed = () => {
        gridCollapsed.value = !gridCollapsed.value
    }

    const searchFormData = ref<{ [key: string]: any }>({})

    const createSearchFormData = () => {
        const formData = {} as any

        searchFieldColumns.value.forEach((column: any) => {
            if (column.valueType === 'select') {
                formData[column.key] = null
            } else {
                formData[column.key] = ''
            }
        })

        return formData
    }

    onMounted(() => {
        searchFormData.value = createSearchFormData()
    })

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
        searchFormData.value = createSearchFormData()

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
