<template>
    <div class="RightPanel-container">
        <el-button class="btn" type="primary" style="width: 40px;height: 40px;" @click="toggleShowDraw">
            <el-icon size="30">
                <Setting />
            </el-icon>
        </el-button>

        <el-drawer :size="size" lock-scroll v-model="drawer" title="个人中心设置" :direction="direction"
            :before-close="handleClose">
            <div class="setting-container">
                <el-switch v-model="isShowNavBar" class="mb-2" active-text="显示导航栏" inactive-text="隐藏导航栏" />
                <el-switch v-model="isShowUserInfo" class="mb-2" active-text="显示个人信息" inactive-text="隐藏个人信息" />
                <el-switch v-model="isShowTagNavBar" class="mb-2" active-text="显示标签导航" inactive-text="隐藏标签导航" />
                <el-switch v-model="globalTheme" change="changeTheme" class="mb-2" active-text="夜间模式"
                    inactive-text="白天模式" />
                <el-switch v-model="isCollapseScrollBar" class="mb-2" active-text="收缩侧边栏" inactive-text="伸展侧边栏" />
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts" name='RightPanel' setup>
    import { ref } from "vue"

    import type { DrawerProps } from 'element-plus'
    import useSettingStore from "@/stores/modules/setting";
    import { storeToRefs } from "pinia";
    import useCenterStore from "@/stores/modules/center";
    import { setLocalStorage } from "@/utils/localStorage";
    import { useDeviceStore } from "@/stores/modules/device";

    const direction = ref<DrawerProps['direction']>('rtl')
    const drawer = ref(false);
    const settingStore = useSettingStore();

    type SettingMutation = {
        key: string;
        newValue: string;
    };
    const subScribeSettingStore = settingStore.$subscribe((mutation, state) => {
        const { key, newValue } = mutation.events as SettingMutation
        if (key) {
           
            if(key==='globalTheme'){
                settingStore.changeTheme(Boolean(newValue))
            }else{
                setLocalStorage(key, newValue);
            }
        }
    });




    const centerStore = useCenterStore();
    const subScribeCenterStore = centerStore.$subscribe((mutation, state) => {
        const { key, newValue } = mutation.events as SettingMutation
        if (key === 'isCollapseScrollBar') {
            setLocalStorage(key, newValue)
        }
    });

    const { isCollapseScrollBar } = storeToRefs(centerStore)
    const { isShowNavBar, isShowUserInfo, isShowTagNavBar, globalTheme } = storeToRefs(settingStore)
    watch(drawer, (newValue, oldValue) => {
        if (newValue) {
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = ''; // 恢复 <html> 滚动
        }

    })

    function toggleShowDraw() {
        drawer.value = !drawer.value

    }
    onUnmounted(() => {
        /* 取消订阅 */
        subScribeSettingStore()
        subScribeCenterStore()
    })

    const { deviceType } = storeToRefs(useDeviceStore())
    /* 抽屉的宽度 */
    const size = computed(() => {
        let size = '30%';
        try {
            if (deviceType.value === "mobile") {
                size = '70%'
            }
            return size
        } catch (error) {
            return size
        }
    })

    const handleClose = (done: () => void) => {
        done()
    }


</script>

<style scoped lang="scss">
    .btn {
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        z-index: 99999;
    }

    .setting-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
    }

</style>