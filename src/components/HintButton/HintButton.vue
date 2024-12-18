<script setup lang="ts">
import { defineProps, useAttrs } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    }
});
const attrs = useAttrs();
</script>

<template>
    <!-- a标签的title属性可以给标签一个浮动显示的提升-->
    <a :title="props.title" style="margin:10px">

        <el-button v-bind="attrs"><slot></slot></el-button>
    </a>
</template>

<style scoped lang="scss">
</style>
