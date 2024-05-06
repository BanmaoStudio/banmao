<script setup lang="tsx">
    // import HelloWorld from './components/HelloWorld.vue'
    import Protable from '@banmao/protable'
    import type { ProtableColumns } from '@banmao/protable'

    import { PaginationProps } from 'naive-ui'

    import { Ref, onMounted, ref } from 'vue'

    interface RowData {
        name: string
        age: number
        gender: string
        date: string,
        address: string,
        id: number
    }

    const columns = ref<ProtableColumns<RowData>>([
        { type: 'selection' },
        {
            title: 'Name',
            key: 'name',
            valueType: 'text',
            resizable: true,
            // render(row: RowData) {
            //     return <b>{ row.name }</b>
            // },
        },
        {
            title: 'Gender',
            valueType: 'select',
            key: 'gender',
            resizable: true,
            sorter: 'default',
            filterOptions: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
                { label: '未知', value: 'unknown' },
            ],
            filter(value: string, row: RowData) {
                console.log('%cexample/src/App.vue:39 value', 'color: #007acc;', value);
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
            sortOrder: 'descend',
            sorter(a: RowData, b: RowData) {
                return a.age - b.age
            },
            hideInSearch: true,
            resizable: true,
        },
        {
            title: 'Address',
            key: 'address',
            hideInSearch: true,
            resizable: true,
        },
        {
            title: 'Date',
            key: 'date',
            valueType: 'date',
            resizable: true,
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            resizable: true,
            fixed: 'right',
        }
    ])

    const pagination = ref({
        pageSize: 10,
        itemCount: 120,
        page: 1,
        pageSizes: [10, 20, 30, 40],
        showSizePicker: true,
        showQuickJumper: true,
    }) as Ref<PaginationProps>

    const dataSource = ref<RowData[]>([
        { id: 1, name: 'One', age: 10, gender: 'male', date: '2023-01-01', address: 'Address 1' },
        { id: 2, name: 'Two', age: 20, gender: 'female', date: '2023-01-02', address: 'Address 2' },
        { id: 3, name: 'Three', age: 30, gender: 'female', date: '2023-01-03', address: 'Address 3' },
    ])

    const rowKey = (row: any) => row.id

    const loading = ref(false)

    const loadData = () => {
        loading.value = true
        setTimeout(() => {
            loading.value = false
        }, 1000)
    }

    onMounted(() => {
        loadData()
    })

    const handleCreate = () => {
        console.log('%cexample/src/App.vue:106 handleCreate', 'color: #007acc;')
    }

    const handleSorterChange = (sorter: any) => {
        console.log('%cexample/src/App.vue:118 sorter', 'color: #007acc;', sorter);
        // columns.value.forEach((column) => {
        //     if (column.sortOrder === undefined) return
        //     if (!sorter) {
        //         column.sortOrder = false
        //         return
        //     }
        //     if (column.key === sorter.columnKey) column.sortOrder = sorter.order
        //     else column.sortOrder = false
        // })
    }
</script>

<template>
    <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
    <!-- <HelloWorld msg="Vite + Vue" /> -->
    <Protable
        pageTitle="Table"
        :rowKey="rowKey"
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @update:pageSize="(e) => (pagination.pageSize = e)"
        @update:page="(e) => (pagination.page = e)"
        @update:sorter="handleSorterChange"
        @loadData="loadData"
        @create="handleCreate"
    >
    </Protable>
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
