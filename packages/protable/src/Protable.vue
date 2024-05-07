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
                        clearable />
                    <n-date-picker
                        v-else-if="item.valueType === 'date'"
                        v-model:value="searchFormData[item.key]"
                        type="date"
                        style="width: 100%"
                        :placeholder="`选择${item.title}`"
                        clearable
                        value-format="yyyy-MM-dd" />
                    <n-input
                        v-else
                        v-model:value="searchFormData[item.key]"
                        clearable
                        :placeholder="`输入${item.title}`" />
                </n-form-item-gi>
                <n-gi suffix #="{ overflow }">
                    <n-space justify="end" :wrap="false">
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
                        </n-button>
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
    <n-card class="flex-auto mt-12px shadow-sm">
        <template #header>
            <slot v-if="$slots.tableHeader" name="tableHeader"></slot>
            <template v-else>{{ pageTitle }}</template>
        </template>
        <template #header-extra>
            <n-space>
                <slot name="tableHeaderExtra"></slot>
                <create-button
                    v-if="showCreate !== false"
                    @click="handleCreate" />
                <n-button-group>
                    <refresh-button
                        @click="() => loadData(1)"
                        :loading="loading" />
                    <density-button @update:select="handleSelectForTableSize" />
                    <column-setting-component
                        v-if="columnSetting === false"
                        v-model:columns="columnData"
                        secondary />
                </n-button-group>
            </n-space>
        </template>
        <n-data-table
            v-bind="$attrs"
            :loading
            :columns="columnData"
            :data="dataSource"
            :pagination
            :size
        />
    </n-card>
</template>

<script setup lang="ts">
    import {
        computed,
        ref,
        onMounted,
        watchEffect,
        shallowRef
    } from 'vue'
    import {
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
        NDatePicker,
        NButton,
    } from 'naive-ui'
    import { ProtableProps, ProtableEmits, ProtableColumn } from './Protable'
    import { CreateButton, RefreshButton, DensityButton } from './components'
    import ColumnSettingComponent from './components/ColumnSetting.vue'
    import { useShowSuffix } from './hooks/useShowSuffix'
    import { Icon } from '@iconify/vue'

    // 定义props
    const {
        columns,
        loading,
        pageTitle,
        dataSource,
        pagination,
        showCreate,
        columnSetting,
    } = defineProps<ProtableProps>()

    // 定义emits
    const emit = defineEmits<ProtableEmits>()

    const columnData = ref()

    watchEffect(() => {
        columnData.value = columns
    })

    // const tableColumns = computed(() => {
    //     return columnSettingOptions.value.filter(
    //         (column: ProtableColumn<any>) => !column?.hideInTable
    //     )
    // })

    const searchFieldColumns = computed(() => {
        return columns.filter(
            (column: ProtableColumn<any>) =>
                !column?.hideInSearch &&
                column?.type !== 'selection' &&
                column.key !== 'action' &&
                column.key !== 'actions'
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
            } else if (column.valueType === 'date') {
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

</script>

<style scoped></style>
