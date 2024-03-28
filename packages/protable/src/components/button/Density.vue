<template>
    <n-dropdown
        @select="handleSelect"
        trigger="click"
        :options="options">
        <n-tooltip trigger="hover">
            <template #trigger>
                <n-button size="small" quaternary>
                    <template #icon>
                        <Icon icon="ant-design:column-height-outlined" class="text-18px" />
                    </template>
                </n-button>
            </template>
            密度
        </n-tooltip>
    </n-dropdown>
</template>

<script setup lang="ts">
    import { NButton, NDropdown, NTooltip } from 'naive-ui'
    import { Icon } from '@iconify/vue'

    defineOptions({ name: 'DensityButton' })

    const options = [
        { label: '默认', key: 'large' },
        { label: '中等', key: 'medium' },
        { label: '紧凑', key: 'small' },
    ]

    const emits = defineEmits(['update:select'])

    const handleSelect = (key: string) => {
        emits('update:select', key)
    }

</script>
