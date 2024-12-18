<template>
    <div class="container">
        <h3 class="item-title text-over-hidden-double" @click.self="getArticle">
            {{ props.title }}
            <span v-tip="`切换收缩`" @click.stop="toggleExpandOrPutaway">
                <iconfont
                    style="pointer-events: none"
                    :name="expandOrPutaway ? 'icon-shouqi' : 'icon-xiangxia'"
                ></iconfont>
            </span>
        </h3>
        <div class="item-content" v-if="isShowContent && props.content" @click="getArticle">
            <!-- 文章内容 -->
            <slot name="content">
                <Transition name="expand-putaway">
                    <div v-if="expandOrPutaway">
                        <p v-if="props.toc">
                            <template v-for="(item, index) in props.toc" :key="index">
                                <h3 v-if="item.level == 'h1'">
                                    {{ item.title }}
                                </h3>
                                <h4 v-if="item.level == 'h2'">
                                    {{ item.title }}
                                </h4>
                                <h5 v-if="item.level == 'h3'">
                                    {{ item.title }}
                                </h5>
                            </template>
                        </p>
                        <p v-else>{{ props.content }}......</p>
                    </div>
                </Transition>
            </slot>
        </div>
        <div class="item-footer">
            <slot name="footer">
                <span class="category-item"
                    >分类：<router-link :to="{name:'category',query:{categoryname:props.category}}"><b class="tag flat">{{ props.category }}</b></router-link></span
                >
                <div class="tags">
                    <router-link
                        class="tag"
                        :to="{ name: 'tag', query: { tagname: tag } }"
                        v-tip="`点击跳转>` + `tag`"
                        href=""
                        v-for="(tag, index) in props.tags"
                        :key="index"
                        >{{ tag }}</router-link
                    >
                </div>
                <span class="datetime">时间:{{ props.datetime }}</span>
            </slot>
        </div>
    </div>
</template>

<script lang="ts" name="ArticleItem" setup>
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
    title: {
        type: String,
        default: '文章标题'
    },
    fileId: {
        type: String,
        default: undefined
    },
    content: {
        type: String,
        default: undefined
    },
    toc: {
        type: Object,
        default: undefined
    },
    category: {
        type: String,
        default: '编程'
    },
    tags: {
        type: Array,
        default: () => ['tag1', 'tag2', 'tag3', 'tag4']
    },
    datetime: {
        type: String,
        default: '2020-01-01 01:01:01'
    },
    isShowContent: {
        type: Boolean,
        default: true
    }
})

const expandOrPutaway = ref(true)

function toggleExpandOrPutaway(event: Event) {
    expandOrPutaway.value = !expandOrPutaway.value
    event.stopPropagation()
}

const router = useRouter()
/*  根据fileId请求对应文章 */
function getArticle() {
    router.push({ name: 'article', query: { fileId: props.fileId,name:props.title } })
}
</script>

<style scoped lang="scss">
/* 两行显示 */
.text-over-hidden-double {
    overflow-y: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    /* 对于移动端，可根据需要调整行数 */
    @media screen and (max-width: 768px) {
        -webkit-line-clamp: 3;
    }
}

/* 头部区域背景色 */
$article-item-header-background-color: #3b84cc;
/* 头部区域背景色 */
$article-item-header-color: #fff;
/* 头部文字颜色 */

$article-item-background-color: #fff;
/* 脚注区域背景色 */
$article-item-footer-background-color: #f7f7f7;
/* 脚注区域背景色 */
$article-item-footer-color: #888;
/* 脚注文字颜色 */

/* 内容区域背景色 */
$article-item-content-background-color: #fff;
/* 内容区域背景色 */
$article-item-content-color: #333;
/* 内容文字颜色 */

.container {
    cursor: pointer;
    max-width: 800px;
    width: 90%;
    background-color: $article-item-background-color;
    border-radius: 10px;
    box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2);
    color: #010101;
    box-sizing: border-box;
    border: 1px solid #ccc;
    @include filter_invert();
    .item-title {
        height: auto;
        border-radius: 10px;
        text-align: center;
        margin: 0;
        padding: 5px 10px;
        border-bottom: 2px solid #ccc;
        font-size: 20px;
        background-color: $article-item-header-background-color;
        color: $article-item-header-color;

        &:hover {
            background-color: #2d6199;
        }

        @media screen and (max-width: 768px) {
            font-size: 16px;
        }
    }

    /* 文章内容 */
    .item-content {
        padding: 0px 10px;
        border-bottom: 1px solid #c1c2c3;
        font-size: 16px;
        background-color: $article-item-content-background-color;
        color: $article-item-content-color;
        line-height: 1.5;
        overflow-x: hidden;

        @media screen and (max-width: 768px) {
            font-size: 14px;
        }
    }

    /* 文章的脚注区域 */
    .item-footer {
        display: flex;
        padding: 5px 10px;
        justify-content: space-between;
        flex-wrap: wrap;
        background-color: $article-item-footer-background-color;
        color: $article-item-footer-color;

        .category-item {
            font-size: 16px;
            color: #666666;
            margin-bottom: 5px;

            /*  */
            b {
                background-color: #faf7f7;
                padding: 1px;
                box-shadow: 1px 1px 2px rgba(212, 187, 187, 0.4);
                border: 1px solid #c1c2c3;
                cursor: pointer;
                margin: 1px;
                transition: all 0.3s ease-in-out;

                &:hover {
                    background-color: #c1c2c3;
                    color: #fff;
                }
            }
        }

        .datetime {
            font-size: 12px;
            color: #666666;
            line-height: 1rem;
            padding: 2px;
        }
    }
}

@media screen and (max-width: 768px) {
    /* 手机端 */
    .container {
        width: 100vw;
        margin: 10px 0;
    }
}

/* 标签样式 */
.tag {
    display: inline-block;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    background-color: #35a8dd;
    border-radius: 12px;
    text-transform: capitalize;
    transition: all 0.3s ease;

    @media screen and (max-width: 768px) {
        padding: 3px 8px;
        font-size: 10px;
    }
}

/* 鼠标悬停时的效果 */
.tag:hover {
    background-color: #5286be;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 扁平化标签样式 */
.tag.flat {
    display: inline-block;
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 600;
    color: #265383;
    background-color: #f0f8ff;
    border: 2px solid #2d6199;
    border-radius: 16px;
    text-transform: capitalize;
    transition: all 0.3s ease;

    @media screen and (max-width: 768px) {
        padding: 4px 10px;
        font-size: 12px;
    }
}

/* 鼠标悬停时的效果 */
.tag.flat:hover {
    color: #fff;
    background-color: #007bff;
}

/* 设置过渡 */
.expand-putaway-enter-active {
    transition: all 0.3s ease-out;
}

.expand-putaway-leave-active {
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.95, 1);
}

.expand-putaway-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.expand-putaway-leave-to {
    // 不用height 避免影响性能
    opacity: 0;
}
</style>
