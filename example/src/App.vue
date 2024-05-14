<script setup lang="tsx">
    // import HelloWorld from './components/HelloWorld.vue'
    import Protable from '@banmao/protable'
    import type { ProtableColumns } from '@banmao/protable'
    import { NText } from 'naive-ui'

    import type { PaginationProps } from 'naive-ui'

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
        let arr: any = [];

        setTimeout(() => {
            arr = [
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' },
            ]
        }, 3000)

        return arr
    }

    const columns = ref<ProtableColumns<RowData>>([
        { type: 'selection', fixed: 'left', width: 40 },
        {
            title: 'Name',
            key: 'name',
            valueType: 'text',
            fixed: 'left',
            width: 120,
            resizable: true,
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
                onSearch: fetchSelectOptions
            },
            filterOptions: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
                { label: '未知', value: 'unknown' },
            ],
            filter(value: string, row: RowData) {
                console.log(
                    '%cexample/src/App.vue:39 value',
                    'color: #007acc;',
                    value
                )
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
                dateType: 'datetimerange'
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
        }, 1000)
    }

    onMounted(() => {
        loadData(1)
    })

    const handleCreate = () => {
        console.log('%cexample/src/App.vue:106 handleCreate', 'color: #007acc;')
    }

    const handleCheckedRowKeysChange = (keys: any) => {
        console.log('%cexample/src/App.vue:127 keys', 'color: #007acc;', keys)
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
        gender: 'male',
        date: [new Date().getTime(), new Date().getTime()]
    }

    function renderCell(v: string | number) {
        if (!v) {
            return <NText depth={3}> - </NText>
        }
        return v
    }
</script>

<template>
    <div class="w-1000px">
        <Protable
            remote
            :scroll-x="600"
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
                gridCols: 2,
                defaultValue: defaultSearchValue,
            }"
        />
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
