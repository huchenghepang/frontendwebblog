<template>
    <div class="category-page">
        <div class="category-container">
            <template v-for="(item, index) in categoryCounts" :key="index">
                <div :data-index="index" class="category-item" :class="{ 'active-tag': activeEdIndex === index }"
                    @click="handleCategoryClick($event)">
                    <span>{{ item.category_name }}</span>
                    ( <i>{{ item.note_count }}</i> )
                </div>
            </template>
            <div class="category-list-container">
                <transition-group name="item-transition">
                    <ArticleItem v-for="(item, index) in cateInfo.cateItemList" :key="item.note_id" style="width: 100%"
                        :content="item.summary" :datetime="item.create_time" :title="item.note_name" :tags="item.tags"
                        :category="item.note_category" :file-id="item.file_id" :toc="item.toc" />
                </transition-group>

            </div>
        </div>
    </div>

    <Meteor :number="30" />
</template>

<script lang="ts" name="CategoryView" setup>
    import Meteor from '@/components/Meteor/Meteor.vue'
    import ArticleItem from '@/components/ArticleItem/ArticleItem.vue'
    import { onMounted, onUnmounted, ref, watch } from 'vue'
    import { useArticleStore } from '@/stores/modules/article'
    import { storeToRefs } from 'pinia'
    import { useRoute, useRouter } from 'vue-router'
    import { reqGetArticles } from '@/api/articles'

    const cateInfo = ref({
        cateName: '',
        cateItemList: []
    })
    const activeEdIndex = ref<null | number>(null)
    const pageInfo = ref({
        currentPage: 1,
        pageSize: 5,
        totalPages: 0
    })

    const articleStore = useArticleStore()
    const { categoryCounts } = storeToRefs(articleStore)

    /* 初始数据 */
    function initData() {
        activeEdIndex.value = null
        pageInfo.value = {
            currentPage: 1,
            pageSize: 5,
            totalPages: 0
        }
        cateInfo.value = {
            cateName: '',
            cateItemList: []
        }
    }

    /* 点击category */
    function handleCategoryClick(event: Event) {

        const indexString = (event.currentTarget as HTMLDivElement).dataset.index
        if (indexString) {
            const index = parseInt(indexString)
            activeEdIndex.value = index;
            const categoryName = categoryCounts.value[index]['category_name']
            if (categoryName == route.query.categoryname) return
            initData()
            router.push({
                name: 'category',
                query: {
                    categoryname: categoryName
                }
            })
        }
    }

    /* 获取categoryList的信息 */
    async function getCategroyList() {
        try {
            const { data, code } = await reqGetArticles({
                categoryName: cateInfo.value.cateName,
                page: pageInfo.value.currentPage,
                pageSize: pageInfo.value.pageSize
            })

            if (code == 200) {
                cateInfo.value.cateItemList = [...cateInfo.value.cateItemList, ...data.data]
                const index = categoryCounts.value.findIndex((item, index) => item.category_name == cateInfo.value.cateName)
                activeEdIndex.value = index;
                pageInfo.value.totalPages = data.totalPages;
            }
        } catch (error) { }
    }





    /* 监听query参数 */
    const route = useRoute()
    const router = useRouter()

    watch(
        () => route.query.categoryname,
        (newName, oldName) => {
            if (newName && newName !== oldName) {
                initData()
                if (newName !== '' && typeof newName === 'string') {
                    cateInfo.value.cateName = newName
                    getCategroyList()
                }
            }
        }
    )


    /* 触底加载更多 */

    function onReachBottomHanlder() {
        if (cateInfo.value.cateName !== '' && pageInfo.value.currentPage < pageInfo.value.totalPages) {
            pageInfo.value.currentPage++
            getCategroyList()
        }
    }


    function onReachButton() {
        // 获取整个页面的高度
        const scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        )
        if (window.pageYOffset + document.body.clientHeight + 40 >= scrollHeight) {
            console.log('触底了');

            onReachBottomHanlder()
        }
    }

    onMounted(() => {
        /* 确保获取到了categoryList的数据 */
        if (articleStore.categoryCounts.length === 0) {
            articleStore.getAricleTagAndCategoryInfo()
        }

        if (route.query.categoryname && typeof route.query.categoryname === 'string') {
            cateInfo.value.cateName = route.query.categoryname
            getCategroyList()
        }


        document.addEventListener("scroll", onReachButton)
    })


    onUnmounted(() => {
        document.removeEventListener("scroll", onReachButton)
    })
</script>

