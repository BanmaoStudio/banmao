<script setup lang="tsx">
    // import HelloWorld from './components/HelloWorld.vue'
    import Protable from '@banmao/protable'
    import type { ProtableColumns } from '@banmao/protable'
    import { NText, NButton, NSpace } from 'naive-ui'

    import type { PaginationProps, SelectOption } from 'naive-ui'

    import { Ref, onMounted, ref } from 'vue'

    interface RowData {
        name: string
        age: number
        gender: string
        date: string
        address: string
        id: number
        children?: RowData[]
    }

    const dataSource = ref<RowData[]>([
        {
            id: 1,
            name: 'One',
            age: 10,
            gender: 'male',
            date: '2023-01-01',
            address: 'Address 1',
        },
        {
            id: 2,
            name: 'Two',
            age: 20,
            gender: 'female',
            date: '2023-01-02',
            address: 'Address 2',
        },
        {
            id: 3,
            name: 'Three',
            age: 16,
            gender: 'female',
            date: '2023-01-03',
            address: '',
        },
    ])

    const fetchSelectOptions = () => {
        let arr: SelectOption[] = []

        return new Promise((res) => {
            setTimeout(() => {
                arr = [
                    { label: '全部', value: '' },
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' },
                    { label: '未知', value: 'unknown' },
                ]
                res(arr)
            }, 500)
        })
    }

    const fetchSelectOptions1 = async () => {
        let arr: SelectOption[] = []

        // setTimeout(() => {
        arr = [
            {
                value: '1',
                label: 'Option 1',
                children: [
                    {
                        value: '1-1',
                        label: 'Option 1-1',
                    },
                    {
                        value: '1-2',
                        label: 'Option 1-2',
                    },
                ],
            },
        ]
        // }, 3000)

        return arr
    }

    const columns = ref<ProtableColumns<RowData>>([
        { type: 'selection', fixed: 'left', width: 40 },
        {
            title: '分类',
            key: 'class',
            hideInTable: true,
            valueType: 'cascader',
            request: fetchSelectOptions1,
        },
        {
            title: 'Name',
            key: 'name',
            valueType: 'text',
            fixed: 'left',
            width: 120,
            resizable: true,
            tooltip: '标题过长会自动收缩',
        },
        {
            title: 'Gender',
            valueType: 'select',
            key: 'gender',
            width: 100,
            resizable: true,
            // hideInSearch: true,
            searchConfig: {
                remote: true,
                filterable: true,
            },
            // options: [
            //     { label: '全部', value: '' },
            //     { label: '男', value: 'male' },
            //     { label: '女', value: 'female' },
            //     { label: '未知', value: 'unknown' },
            // ],
            request: fetchSelectOptions,
            filterOptions: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
                { label: '未知', value: 'unknown' },
            ],
            filter(value: string, row: RowData) {
                return row.gender === value
            },
            render(row: RowData) {
                switch (row.gender) {
                    case 'male':
                        return '男'
                    case 'female':
                        return '女'
                    default:
                        return '未知'
                }
            },
        },
        {
            title: 'Age',
            key: 'age',
            valueType: 'digit',
            min: 0,
            max: 100,
            width: 100,
            sorter: (a: RowData, b: RowData) => a.age - b.age,
            resizable: true,
        },
        {
            title: 'Address',
            key: 'address',
            width: 400,
            ellipsis: true,
            hideInSearch: true,
            copyable: true,
            resizable: true,
        },
        {
            title: 'Date',
            key: 'date',
            width: 160,
            valueType: 'date',
            searchConfig: {
                type: 'datetimerange',
            },
            resizable: true,
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            hideInTable: true,
            resizable: true,
            fixed: 'right',
            render() {
                return <span>操作</span>
            },
        },
    ])

    const pagination = ref({
        pageSize: 10,
        itemCount: 120,
        page: 1,
        pageSizes: [10, 20, 30, 40],
        showSizePicker: true,
        showQuickJumper: true,
    }) as Ref<PaginationProps>

    const rowKey = (row: RowData) => row.id

    const loading = ref(false)

    const loadData = (page: number) => {
        loading.value = true
        setTimeout(() => {
            loading.value = false
            console.log(
                '%cexample/src/App.vue:110 page',
                'color: #007acc;',
                page
            )
            pagination.value.page = page
        }, 300)
    }

    onMounted(() => {
        loadData(1)
    })

    const handleCreate = () => {
        console.log('%cexample/src/App.vue:106 handleCreate', 'color: #007acc;')
    }

    const checkedRowKeys = ref([])

    const handleCheckedRowKeysChange = (keys: any) => {
        checkedRowKeys.value = keys
        console.log('%cexample/src/App.vue:127 keys', 'color: #007acc;', keys)
    }

    const handleCancelCheckedRow = () => {
        checkedRowKeys.value = []
    }

    const handlePageChange = (page: number) => {
        pagination.value = {
            ...pagination.value,
            page,
        }
        loadData(page)
    }

    const handlePageSizeChange = (pageSize: number) => {
        pagination.value = {
            ...pagination.value,
            pageSize,
        }
        loadData(1)
    }

    const defaultSearchValue = {
        gender: '',
        date: [new Date().getTime(), new Date().getTime()],
    }

    function renderCell(v: string | number) {
        if (!v) {
            return <NText depth={3}> - </NText>
        }
        return v
    }
</script>

<template>
    <div class="w-full">
        <Protable
            remote
            ref="tableRef"
            pageTitle="Table"
            :rowKey="rowKey"
            :dataSource="dataSource"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            @update:pageSize="handlePageSizeChange"
            @update:page="handlePageChange"
            @update:checked-row-keys="handleCheckedRowKeysChange"
            @loadData="loadData"
            @create="handleCreate"
            :render-cell="renderCell"
            :search-config="{
                gridCols: 3,
                defaultValue: defaultSearchValue,
            }">
            <template #select-bar v-if="checkedRowKeys.length > 0">
                <div
                    class="flex justify-between bg-gray-100 px-4 py-2 mb-4 rounded-[4px] hover:shadow-md">
                    <n-space>
                        <n-text>
                            已选择
                            <span class="text-red-500">{{
                                checkedRowKeys.length
                            }}</span>
                            项
                        </n-text>
                        <n-button type="info" text @click="handleCancelCheckedRow">取消选择</n-button>
                    </n-space>
                    <n-space :gap="2">
                        <n-button type="error" text>批量删除</n-button>
                        <n-button type="primary" text>导出数据</n-button>
                    </n-space>
                </div>
            </template>
        </Protable>
    </div>
</template>

<style scoped>
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.vue:hover {
        filter: drop-shadow(0 0 2em #42b883aa);
    }
</style>
