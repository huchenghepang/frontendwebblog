<template>
    <div class="timeLines-container">
        <div class="header-timeline">
            <h2 class="title">
                时间
            </h2>
            <div>
                <h3 class="subtile">
                    现在
                </h3>
            </div>
            <div>
                <h3 class="subtile">
                    通往过去的路
                </h3>
            </div>
        </div>
      
        <div>
            <ScrollTimeLine :items-list="articlesList" />
        </div>
        <div class="header-timeline">
            <h2 class="title">
                时间
            </h2>
            <div>
                <h3 class="subtile">
                    过去
                </h3>
            </div>
            <div>
                <h3 class="subtile">
                    通往未来的路
                </h3>
            </div>
        </div>
    </div>
</template>

<script lang="ts" name="TimeLine" setup>
import { reqGetArticles } from '@/api/articles'
import ScrollTimeLine from '@/components/ScrollTimeLine/ScrollTimeLine.vue'
import throttle from '@/utils/throttle'
import moment from 'moment'
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'

const pageInfo = ref({
    datetimeStart: '2000-12-08 00:00:00',
    datetimeEnd: moment().format('YYYY-MM-DD HH:mm:ss'),
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
})

const articlesList = ref<Array<[{}]>>([])

async function getArticleList() {
    try {
        const { data, code } = await reqGetArticles({
            datetimeStart: pageInfo.value.datetimeStart,
            datetimeEnd: pageInfo.value.datetimeEnd,
            page: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        })

        if (code == 200) {
            articlesList.value = [...articlesList.value, ...data.notes]
            pageInfo.value.totalPages = data.total_pages
        }
    } catch (error) {}
}

const onReachBottomHandler = throttle(() => {
    if (pageInfo.value.currentPage < pageInfo.value.totalPages) {
        pageInfo.value.currentPage++
        getArticleList()
    }
}, 500)

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
    if (window.innerHeight + window.scrollY + 40 >= scrollHeight) {
        onReachBottomHandler()
        // 调整滚动位置，确保滚动条位置正确
    }
}

onMounted(() => {
    getArticleList()
    document.addEventListener('scroll', onReachBottom)
})

onUnmounted(() => {
    document.removeEventListener('scroll', onReachBottom)
})
</script>

<style scoped lang="scss">
.timeLines-container {
  margin-left: calc(100vw - 100%); // 可以处理滚动条消失带来的抖动
  min-height: 120vh;
  width: 100vw;
  margin: 0 auto;
  margin-bottom: 0;
  position: relative;
  transition: 0.3s ease 0s;
  background: url('/public/source/webp/wallhaven-q2re17.webp');
  background-attachment: fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  &::before {
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100%;
      background-color: rgba(99, 99, 99, 0.3);
      content: '';
  }

  .header-timeline {
      background-blend-mode: difference;
      text-align: center;
      position: sticky;
      top: $header-height;
      .title {
          color: #fff !important;
          font-size: 46px;
          font-weight: bold;
          background-blend-mode: difference;
          display: inline-block;
          background-color: rgba(99, 99, 99, 0.6);
          box-shadow: 2px 1px 2px 2px rgba(0, 0, 99, 0.2) inset;
      }

      .subtile {
          margin: 4px;
          color: #fff;
          font-size: 24px;
          display: inline-block;
          background-color: rgba(0, 0, 0, 0.2);
          background-blend-mode: difference;
          box-shadow: 2px 1px 2px 2px rgba(0, 0, 99, 0.3) inset;
      }
  }

  @media screen and (max-width: 768px) {
      .timeLines-container {
          width: 100vw !important;
          min-height: 100% !important;
          background-size: cover !important;
      }

      &::before {

      }
  }
}
</style>