<style scoped lang="scss">
    .category-page {
        @media screen and (max-width: 768px) {
            width: 100vw;
            height: 100vh;
            position: absolute;
            margin-top: 0;
            top: $header-height;
            background: linear-gradient(to bottom, #000, #001f3f);
            /* 深色背景，模拟夜空 */
        }
    }

    .category-container {
        padding: 10px;
        max-width: 40vw;
        margin: 0 auto;
        min-height: 100%;
        box-shadow: 2px 3px 2px 2px rgba(0, 0, 0, 0.5) inset;
        border-radius: 1rem;

        .category-item {
            display: inline-block;
            font-size: 1rem;
            text-align: center;
            line-height: 2rem;
            height: 2rem;
            vertical-align: middle;
            color: #010101;
            border-radius: 0.5rem;
            margin: 5px 5px;
            padding: 2px 5px;
            cursor: pointer;

            &:nth-child(even) {
                background-image: linear-gradient(0deg, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%);
            }

            &:nth-child(odd) {
                background-image: linear-gradient(0deg, #5ee7df 0%, #b490ca 100%);
            }

            &:nth-child(2n + 1) {
                background-image: linear-gradient(0deg, #96fbc4 0%, #f9f586 100%);
            }

            &:nth-child(3n + 2) {
                background-image: linear-gradient(0deg, #c1dfc4 0%, #deecdd 100%);
            }

            &:nth-child(10n + 1) {
                background-image: linear-gradient(0deg, #ebbba7 0%, #cfc7f8 100%);
            }

            &:hover {
                background-image: linear-gradient(0deg, #88d3ce 0%, #6e45e2 100%);
            }
        }

        .active-tag {
            background: linear-gradient(0deg, #1e3c72 0%, #1e3c72 1%, #2a5298 100%) !important;
            color: #010101;
        }


        .tags-container {
            display: block;
            max-width: 40vw;
            margin: 0 auto;
            height: 100%;
            // background: linear-gradient(to bottom, #000, #001f3f); /* 深色背景，模拟夜空 */

            background-color: hsla(0, 74%, 3%, 1);
            background-image: radial-gradient(at 40% 20%, hsla(27, 78%, 15%, 1) 0px, transparent 50%),
                radial-gradient(at 80% 0%, hsla(189, 80%, 27%, 1) 0px, transparent 50%),
                radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%),
                radial-gradient(at 80% 50%, hsla(340, 11%, 6%, 1) 0px, transparent 50%),
                radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%),
                radial-gradient(at 80% 100%, hsla(240, 67%, 44%, 1) 0px, transparent 50%),
                radial-gradient(at 0% 0%, hsla(343, 39%, 11%, 1) 0px, transparent 50%);

            box-shadow: 2px 1px 2px rgba(0, 0, 0, 0.1);
            border-radius: 1rem;

            @media screen and (max-width: 768px) {
                & {
                    max-width: 100%;
                    min-height: 100vh;
                    background-color: #343a40;
                }
            }

            .tag-cloud {
                padding: 1.5rem 5px;
                margin: 0 auto;
                color: #fff;
                z-index: 1;

                .tag {
                    font-size: 0.875rem;
                    display: inline-block;
                    padding: 0.5rem;
                    margin: 0.5rem;
                    background-color: #f8f9fa;
                    color: #343a40;
                    border-radius: 0.3rem;
                    transition: background-color 0.3s ease;
                    color: #010101;
                    cursor: pointer;

                    &:nth-child(even) {
                        background-image: linear-gradient(0deg, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%);
                    }

                    &:nth-child(odd) {
                        background-image: linear-gradient(0deg, #5ee7df 0%, #b490ca 100%);
                    }

                    &:nth-child(2n + 1) {
                        background-image: linear-gradient(0deg, #96fbc4 0%, #f9f586 100%);
                    }

                    &:nth-child(3n + 2) {
                        background-image: linear-gradient(0deg, #c1dfc4 0%, #deecdd 100%);
                    }

                    &:nth-child(10n + 1) {
                        background-image: linear-gradient(0deg, #ebbba7 0%, #cfc7f8 100%);
                    }

                    &:hover {
                        background-image: linear-gradient(0deg, #88d3ce 0%, #6e45e2 100%);
                    }
                }

                .tag-number {
                    font-size: 0.8rem;
                    margin-left: 0.25rem;
                    color: #fff;
                    background-color: #d46087;
                    border-radius: 50%;
                    background-image: linear-gradient(0deg, #a18cd1 0%, #fbc2eb 100%);
                    padding: 0.25rem 0.5rem;
                    text-align: center;
                    vertical-align: middle;
                    line-height: 1;
                    transition: background-color 0.3s ease;

                    &:hover {
                        background-image: linear-gradient(0deg, #7028e4 0%, #e5b2ca 100%);
                    }
                }

                .active-tag {
                    background-image: linear-gradient(0deg, #1e3c72 0%, #1e3c72 1%, #2a5298 100%) !important;
                    color: #000;
                }
            }

            .tag-list-container {
                z-index: 2;
            }
        }


        .item-transition-enter-from,
        .item-transition-leave-to {
            opacity: 0;
            transform: translateY(20px);
        }

        .item-transition-enter-to,
        .item-transition-leave-from {
            opacity: 1;
            transform: translateY(0);
        }

        .item-transition-enter-active,
        .item-transition-leave-active {
            transition: all 0.5s ease-in-out;
        }


        @media screen and (max-width: 768px) {
            & {
                max-width: 100vw;
                background-color: #343a40;
                box-shadow: none;
                padding: 0 !important;
            }

            .category-container {}
        }
    }


</style>
