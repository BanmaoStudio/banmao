<template>
    <n-popover placement="bottom" trigger="click">
        <template #trigger>
            <n-button size="small" type="warning" :secondary="secondary !== false">
                <Icon icon="ant-design:setting-outlined" class="mr-4px text-16px" />
                <span v-if="label">
                    {{ label }}
                </span>
            </n-button>
        </template>
        <div class="w-210px">
            <vue-draggable v-model="list" item-key="key">
                <template #item="{ element }">
                    <div v-if="element.type === 'selection'"
                        class="flex items-center h-36px px-12px hover:bg-primary_active"
                    >
                        <Icon icon="mdi-drag" class="mr-8px text-20px cursor-move" />
                        <n-checkbox v-model:checked="element.hideInTable"> 多选框 </n-checkbox>
                    </div>
                    <div v-else-if="element.key"
                        class="flex items-center h-36px px-12px hover:bg-primary_active"
                    >
                        <Icon icon="mdi-drag" class="mr-8px text-20px cursor-move" />
                        <n-checkbox v-model:checked="element.hideInTable">
                            {{ element.title }}
                        </n-checkbox>
                    </div>
                </template>
            </vue-draggable>
        </div>
    </n-popover>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VueDraggable from 'vuedraggable'
import { NButton, NPopover, NCheckbox } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { ProtableColumn } from '@/types/Protable';

defineOptions({
    name: 'ColumnSetting'
})

interface Props {
    columns: Column[];
    secondary?: boolean;
    label?: string;
}

type Column = ProtableColumn<any>

const { secondary, columns } = withDefaults(defineProps<Props>(), {
    label: '表格列设置'
})

interface Emits {
    (event: 'update:columns', value: Column[]): void;
}

const emit = defineEmits<Emits>();

type List = Column & { checked?: boolean }

const list = ref(initList());

function initList(): List[] {
    return columns.map((item) => ({ ...item, hideInTable: !item.hideInTable }))
}

watch(list, (newValue: List[]) => {
    const newColumns = newValue.filter(item => item.hideInTable)

    const columns: Column[] = newColumns.map((item) => {
        const column = { ...item };
        delete column.hideInTable;
        return column;
    }) as Column[];

    emit("update:columns", columns);
}, {
    deep: true
})

</script>
