<template>
    <div class="search-bar">
        <label for="">
            <iconfont class="icon-sousuo" name="icon-sousuo"></iconfont>
        </label>
        <input
            type="text"
            v-model="searchResults.keyword"
            @input="onInput"
            placeholder="输入关键词"
            class="search-input"
        />
        <ul v-show="searchResults.keywordItemList.length > 0" class="search-results">
            <transition-group name="list-transition">
                <li
                    v-for="(result, index) in searchResults.keywordItemList"
                    @click="getArticle(result.file_id, result.note_name)"
                    :key="index"
                >
                    {{ result.note_name }}
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { reqGetArticles } from '@/api/articles'
import throttle from '@/utils/throttle'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface SearchResults {
    keyword: string
    keywordItemList: any[]
}

// 定义状态和类型
const searchResults = ref<SearchResults>({
    keyword: '',
    keywordItemList: []
})
const isFetching = ref<boolean>(false)
let debounceTimer = null

// 输入事件处理，添加防抖功能
const onInput = () => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(async () => {
        const keyword = searchResults.value.keyword.trim()
        if (keyword !== '') {
            isFetching.value = true
            getArtcileByKeyword(keyword)
        } else {
        }
    }, 1000)
}

const pageInfo = ref({
    currentPage: 1,
    pageSize: 5,
    totalPages: 0
})

const router = useRouter()
function getArticle(fileId: string, title: string) {
    router.push({ name: 'article', query: { fileId: fileId, title } })
    searchResults.value = {
        keyword: '',
        keywordItemList: []
    }
}

watch(
    () => searchResults.value.keyword,
    () => {
        searchResults.value.keywordItemList = []
    }
)

const getArtcileByKeyword = throttle(async (keyword: string) => {
    try {
        const { data, code } = await reqGetArticles({
            keyword: keyword,
            page: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        })
        if (code == 200) {
            const results = data.notes
            if (results.length > 0 && results) {
                searchResults.value.keywordItemList = results
            }
        }
    } catch (error) {
        // ;(proxy! as any).$message({ text: '无法获取数据', type: 'error' })
    }
}, 500)
</script>

<style scoped lang="scss">
.search-bar {
    max-width: 300px;
    margin: 20px auto;
    position: relative;
    z-index: 99999;
}
.search-input {
    width: 90px;
    height: $header-height - 10px;
    background-color: transparent !important;
    border: none;
    border-bottom: 1px solid #333333;
    line-height: $header-height;
    outline: none;
    // 基线对齐
    vertical-align: baseline;
    font-style: italic;
    transition:
        width 0.3s ease,
        border-color 0.3s ease;
    /* 过渡效果 */

    @include hd_nav_ft_color();
    
    &:focus {
        width: 200px;
        border-color: #4682b4;
        @include hd_nav_ft_color();
    }
    @include border_color();
}
.search-results {
    @include hd_nav_bc_color();
    position: fixed;
    right: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid #76b9ca;
    border-top: none;
    border-radius: 0 0 6px 6px;
    overflow-y: auto;
    z-index: 9999;
    overflow: hidden;
    max-width: 300px;
}
.search-results li {
    margin: 0;
    font-size: 1rem;
    padding: 2px 8px;
    padding-right: 50px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    line-height: 3rem;
    text-align: start;
    transition: all 0.3s;
    z-index: 9999;
    @include hd_nav_ft_color();
    transition: all 0.1s 0.2s linear;
}
.search-results li:hover {
    @include seach_active_bc_color();
    transform: translateY(-4px);
}

/* 搜索图标 */
.icon-sousuo {
    font-size: 1.2rem;
}

.list-transition-enter-from,
.list-transition-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-transition-enter-to,
.list-transition-leave-from {
    // opacity: 1;
    transform: translateY(0);
}
.list-transition-enter-active,
.list-transition-leave-active {
    transition: all 0.5s ease;
}

@media screen and (max-width:768px) {
    .search-bar{
        margin: 0;
        display: flex;
        height: 2rem;
        .search-input{
            padding-top: 4px;
            display: flex;
            line-height:100% !important;
            font-size: 1.25rem;
            vertical-align:text-bottom;

        }

        .search-results{
            top: $header-height;
            li{
                text-align: start;
            }
        }
    }
}
</style>
