<template>
    <div ref="topNav" class="header-app clearfix " :class="{ 'hamburger-menu-container': isShowRight }">
        <ul style="display: none;" class="right-btn" @click="toggleShowRight">
            <iconfont name="icon-liebiao" />
        </ul>

        <ul v-swipe="bindevent" class="static left-area" :class="{ 'hamburger-menu': isShowRight }">
            <li>
                <iconfont name="icon-zhuye" />
                <router-link to="/home">
                    主页
                </router-link>
            </li>
            <li>
                <iconfont name="icon-guanyuguwen" />
                <router-link to="/about">
                    关于
                </router-link>
            </li>
            <li>
                <iconfont name="icon-article" />
                <router-link to="/article">
                    文章
                </router-link>
            </li>
            <li>
                <iconfont name="icon-biaoqian" />
                <router-link to="/tag">
                    标签
                </router-link>
            </li>
            <li>
                <iconfont name="icon-fenlei" />
                <router-link to="/category">
                    分类
                </router-link>
            </li>
            <li>
                <iconfont name="icon-shijianbiao" />
                <router-link to="/timelines">
                    时间线
                </router-link>
            </li>
            <li>
                <iconfont name="icon-yinle" />
                <!-- 新打开一个标签页 -->
                <a :href="musicUrl" target="_blank">音乐</a>
            </li>   
            <li>
                <iconfont name="icon-liaotianshi1" />
                <router-link to="/chatroom">
                    聊天室
                </router-link>
            </li>
            <li>

                <el-switch v-model="globalTheme" @change="changeTheme">
                    <template #active-action>
                        <span class="custom-active-action">黑</span>
                    </template>
                    <template #inactive-action>
                        <span class="custom-inactive-action">白</span>
                    </template>
                </el-switch>
            </li>
        </ul>

        <svg class="title-icon" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
            <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color: #87CEEB; stop-opacity: 1" />
                    <stop offset="100%" style="stop-color: #ffffff; stop-opacity: 1" />
                </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#skyGradient)" />

            <text x="20" y="50" font-family="Arial" font-size="36" fill="#2F4F4F" dominant-baseline="middle">
                🤷‍♀️天空之城🤩
            </text>

            <text x="20" y="80" font-family="Arial" font-size="20" fill="#4682B4" dominant-baseline="middle">
                The City of Sky
            </text>
            <circle cx="10" cy="10" r="20" fill="#fee140" />

            <path d="M0 10 L60 20 L40 30 L0 0 Z" fill="#FFD700" stroke="#DAA520" stroke-width="2" />
        </svg>

        <!-- 右侧导航栏 -->
        <!-- 请在此添加您的右侧导航栏 -->
        <ul class="static right-area">
            <li v-if="!isLogin" v-tip="loginTip">
                <iconfont name="icon-dengluyonghu" />
                <router-link to="/login">
                    登录
                </router-link>
            </li>
            <li v-else @click="loginOut">
                <iconfont name="icon-dengluyonghu" />
                <a>退出</a>
            </li>
            <li>
                <iconfont name="icon-zhuce1" />
                <router-link to="/login?type=register">
                    注册
                </router-link>
            </li>
            <li>
                <router-link to="/center">
                    个人中心
                </router-link>
            </li>
            <li class="search">
                <!-- <input type="text" placeholder="搜索"> -->
                <SearchNav />
            </li>
        </ul>
    </div>
</template>

<script lang="ts" name=HearderNav setup>
    import router from "@/router";
    import "./static/headerNav.scss"
    import { ref, onMounted } from "vue"
    import { useUserStore } from "@/stores/modules/user";
    import { storeToRefs } from "pinia";
    import { useRoute } from "vue-router";
    import SearchNav from "./SearchNav/SearchNav.vue";
    import useSettingStore from "@/stores/modules/setting";
import { config } from "@/config/config";

    const userStore = useUserStore();
    const { isLogin } = storeToRefs(userStore)

    const musicUrl = config.musicUrl

    const bindevent = {
        onSwipeLeft: toggleShowRight,
        onSwipeRight: toggleShowRight,
        isGlobal: false
    }

    const topNav = ref({});

    const isShowRight = ref(false)

    const loginTip = "已经有账号,登录";
    // 汉堡菜单的偏移量
    const hamburgerX = 100;

    function toggleShowRight() {
        isShowRight.value = !isShowRight.value
    }
    function loginOut() {
        userStore.logout();
        router.push('/login');
    }

    /* 切换白天和黑夜 */
    const settingStore = useSettingStore()
    const { globalTheme } = storeToRefs(settingStore)

    function changeTheme(value: boolean) {
        settingStore.changeTheme(value)
    }


