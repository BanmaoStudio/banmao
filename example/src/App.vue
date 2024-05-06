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
        id: number
    }

    const columns = ref<ProtableColumns<RowData>>([
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
        { title: 'Age', key: 'age', hideInSearch: true, resizable: true },
        {
            title: 'Address',
            key: 'address',
            resizable: true,
        },
        {
            title: 'Date',
            key: 'date',
            resizable: true,
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

    const dataSource = ref([
        { name: 'One', age: 10, gender: 'male' },
        { name: 'Two', age: 20, gender: 'female' },
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
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @update:pageSize="(e) => (pagination.pageSize = e)"
        @update:page="(e) => (pagination.page = e)"
        @loadData="loadData"
        :showCreate="false"
        flex-height>
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
