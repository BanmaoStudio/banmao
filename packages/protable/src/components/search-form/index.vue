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
                    v-for="item in columns"
                    :key="item.key"
                    :label="item.title"
                    :path="item.key">
                    <n-select
                        v-if="item.valueType === 'select'"
                        v-model:value="searchFormData[item.key]"
                        :options="item.filterOptions"
                        :placeholder="`选择${item.title}`"
                        v-bind="item?.searchConfig"
                        clearable />
                    <n-date-picker
                        v-else-if="item.valueType === 'date'"
                        v-model:value="searchFormData[item.key]"
                        :type="item.searchConfig.dateType || 'date'"
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
                <n-gi suffix>
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
                                        gridCollapsed ? 'down' : 'up'
                                    }`" />
                            </template>
                            {{ gridCollapsed ? '展开' : '折叠' }}
                        </n-button>
                    </n-space>
                </n-gi>
            </n-grid>
        </n-form>
    </n-card>
</template>

<script setup lang="ts">
    import {
        NCard,
        NForm,
        NGrid,
        NGi,
        NFormItemGi,
        NSelect,
        NDatePicker,
        NInput,
        NSpace,
        NButton,
    } from 'naive-ui'
    import { Icon } from '@iconify/vue'
    import { onMounted, ref, shallowRef, withDefaults } from 'vue'
    import { useShowSuffix } from '../../hooks/useShowSuffix'
    import { ProtableColumns } from '../../Protable.d'

    interface SearchFormProps {
        columns: ProtableColumns<any>
        readonly defaultValue?: any
        // 搜索栏显示列数
        gridCols: number
    }

    const { columns, defaultValue, gridCols } = withDefaults(defineProps<SearchFormProps>(), {
        gridCols: 3
    })

    const gridRef = shallowRef()

    // 搜索栏显示列数
    // const gridCols = ref(3)
    // 默认折叠
    const gridCollapsed = ref(true)
    // 默认折叠后的行数
    const gridCollapsedRows = ref(1)
    // 显示隐藏的节点
    const { showSuffix } = useShowSuffix(gridRef, gridCols)

    // 切换折叠
    const handleToggleCollapsed = () => {
        gridCollapsed.value = !gridCollapsed.value
    }

    const emit = defineEmits<{
        (e: 'search', payload: any): void
        (e: 'reset'): void
    }>()

    // 搜索表单数据
    const searchFormData = ref<{ [key: string]: any }>({})

    const defaultFormData = Object.assign({}, defaultValue)

    // 创建搜索表单数据
    const createSearchFormData = () => {
        if (defaultFormData) {
            return { ...defaultFormData }
        }

        const formData = {} as any

        columns.forEach((column) => {
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


    // 重置搜索表单数据
    const handleReset = () => {
        searchFormData.value = createSearchFormData()
        emit('reset')
    }

    const handleSearch = () => {
        emit('search', searchFormData.value)
    }

</script>
