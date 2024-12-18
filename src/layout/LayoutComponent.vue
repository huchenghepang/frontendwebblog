<template>
    <div class="LayoutComponent-container">
        <!-- 侧边栏打开 和 是移动设备 一个遮罩 并且点击侧边栏会关闭侧边栏  -->
        <div class="drawer-bg" />
        <SideBar class="sidebar-container"  />
        <!-- 主内容 -->
        <!-- 是否有面包屑 其宽度是页面宽度减去侧边栏的宽度 -->
        <div class="main-container" :style="{ width: widthInfo }">
            <!-- 是否有吸附的头部  -->
            <div>
                <NavBar v-if="isShowNavBar" :isShowUserInfo="isShowUserInfo"  @updateUserInfo="updateUserInfo" @changeRole="changeRole" /> <!-- 导航栏 -->
                <!-- 面包屑 标签导航 其会影响主界面容器的高度 -->
                <TagView v-if="isShowTagNavBar" />
            </div>
            <AppMain /> <!-- 主内容 -->
            <!-- 是否需要显示设置 -->
            <RightPanel  v-show="route.name==='centerhome'" />
        </div>
    </div>
</template>

<script lang="ts" name='LayoutComponent' setup>
    import SideBar from "./components/SideBar/SideBar.vue";
    import NavBar from "./components/NavBar/NavBar.vue";
    import AppMain from "./components/AppMain/AppMain.vue";
    import RightPanel from "./components/RightPanel/RightPanel.vue";
    import TagView from "./components/TagView/TagView.vue";
    import useCenterStore from "@/stores/modules/center";
    import { storeToRefs } from "pinia";
    import { useDeviceStore } from "@/stores/modules/device";
    import { useUserStore } from "@/stores/modules/user";
    import { provide } from 'vue'
    import { useRoute, useRouter } from "vue-router";
    import { getLocalStorage } from "@/utils/localStorage";
    import { createDynamicRoutes } from "@/router";
    import usecommentStore from "@/stores/modules/comment";
    import useSettingStore from "@/stores/modules/setting";

    const centerStore = useCenterStore();
    const userStore = useUserStore();
    const { userInfo, roles } = storeToRefs(userStore);

    const settingStore = useSettingStore();
    const {isShowNavBar,isShowTagNavBar,isShowUserInfo} = storeToRefs(settingStore)
    
    provide("userInfo", userInfo.value)
    provide("roles", roles) // 数组provide 直接将响应式的对象暴露出去 否则会丢失响应式

    const { sideBarShapeInfo, isCollapseScrollBar } = storeToRefs(centerStore);
    const widthInfo = ref('100%')

    const { screenWidth } = storeToRefs(useDeviceStore());
    /* 更新个人信息 */

    watch([() => isCollapseScrollBar.value, () => screenWidth.value], () => {
        /* 这里的逻辑很重要：实现根据sidebar的折叠状态计算出appmain（右侧的宽度) */
        let width = "100%";
        if (sideBarShapeInfo.value.width && screenWidth.value) {
            if (isCollapseScrollBar.value) {
                width = screenWidth.value - 64 + 'px'
            } else {
                width = screenWidth.value - sideBarShapeInfo.value.width + "px";
            }

        }
        widthInfo.value = width
    })



    const instance = getCurrentInstance();


    function setInstanceShapeInfo() {
        if (instance && instance.proxy) {
            // 访问组件的根 DOM 元素
            const componentElement = instance.proxy.$el;
            // 例如：调用 store 方法设置元素形状信息
            centerStore.setElementShapeInfo(componentElement, 'layoutComponentShapeInfo');
        }
    }



    function updateUserInfo() {
        const currentRole: roleType = getLocalStorage("currentRole");
        userStore.getUserInfo({ roleId: currentRole.roleId });
    }

    /* 切换角色 */
    const router = useRouter()
    async function changeRole(value: number) {
        const data = {
            type: 0,
            roleId: value
        }
        await userStore.getUserInfo(data);
        // 切换角色后到首页
        router.push("/")
        // location.reload() // 刷新当前页面

    }

    const route = useRoute()



    const commentStore = usecommentStore();
    onMounted(async () => {
        setInstanceShapeInfo();

        // await userStore.getUserInfo();

        if (route.name === "centerhome") {
            // 创建新的路由
            const newPermission = getLocalStorage("permissions");
            await createDynamicRoutes(newPermission, []);
        }

        const userId = userInfo.value.userId
        if (commentStore.status === "pending") {
            commentStore.getNoReviewCommentCount()
            await commentStore.getComments(userId);
            //    这个必须读取一下要不然会不更新数据
            console.log(commentStore.commentsNoRepliedByMe);

        }



    });




</script>

<style scoped lang="scss">

    .LayoutComponent-container {
        display: flex;
        @include filter_invert();
        @include bg_main_color();
        @media screen and (max-width: 768px) {
        }

    }


    .main-container {
        background-color: #fafafa;
    }
</style>