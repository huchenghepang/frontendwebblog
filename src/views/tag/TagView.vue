<template>
    <div class="tags-container">
        <Meteor :number="20"></Meteor>
        <div class="tag-cloud" @click="clickTag">
            <template v-for="(tag, index) in tagCounts" :key="index">
                <span class="tag" :class="{ 'active-tag': activedIndex === index }" :data-index="index"
                    :data-tagname="tag.tag_name">{{ tag.tag_name }}<i class="tag-number">({{ tag.note_count
                        }})</i></span>
            </template>
            <!-- More tags -->
        </div>


        <!-- 处理每个标签对应的文章内容 -->
        <div class="tag-list-container">

            <transition-group name="item-transition">
                <ArticleItem v-slideIn style="width: 100%" v-for="(item, index) in tagInfo.tagItemList"
                    :key="item.note_id" :content="item.summary" :datetime="item.create_time" :title="item.note_name"
                    :tags="item.tags" :category="item.note_category" :file-id="item.file_id" :toc="item.toc" />
            </transition-group>
        </div>



    </div>
</template>

<script lang="ts" name="TagView" setup>
    import { reqGetArticles } from '@/api/articles'
    import ArticleItem from '@/components/ArticleItem/ArticleItem.vue'
    import Meteor from '@/components/Meteor/Meteor.vue'
    import { useArticleStore } from '@/stores/modules/article'
    import throttle from '@/utils/throttle'
    import { storeToRefs } from 'pinia'
    import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    const { proxy } = getCurrentInstance()!
    const article = useArticleStore()
    const { tagCounts } = storeToRefs(article)
    async function getTagsData() {
        /* 为空请求资源 */
        if (tagCounts.value.length === 0) {
            await article.getAricleTagAndCategoryInfo()
        }
        // 读取article中的tags数据
    }
    const activedIndex = ref<null | Number>(null)
    /* 处理根据标签 请求对应的列表 */
    const tagInfo = ref({
        tagName: '',
        tagItemList: []
    })

    const pageInfo = ref({
        currentPage: 1,
        pageSize: 5,
        totalPages: 0
    })

    function initData() {
        tagInfo.value = {
            tagName: '',
            tagItemList: []
        }
        activedIndex.value = null
        pageInfo.value = {
            currentPage: 1,
            pageSize: 5,
            totalPages: 0
        }
    }

    const getArtcileByTagName = throttle(async () => {
        try {
            const { data, code } = await reqGetArticles({
                tagName: tagInfo.value.tagName,
                page: pageInfo.value.currentPage,
                pageSize: pageInfo.value.pageSize
            })
            if (code == 200) {
                const list = [...tagInfo.value.tagItemList, ...data.data]
                tagInfo.value.tagItemList = list
                pageInfo.value.totalPages = data.totalPages
                const index = tagCounts.value.findIndex((item, index) => item.tag_name === tagInfo.value.tagName)
                activedIndex.value = index
            }
        } catch (error) {
            ; (proxy! as any).$message({ text: '无法获取数据', type: 'error' })
        }
    }, 500)

    const router = useRouter()
    function clickTag(event: Event) {
        console.log(event);

        const currentInstance = <HTMLElement>event.target
        const { index, tagname } = currentInstance.dataset
        activedIndex.value = Number(index)

        if (tagname && tagname !== route.query.tagname) {
            initData()
            router.push({
                name: 'tag',
                query: {
                    tagname: tagname
                }
            })
        }
    }

    function onReachBottomHandler() {
        if (tagInfo.value.tagName !== '' && pageInfo.value.currentPage < pageInfo.value.totalPages) {
            pageInfo.value.currentPage++
            getArtcileByTagName()
        }
    }

    // 触底加载更多
    function onReachBottom() {
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
            onReachBottomHandler()
        }
    }

    /* 监听路由 */
    const route = useRoute()
    watch(
        () => route.query.tagname,
        (newVal, oldVal) => {
            if (newVal && typeof newVal === 'string') {
                initData()
                tagInfo.value.tagName = newVal
                getArtcileByTagName()
            }
        }
    )

    onMounted(() => {
        /* 回到顶部 */
        window.scrollTo(0, 0)
        document.addEventListener('scroll', onReachBottom)
        getTagsData()
        /* 获取对应的路由tagname数据 请求 */
        if (route.query.tagname && typeof route.query.tagname === 'string') {
            tagInfo.value.tagName = route.query.tagname
            getArtcileByTagName()
        }
    })

    onUnmounted(() => {
        document.removeEventListener('scroll', onReachBottom)
    })
</script>

<style scoped lang="scss">
    :root {
        min-height: 100%;
    }

    .tags-container {
        display: block;
        max-width: 40vw;
        margin: 0 auto;
        min-height: 100%;
        
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
        transform: translateY(30px);
    }

    .item-transition-enter-to,
    .item-transition-leave-from {
        // opacity: 1;
        transform: translateY(0);
    }

    .item-transition-enter-active,
    .item-transition-leave-active {
        transition: all 0.5s ease;
    }
</style>
