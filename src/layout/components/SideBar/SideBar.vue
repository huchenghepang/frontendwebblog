<template>
    <div  ref="sideBarContainer" class="SideBar-container" :class="{mobile:isShowSideBarWhenMoible}" v-swipe="bindEvent">
            <!-- 显示logo 加载logo组件 -->
            <Logo :is-show-title="!isCollapseScrollBar" />
            <!-- 一定会显示滚动菜单组件 -->
            <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar-wrapper">
                <el-menu default-active="2" class="el-menu-vertical-demo sub-menu" :collapse="isCollapseScrollBar">
                    <el-menu-item @click="NavigatorRoute('/center/home')" index="shouye">
                        <iconfont style="pointer-events: none;margin-right:5px;font-size: 1.2rem;" :name="`icon-home`">
                        </iconfont>
                        <template #title>
                            <span>首页</span>
                        </template>
                    </el-menu-item>

                    <template v-for="(route, index) in cacheRoutes" :key="index">
                        <el-sub-menu v-if="route.children && route.children.length > 0" :index="`${index}`">
                            <template #title>
                                <BadgeLink :badgeName="route.meta?.badgeName || 'default'">
                                    <iconfont style="pointer-events: none;margin-right:5px;font-size: 1.2rem;"
                                        :name="route.meta?.icon || `icon-caidan`"></iconfont>

                                </BadgeLink>
                                <span>{{ route.meta?.title }}</span>
                            </template>

                            <template v-for="(child, childIndex) in route.children" :key="childIndex">
                                <el-sub-menu v-if="child.children && child.children.length > 0"
                                    :index="`${index}-${childIndex}`">
                                    <template #title>

                                        <BadgeLink :badgeName="child.meta?.badgeName || 'default'">
                                            <iconfont style="pointer-events: none;margin-right:5px;font-size: 1.2rem;"
                                                :name="child.meta?.icon || `icon-caidan`"></iconfont>
                                        </BadgeLink>
                                        <span>{{ child.meta?.title }}</span>
                                    </template>
                                    <template>
                                        <el-menu-item v-for="(item, itemIndex) in child.children" :key="itemIndex"
                                            :index="`${index}-${childIndex}-${itemIndex}`">
                                            <BadgeLink :badgeName="item.meta?.badgeName || 'default'">
                                                <iconfont
                                                    style="pointer-events: none;margin-right:5px;font-size: 1.2rem;"
                                                    :name="item.meta?.icon || `icon-caidan`"></iconfont>
                                            </BadgeLink>
                                            <span>{{ item.meta?.title }}</span>
                                        </el-menu-item>
                                    </template>
                                </el-sub-menu>
                                <el-menu-item v-else @click="NavigatorRouteByName(child.name)"
                                    :index="`${index}-${childIndex}`">

                                    <BadgeLink :badgeName="child.meta?.badgeName || 'default'">
                                        <iconfont style="pointer-events: none;margin-right:5px;font-size: 1.2rem;"
                                            :name="child.meta?.icon || `icon-caidan`"></iconfont>
                                    </BadgeLink>
                                    <span>{{ child.meta?.title }}</span>
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                        <el-menu-item v-else :index="`${index}`" @click="NavigatorRouteByName(route.name)">
                            <BadgeLink :badgeName="route.meta?.badgeName || 'default'">
                                <iconfont style="pointer-events: none;margin-right:5px;font-size: 1.2rem;"
                                    :name="route.meta?.icon || `icon-caidan`"></iconfont>
                            </BadgeLink>
                            <template #title>
                                <span>{{ route.meta?.title }}</span>
                            </template>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-scrollbar>
    </div>
</template>


<script lang="ts" name='SideBar' setup>
    import { ref } from "vue"
    import Logo from "./Logo.vue";
    import {
        Document,
        Menu as IconMenu,
        Location,
        Setting,
    } from '@element-plus/icons-vue'
    import useCenterStore from "@/stores/modules/center";
    import { storeToRefs } from "pinia";
    import { useRouter } from "vue-router";
    import { useRoutesStore } from "@/stores/modules/routes";
    import BadgeLink from "@/components/BadgeLink/BadgeLink.vue";
    import usecommentStore from "@/stores/modules/comment";
import { useDeviceStore } from "@/stores/modules/device";
import { useEvent } from "@/utils/mitt";


    const centerStore = useCenterStore()
    const { isCollapseScrollBar } = storeToRefs(centerStore)

    const sideBarContainerRef = ref<HTMLDivElement | null>(null)

    const {isLargeScreen} =storeToRefs(useDeviceStore())
    
    const bindEvent = {
        onSwipeLeft: toggleShowLeft,
        onSwipeRight: toggleShowRight,
        isGlobal: true
    }
    const showSideBarMoinletype = ref(false);
    const isShowSideBarWhenMoible = computed(()=>{
        return !isLargeScreen.value && showSideBarMoinletype.value
    })
    
    function toggleShowRight() {
        showSideBarMoinletype.value = false;
    }
    function toggleShowLeft() {
        showSideBarMoinletype.value = true;
    }


    const instance = getCurrentInstance();
    function setInstanceShapeInfo() {
        if (instance && instance.proxy) {
            // 访问组件的根 DOM 元素
            const componentElement = instance.proxy.$el;
            // 例如：调用 store 方法设置元素形状信息
            centerStore.setElementShapeInfo(componentElement, 'sideBarShapeInfo');
        }
    }
    


    const router = useRouter();
    const { cacheRoutes } = storeToRefs(useRoutesStore())
    function NavigatorRoute(routePath: string) {
        router.push(routePath)
    }
    function NavigatorRouteByName(routeName: string) {
        router.push({
            name: routeName
        })
    }


    watch([() => isCollapseScrollBar.value], async (newVal, oldVal) => {
    
            showSideBarMoinletype.value = true
            await nextTick(()=>{})
            setInstanceShapeInfo();
    },{immediate:true})

    onMounted(() => {
        setInstanceShapeInfo();

    })



    onUnmounted(() => {

    })
</script>

<style scoped lang="scss">

    .SideBar-container {
        max-width: 200px;
        height: 100vh;
        top: 0;
        left: 0;
        position: sticky;
        background-color: #fafafa;
    }


    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    :deep() {
        
        .scrollbar-wrapper {
            height: calc(100vh - 60px) !important;
            
        }

        .el-scrollbar__view {
            height: 100% !important;

            .sub-menu {
                height: 100% !important;
                background-color: rgb(252, 252, 252);
            }
        }
    }

    @media screen and (max-width: 768px) {
        .SideBar-container.mobile {
            height: 100vh;
            display: none;
        }
    }
</style>