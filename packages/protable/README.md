# Protable

> Protable 是基于 naive UI 封装的组件库，仅支持 Vue3。

## 安装

```bash
npm install @banmao/portable --save
```

## 快速上手

```vue
<template>
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

<script lang="tsx" setup>

import { Portable } from '@banmao/portable'

interface RowData {
    name: string
    id: number
}


const columns = ref<ProtableColumns<RowData>>([
    {
        title: '名称',
        key: 'name',
        valueType: 'text',
        resizable: true
    }
])

const pagination = ref({
    pageSize: 10,
    itemCount: 100,
    page: 1
})

const dataSource = ref<RowData[]>([
    { name: 'One', id: 1 },
    { name: 'Two', id: 2 },
    { name: 'Three', id: 3 },
    { name: 'Four', id: 4 },
    { name: 'Five', id: 5 },
    { name: 'Six', id: 6 },
    { name: 'Seven', id: 7 },
    { name: 'Eight', id: 8 },
    { name: 'Nine', id: 9 },
])

const rowKey = (row: RowData) => row.id

const loading = ref<boolean>(false)

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
```



## API

### Protable Props

参考 [naive-ui DataTable 组件](https://www.naiveui.com/zh-CN/os-theme/components/data-table#DataTable-Props)

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| columnSetting | `boolean` | `false` | 是否显示列设置按钮 | 0.0.9 |

### ProtableColumn Props

参考 [naive-ui DataTable 组件](https://www.naiveui.com/zh-CN/os-theme/components/data-table#DataTable-Props)

另外支持 如下：

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| valueType | `text` \| `number` \| `date` \| `dateTime` \| `dateRange` \| `dateTimeRange` \| `select` \| `radio` \| `checkbox` \| `switch` \| `rate` \| `slider` \| `textarea` \| `upload` \| `treeSelect` \| `cascader` | text | 值类型 |  |
| hideInTable | `boolean` | false | 是否在表格中隐藏 |  |
| hideInSearch | `boolean` | false | 是否在搜索中隐藏 |  |
| hideInForm | `boolean` | false | 是否在表单中隐藏 |  |
<!-- | hideInDescriptions | `boolean` | false | 是否在描述中隐藏 | 开发中 | -->
<!-- | hideInDetails | `boolean` | false | 是否在详情中隐藏 | 开发中 | -->
<!-- | hideInModal | `boolean` | false | 是否在弹窗中隐藏 | 开发中 | -->

### Protable Slots

参考 [naive-ui DataTable 组件](https://www.naiveui.com/zh-CN/os-theme/components/data-table#DataTable-Props)

| 名称 | 参数 | 说明 | 版本 |
| --- | --- | --- | --- |
| tableHeader | - | 表格头部 |  |
| tableHeaderExtra | - | 表格头部额外内容 |  |

