<template>
    <!-- 启用el-plus的中文模式 -->
    <el-config-provider :locale="zhCn">
        <HearderNav v-if="isShawNavTop" />
        <div class="app clearfix">
            <router-view />
        </div>
    </el-config-provider>
</template>

<script lang="ts" name="App" setup>
    import HearderNav from './components/HeaderNav/HeaderNav.vue'
    import { ElConfigProvider } from 'element-plus'
    import zhCn from 'element-plus/es/locale/lang/zh-cn'
    import { useRouter } from 'vue-router'
    import { computed } from 'vue'
    import { useDeviceStore } from './stores/modules/device'
    import { getLocalStorage } from './utils/localStorage'
    import useSettingStore from './stores/modules/setting'




    /* 滚动条宽度 */
    // 这个必须有 否则pinia是不会执行里面获取滚动条宽度的逻辑的
    const deviceStore = useDeviceStore();
    // 是否隐藏导航栏
    const router = useRouter();

    const isShawNavTop = computed(() => {
        if (router.currentRoute.value.meta?.hideHeader) {
            return false
        } else {
            return true
        }
    })

    const settingStore = useSettingStore()
    onBeforeMount(() => {
        const golbalTheme = getLocalStorage('globalTheme');        
        if (golbalTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        if (typeof golbalTheme === 'undefined') {            
            /* 根据系统主题匹配对应主题 */
            settingStore.updateThemeBasedOnSystem()
        }


    })



</script>

<style lang="scss">

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: 'PT Serif', 'Bitter', serif;
        color: #2c3e50;
        /* 深蓝色标题 */
        mix-blend-mode: differenc;
    }

    html,
    body,
    .app {
        height: 100%;
        background-color: transparent;
        overscroll-behavior: none;
        /* 禁止任何溢出效果 */
        min-height: 100%;
        box-sizing: border-box;
        width: var(--screen-width);

    }

    body {
        overscroll-behavior-y: contain;
        transition: width 0.3s ease;
        ;
    }


    @media screen and (max-width: 768px) {
        .app {
            width: 100vw;
        }
    }
</style>
