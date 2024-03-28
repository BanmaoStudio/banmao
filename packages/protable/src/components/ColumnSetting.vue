<template>
    <n-popover placement="bottom" trigger="click">
        <template #trigger>
            <n-button size="small" type="warning" :secondary="secondary !== false">
                <icon-ant-design-setting-outlined class="mr-4px text-16px" />
                表格列设置
            </n-button>
        </template>
        <div class="w-210px">
            <vue-draggable v-model="list" item-key="key">
                <template #item="{ element }">
                    <div v-if="element.type === 'selection'"
                        class="flex-y-center h-36px px-12px hover:bg-primary_active"
                    >
                        <icon-mdi-drag class="mr-8px text-20px cursor-move" />
                        <n-check-box v-model:checked="element.checked"> 多选框 </n-check-box>
                    </div>
                    <div v-else-if="element.key"
                        class="flex-y-center h-36px px-12px hover:bg-primary_active"
                    >
                        <icon-mdi-drag class="mr-8px text-20px cursor-move" />
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
import { computed } from 'vue'
import VueDraggable from 'vuedraggable'
import { NButton, NPopover, NCheckbox } from 'naive-ui'

interface Props {
    secondary?: boolean;
}

const { secondary } = defineProps<Props>();

const columns = defineModel('columns', { required: true });

const list = computed(() => {
    return columns.map((item) => ({ ...item, checked: true }))
})

</script>
