import { onMounted, nextTick, ref } from 'vue';

export function useShowSuffix(domRef: any, num: number) {
    const showSuffix = ref<boolean>(true)

    onMounted(() => {
        nextTick(() => {
            const len = domRef.$el.children.length || 0
            if (len >= num) {
                showSuffix.value = false
            } else {
                showSuffix.value = true
            }
        })
    })

    return {
        showSuffix
    }
}
