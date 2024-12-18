<template>
    <div ref="scrollcontainer" class="scroll-timelines clearfix">
        <template v-for="(item, index) in props.itemsList" :key="index">
            <div
                class="item"
                v-add-class-on-visible="['item-active', 200, false]"
                :data-text="`《${item.note_category}》`"
            >
                <div class="content">
                    <div alt="" class="content-info">
                        <p>{{ item.summary }}...</p>
                        <router-link :to="`/article?fileId=${item.file_id}&name=${item.note_name}`">
                            <p class="read-more">🔽阅读更多🚀🚀🚀</p></router-link
                        >
                    </div>
                    <h2 class="content-title">{{ moment(item.create_time).format('YYYY/MM/DD') }}</h2>
                    <p class="content-desc">
                        {{ item.note_name }}
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" name="ScrollTimeLine" setup>
import moment from 'moment'
import { onMounted, ref } from 'vue'
import vAddClassOnVisible from '@/hooks/vAddClassOnline'
const scrollcontainer = ref<null | HTMLElement>(null)
const props = defineProps({
    itemsList: {
        type: [Object],
        default: [
            {
                year: '2018',
                description: '日子只需一天一天好好地过，别无他法。',
                image: '/public/avator/1.png'
            },
            {
                year: '2019',
                description: '每一天都应充满希望，迎接新的挑战。',
                image: '/public/avator/2.png'
            }
        ]
    }
})
</script>

