<template>
    <div class="TagView-container">
        <el-scrollbar>
            <div class="scrollbar-flex-content">
                <el-tag type="primary" class="tag-item">
                    <router-link class="router-ctn" to="/home">
                        主页
                    </router-link>
                </el-tag>
                <el-tag v-for="(tag, index) in cacheTags" :key="index" closable class="tag-item"
                    :class="`tag-backgroundcolor-${index % 5}`" @close="closeTag(tag, index)">
                    <router-link class="router-ctn" :to="{
                        name: tag.name
                    }">
                        {{ tag.meta.title }}
                    </router-link>
                </el-tag>
            </div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" name='TagView' setup>
    import { ref } from 'vue'
    import type { TagProps } from 'element-plus'

    import { storeToRefs } from "pinia";
    import { watch } from 'vue'
    import useCenterStore from '@/stores/modules/center';
    import { useRoutesStore } from '@/stores/modules/routes';
    import { useRouter, type RouteLocationNormalizedGeneric } from 'vue-router';




    interface TagsItem {
        name: string
        type: TagProps['type']
    }
    const routesStore = useRoutesStore()
    const { cacheTags } = storeToRefs(routesStore)


    const centerStore = useCenterStore();
    const { isCollapseScrollBar } = storeToRefs(centerStore);

    const instance = getCurrentInstance();
    watch(isCollapseScrollBar, () => {
        setInstanceShapeInfo()
    })

    function setInstanceShapeInfo() {
        if (instance && instance.proxy) {
            // 访问组件的根 DOM 元素
            const componentElement = instance.proxy.$el;
            // 例如：调用 store 方法设置元素形状信息
            centerStore.setElementShapeInfo(componentElement, 'tagViewShapeInfo');
        }
    }

    const router = useRouter()

    function closeTag(tag: RouteLocationNormalizedGeneric, index: number) {
        const tagName = tag.name as string;
        const isLastTag = index === (cacheTags.value.size - 1) ? true : false;
        if (tagName) {
            routesStore.deleteTag(tagName);
            if (isLastTag) {
                if (index - 1 >= 0) {
                    const name = Array.from(cacheTags.value)[index - 1].name;
                    if (name) {
                        router.replace({
                            name
                        })
                    }
                }else{
                    router.replace({
                            name:"center"
                        })
                }
            }
        }

    }

    onMounted(() => {
        setInstanceShapeInfo()
    })

</script>



<style scoped lang="scss">

    .TagView-container {
        border-bottom: 1px dashed rgba($color: #cecaca, $alpha: 1.0);
    }


    /* 生成五个不同背景颜色的类 */
    @include generate-random-background(5, 'tag-backgroundcolor', $bread-crumbs-font-color);

    .scrollbar-flex-content {
        display: flex;
    }

    .scrollbar-demo-item {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 50px;
        margin: 10px;
        text-align: center;
        border-radius: 4px;
        background: random-bg-color();
        color: var(--el-color-danger);
    }

    .tag-item {
        padding: 2px 4px;
        margin: 0 4px;

        .router-ctn {
            color: $bread-crumbs-font-color;
        }
    }


</style>