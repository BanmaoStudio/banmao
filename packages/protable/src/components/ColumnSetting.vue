<template>
    <n-popover placement="bottom" trigger="click">
        <template #trigger>
            <n-button size="small" type="warning" :secondary="secondary !== false">
                <Icon icon="ant-design:setting-outlined" class="mr-4px text-16px" />
                表格列设置
            </n-button>
        </template>
        <div class="w-210px">
            <vue-draggable v-model="list" item-key="key">
                <template #item="{ element }">
                    <div v-if="element.type === 'selection'"
                        class="flex items-center h-36px px-12px hover:bg-primary_active"
                    >
                        <Icon icon="mdi-drag" class="mr-8px text-20px cursor-move" />
                        <n-check-box v-model:checked="element.checked"> 多选框 </n-check-box>
                    </div>
                    <div v-else-if="element.key"
                        class="flex items-center h-36px px-12px hover:bg-primary_active"
                    >
                        <Icon icon="mdi-drag" class="mr-8px text-20px cursor-move" />
                        <n-checkbox v-model:checked="element.checked">
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
import { ProtableColumn } from '../Protable';

interface Props {
    columns: Column[];
    secondary?: boolean;
}

type Column = ProtableColumn

const { secondary, columns } = defineProps<Props>();

interface Emits {
    (event: 'update:columns', value: Column[]): void;
}

const emit = defineEmits<Emits>();

type List = Column & { checked?: boolean }

const list = ref(initList());

function initList(): List[] {
    return columns.map((item) => ({ ...item, checked: true }))
}

watch(list, (newValue: List[]) => {
    const newColumns = newValue.filter(item => item.checked)

    const columns: Column[] = newColumns.map((item) => {
        const column = { ...item };
        delete column.checked;
        return column;
    }) as Column[];

    emit("update:columns", columns);
}, {
    deep: true
})

</script>
