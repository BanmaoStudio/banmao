<template>
    <n-form-item-gi :label :path>
        <n-select :options="options" v-model:value="value" />
    </n-form-item-gi>
</template>

<script setup lang="ts">
import { SelectOption } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';
import { ProFormSelectProps } from './types';


const options = ref<SelectOption[]>([])

const props = defineProps<ProFormSelectProps>()

defineEmits([
    'update:value'
])

watch(() => options.value, async (val) => {
    if (props.request && typeof props.request === 'function') {
        const res = await props?.request()
        options.value = res;
    }
}, {
    deep: true,
    immediate: true
})

</script>
