import { ref, onMounted } from 'vue'

export function useRequest() {
    const data = ref<any>()

    // 模拟异步请求
    const fetchData = () => {
        setTimeout(() => {
            data.value = 'Hello, World!'
        }, 1000)
    }

    onMounted(() => {
        fetchData()
    })

    return {
        data,
        fetchData
    }
}

export function useRequestList() {
    const data = ref<any[]>([])
    const loading = ref(false)

    return {
        data,
        loading
    }

}