</script>

<style scoped lang="scss">


    $light-background: #ffffff;
    $dark-background: #2c3e50;
    $light-text: #333;
    $dark-text: #ecf0f1;
    $primary-color: #3498db;
    $secondary-color: #f39c12;

    // 2. 定义渐变色
    $light-gradient: linear-gradient(135deg, #87CEEB, #ffffff);
    $dark-gradient: linear-gradient(135deg, #303233, #1a1f24);

    // 3. 定义混合 (mixin) - 综合背景、文本和图形的主题样式
    @mixin theme_styles() {
        // 默认明亮主题
        background-color: $light-gradient; // 默认背景渐变色
        color: $light-text; // 默认文本颜色

        circle {
            fill: $primary-color; // 默认圆形颜色
        }

        path {
            fill: $secondary-color; // 默认路径填充颜色
            stroke: #000; // 默认路径边框颜色
            stroke-width: 2;
        }

        [data-theme="dark"] & {
            rect {
                fill: $background-color-dark-theme;
            }

            // 暗色主题样式
            background-color: $dark-gradient; // 暗色背景渐变色
            color: $dark-text; // 暗色文本颜色

            circle {
                fill: $primary-color; // 暗色主题下的圆形颜色
            }

            path {
                fill: $secondary-color; // 暗色主题下的路径填充颜色
                stroke: #fff; // 暗色主题下的路径边框颜色
                stroke-width: 2;
            }
        }
    }



    .header-app {
        display: flex;
        top: 0;
        z-index: 99;
        box-shadow: ba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }


    .static {
        position: relative;
        display: flex;
    }


    // 定义头部样式
    .header-app {
        position: sticky;
        // 处理放大时候的缩放
        transition: transform 0.3s;
        box-sizing: border-box;
        padding: 0 0px;
        overflow: hidden;
        min-width: 100vw;
        height: $header-height;
        animation: changeColor 10s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        justify-content: space-between;
        align-items: center;
        @include hd_nav_bc_color();

        .title-icon {
            height: 100%;


            @include theme_styles()
        }

        h3 {
            width: 100%;
            height: 100px;
            line-height: $header-height;
            text-align: center;
            @include hd_nav_ft_color();
            margin: 0;
            mix-blend-mode: multiply;

        }


        .right-area {
            align-items: center;
            justify-content: flex-start;
            padding-left: 15px;
            @include hd_nav_ft_color();

            li {
                margin: 0 15px;

            }

            .search {
                display: flex;

            }


        }

        .left-area {
            align-items: center;
            justify-content: flex-start;
            padding-left: 5px;
            margin-left: 0px;

            li {
                margin: 0 15px;
                @include hd_nav_ft_color();
            }

            .list {
                display: none;
            }
        }


    }

    // 媒体查询
    @media screen and (max-width: 768px) {
        li {
            line-height: $header-height;
        }

        .header-app {
            position: sticky;
            padding: 0;
            font-size: 12px;
            transition: left 0.6s 0.3s ease;
            left: 0;

            .right-btn {
                display: block !important;
            }



            .left-area {
                // 如果li没有list类则隐藏
                flex-direction: column;
                position: fixed;
                background-color: #a89898;
                margin: 0;
                width: 0px;
                height: 0px;
                top: 0;
                left: 0;
                padding: 0;
                z-index: 999;
                transition: all 0.6s 0.3s ease;
                overflow: hidden;

                li:not(.list) {
                    display: block;

                    svg {
                        display: inline-block;
                        width: 15px;
                        height: 15px;
                        fill: #fff;
                        margin-right: 3px;
                    }

                    a {
                        color: #fafafa;
                    }
                }
            }

            .hamburger-menu {
                width: $hamburger-offset-x;
                height: 100vh;
            }

            .right-area {
                padding: 0 0;

                li {
                    display: block;
                    height: $header-height;

                    svg {
                        display: none;
                    }

                    a {
                        display: inline-block;
                        width: 30px;
                        font-size: 12px;
                    }
                }
            }
        }

        .hamburger-menu-container {
            left: $hamburger-offset-x;
        }
    }

    svg {
        margin: 0 3px;
        height: 100%;
    }

    a {
        @include hd_nav_ft_color();
    }

    :deep() {
        .el-switch {
            .el-switch__core {
                background-color: $header-background-color;
            }
        }

        .el-switch.is-checked .el-switch__core {
            background-color: $header-background-color-dark;
            border-color: var(--el-switch-border-color, var(--el-switch-on-color));
        }

    }
</style>