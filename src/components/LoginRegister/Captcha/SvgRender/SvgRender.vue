<template>
    <div class="svg" ref="svgContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, watch } from 'vue'

const props = defineProps({
    svgData: {
        type: String,
        default: ``
    }
})

const svgContainer = ref<null | HTMLElement>(null)

watch(
    () => props.svgData,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            const parser = new DOMParser()
            const svgDoc = parser.parseFromString(newValue, 'image/svg+xml')
            const svgElement = svgDoc.documentElement
            if (svgContainer.value instanceof HTMLElement) {
                svgContainer.value.innerHTML = ''
                svgContainer.value.appendChild(svgElement)
            }
        }
    }
)

onMounted(() => {
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(props.svgData, 'image/svg+xml')
    const svgElement = svgDoc.documentElement
    if (svgContainer.value instanceof HTMLElement) {
        svgContainer.value.appendChild(svgElement)
    }
})
</script>

<style scoped lang="scss"></style>