<style scoped lang="scss">
.scroll-timelines {
    margin-left: calc(100vw - 100%);
    z-index: 1;
    display: flex;
    margin: 0px auto;
    flex-wrap: wrap;
    flex-direction: column;
    max-width: 800px;
    position: relative;
    min-height: 100%;
    scroll-behavior: smooth;
    overflow: auto;
    &::-webkit-scrollbar {
        display: none;
    }
    .item {
        padding: 20px 0px;
        opacity: 0.3;
        filter: blur(2px);
        transition: 0.5s;
        // box-sizing: border-box;
        width: calc(55% - 40px);
        display: flex;
        position: relative;
        // transform: translateY(-80px);

        border-radius: 40px;

        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            .content-title {
                font-weight: normal;
                font-size: 3rem;
                margin: -10px 0 0 0;
                transition: all 0.4s ease-in;
                padding: 0 10px;
                box-sizing: border-box;
                /** 任意背景色 **/
                // --bg: #ffcc00;
                // background: var(--bg);
                // color: rgb(from var(--bg) calc(1 - r) calc(1 - g) calc(1 - b)); /** 基于背景反转颜色 **/
                border-radius: 1rem;
                background: radial-gradient(
                        92.71% 92.71% at 7.59% 128.39%,
                        #ffeec2 0%,
                        rgba(255, 238, 194, 0.21) 60.42%,
                        rgba(194, 233, 255, 0) 100%
                    ),
                    radial-gradient(
                        49.19% 88.28% at 27.01% -13.54%,
                        rgba(93, 227, 236, 0.73) 0%,
                        rgba(93, 227, 236, 0.1679) 59.78%,
                        rgba(93, 227, 236, 0) 100%
                    ),
                    radial-gradient(
                        114.51% 155.86% at 90.18% 89.06%,
                        rgba(254, 75, 139, 0.7) 0%,
                        rgba(254, 75, 139, 0) 100%
                    ),
                    linear-gradient(
                        237.32deg,
                        #454abb 18.14%,
                        rgba(69, 74, 187, 0.76) 31.3%,
                        rgba(69, 74, 187, 0.39) 49.35%,
                        rgba(91, 196, 230, 0) 76.77%
                    ),
                    radial-gradient(118.75% 118.75% at 3.35% 25.78%, #308ee6 0%, rgba(48, 158, 230, 0) 73.91%, #f2f5fa);
                background-blend-mode: normal, hard-light, normal, darken, normal, normal;
                filter: blur(0.5px);
            }

            .content-desc {
                padding: 0 10px;
                max-height: 50px;
                max-width: 70%;
                margin: 0;
                font-size: 1rem;
                box-sizing: border-box;
                line-height: 25px;
                text-align: center;
                border-radius: 1rem;
                background: radial-gradient(
                        73.4% 100.98% at 95.54% 95.05%,
                        rgba(255, 156, 65, 0.78) 0%,
                        rgba(255, 168, 88, 0) 100%
                    ),
                    linear-gradient(197.37deg, #fff0a4 -0.38%, rgba(255, 240, 164, 0) 101.89%),
                    radial-gradient(
                        58.85% 73.83% at 9.82% 3.13%,
                        rgba(49, 132, 255, 0.8) 0%,
                        rgba(56, 75, 247, 0.208) 52.16%,
                        rgba(62, 246, 246, 0) 100%
                    ),
                    linear-gradient(
                        117.39deg,
                        #3e9ef6 3.91%,
                        rgba(238, 43, 183, 0.33) 37.48%,
                        rgba(246, 62, 106, 0) 73.98%
                    ),
                    linear-gradient(306.53deg, #ffaadd 19.83%, rgba(255, 170, 221, 0) 97.33%);
                background-blend-mode: normal, normal, normal, normal, normal, normal;
                filter: blur(0px);
            }
            .content-info {
                padding: 10px 10px 14px;
                margin: 0;
                font-size: 1rem;
                line-height: 1rem;
                overflow: hidden;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                background-color: #240101;
                color: #fff;
                font-weight: 400;
                box-shadow: 2px 2px 2px 1px rgba(165, 54, 54, 0.5) inset;
                .read-more {
                    margin-top: 5px;
                    padding: 5px 10px;
                    background-color: #dbd5ba;
                    border-radius: 5px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    &:hover {
                        background-color: #ccc49f;
                    }
                }
            }
        }

        &:before {
            content: attr(data-text);
            width: 100%;
            position: absolute;
            padding: 4px 0px !important;
            color: rgba(255, 255, 255, 0.5);
            font-size: 13px;
            border-left: 2px solid rgba(255, 255, 255, 0.5);
            top: 70%;
            margin-top: -5px;
            padding-left: 20px;
            opacity: 0;
            right: calc(-100% - 100px);
            font: 900 20px;
            letter-spacing: 5px;
        }
        &:nth-child(even) {
            align-self: flex-end;
            &::before {
                right: auto;
                text-align: right;
                left: calc(-100% - 100px);
                border-left: none;
                padding-left: 0;
                border-right: 2px solid rgba(255, 255, 255, 0.5);
                padding-right: 15px;
            }
        }
    }

    &::before {
        position: absolute;
        left: 50%;
        width: 2px;
        height: 100%;
        margin-left: -1px;
        content: '';
        background: rgba(255, 255, 255, 0.7);
        background-color: #ffcc00;
    }
}

.item-active {
    opacity: 1 !important;
    transform: translateY(10px) !important;
    filter: blur(0px) !important;

    .content-info {
        box-shadow: 2px 2px 2px 2px rgba(230, 227, 227, 0.5) inset !important;
        color: #fff !important;
        filter: blur(0px) !important;
        line-height: 1rem;
    }

    &::before {
        top: 50% !important;
        transition: 0.3s all 0.2s !important;
        opacity: 1 !important;
        box-shadow: 1px 1px 1px 1px rgba(230, 227, 227, 0.5) inset !important;
    }

    z-index: 9999;
}

.content-info {
    max-width: 60vw;
}

.sub-title {
}

@media screen and (max-width: 768px) {
    .scroll-timelines {
        // transform: translateY(50px);
    }
    .item {
        align-self: baseline !important;
        width: 100%;
        padding: 0 30px 150px 80px;
        &:before {
            left: 10px !important;
            padding: 0 !important;
            top: 10% !important;
            text-align: center !important;
            width: 60px;
            border: none !important;
            box-shadow: 1px 1px 1px 1px rgba(230, 227, 227, 0.8) inset !important;
            color: #fff !important;
        }
        &:last-child {
            padding-bottom: 40px;
        }
    }

    .item-active {
        &:before {
            transform: translateX(calc(100% + 60px));
        }
    }
}

@media screen and (max-width: 768px) {
    .scroll-timelines:before {
        left: 40px;
    }
}
</style>
