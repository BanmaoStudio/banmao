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
                    <template #label v-if="item.tooltip">
                        <div class="flex gap-2 items-center">
                            <span>{{ item.title }}</span>
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <Icon
                                        icon="ant-design:question-circle-outlined" />
                                </template>
                                {{ item.tooltip }}
                            </n-tooltip>
                        </div>
                    </template>
                    <n-date-picker
                        v-if="item.valueType === 'date'"
                        v-model:value="searchFormData[item.key]"
                        :type="item.valueType"
                        style="width: 100%"
                        :placeholder="`选择${item.title}`"
                        clearable
                        value-format="yyyy-MM-dd"
                        v-bind="item?.searchConfig" />
                    <component
                        v-else
                        :is="formFieldMaps[item.valueType]"
                        v-model:value="searchFormData[item.key]"
                        :options="item.options || options[item.key]"
                        :placeholder="`选择${item.title}`"
                        :style="{ width: '100%' }"
                        v-bind="item?.searchConfig" />
                    <slot></slot>
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
        NCascader,
        NForm,
        NGrid,
        NGi,
        NFormItemGi,
        NSelect,
        NDatePicker,
        NInput,
        NSpace,
        NButton,
        NTooltip,
        NAutoComplete,
        NColorPicker,
        NCheckbox,
        NSwitch,
        NDynamicTags,
        NInputNumber,
        NTimePicker,
        NTreeSelect,
SelectOption,
    } from 'naive-ui'
    import { Icon } from '@iconify/vue'
    import { onMounted, reactive, ref, shallowRef, watch, withDefaults } from 'vue'
    import { useShowSuffix } from '../../hooks/useShowSuffix'
    import { ProtableColumns } from '@/types/Protable.d'

    const formFieldMaps: Record<string, any> = {
        text: NInput,
        select: NSelect,
        date: NDatePicker,
        time: NTimePicker,
        cascader: NCascader,
        autoComplete: NAutoComplete,
        colorPicker: NColorPicker,
        checkbox: NCheckbox,
        switch: NSwitch,
        dynamicTags: NDynamicTags,
        digit: NInputNumber,
        treeSelect: NTreeSelect,
    }

    interface SearchFormProps {
        columns: ProtableColumns<any>
        readonly defaultValue?: any
        // 搜索栏显示列数
        gridCols: number
    }

    const { columns, defaultValue, gridCols } = withDefaults(
        defineProps<SearchFormProps>(),
        {
            gridCols: 3,
        }
    )

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

    /** 搜索栏各select options */
    const options = reactive<{ [key: string]: SelectOption[]}>({})
    
    // 获取远程服务器枚举
    const getRemoteServerEnum = (fn: any, prop: string) => {
        // 获取当前有选择表单的列的key值
        const cOptsKey = columns.filter((item) => item.key === prop)[0]['key']

        if (!fn) {
            return []
        }
        if (!prop) {
            return []
        }

        fn().then((res: any[]) => {
            options[cOptsKey] = res;
        })
    }

    watch(() => columns, (newVal) => {
        newVal.forEach((item) => {
            if (item.request) {
                getRemoteServerEnum(item.request, item.key)
            }
        })
    }, {
        deep: true,
        immediate: true,
    })

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
