<template>
    <div>
        <search-form
            ref="searchFormRef"
            :columns="searchFieldColumns"
            v-bind="searchConfig"
            @search="handleSearch"
            @reset="handleReset" />
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
                        <density-button
                            @update:select="handleSelectForTableSize" />
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
                :size />
        </n-card>
    </div>
</template>

<script setup lang="tsx">
    import { computed, ref, watchEffect, h } from 'vue'
    import {
        NButtonGroup,
        NCard,
        NSpace,
        NDataTable,
    } from 'naive-ui'
    import { ProtableProps, ProtableEmits, ProtableColumn } from '@/types/Protable'
    import { CreateButton, RefreshButton, DensityButton } from './components'
    import ColumnSettingComponent from './components/ColumnSetting.vue'
    import SearchForm from './components/search-form/index.vue'
    import ClipboardCopy from './components/ClipboardCopy.vue'

    // 定义props
    const {
        columns,
        loading,
        pageTitle,
        dataSource,
        pagination,
        showCreate,
        columnSetting,
        searchConfig
    } = defineProps<ProtableProps>()

    // 定义emits
    const emit = defineEmits<ProtableEmits>()

    const columnData = ref()

    watchEffect(() => {
        columnData.value = columns.map((column: ProtableColumn<any>) => {
            if (column && column.copyable) {
                return {
                    ...column,
                    render: (row: any) => {
                        const copyText = row[column.key]
                        let text = ''
                        if (!copyText) return ''

                        switch (typeof copyText) {
                            case 'string':
                                text = copyText
                                break;
                            case 'object':
                                text = JSON.stringify(copyText)
                                break;
                            case 'number':
                                text = copyText.toString()
                                break;
                            default:
                                text = ''
                                break;
                        }

                        return h(
                                ClipboardCopy,
                                {
                                    text
                                }
                            )
                    }
                }
            } else {
                return column
            }

        })
    })

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

    const searchFormRef = ref(null)

    const loadData = (page: number) => {
        emit('loadData', page)
    }

    const handleCreate = () => {
        emit('create')
    }

    const handleSearch = (formModel: any) => {
        console.log('handleSearch', formModel)
        loadData(1)
    }

    const handleReset = () => {
        loadData(1)
    }
</script>

<style scoped></style>
