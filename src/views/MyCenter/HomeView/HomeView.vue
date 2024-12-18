<template>
  <div class='HomeView-container'>


    <div class="center-container">
      <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="textarea">
      </el-input>
      <!-- 分类的饼图 -->
      <PieChart class="chart" :legendData="pieData.legendData" :countData="pieData.countData" :readingData="pieData.readingData">
      </PieChart>
      <!-- 标签的柱状图 -->
      <BarChart class="chart" :xAxisData="barData.tag_name" :data="barData.note_count"></BarChart>
    </div>
    <div class="bottom-container">
      <!-- 文章前十大阅读量 -->
      <TopItemChart class="chart" :articleTitles="articleReadViewData.name" :articleViews="articleReadViewData.reading">
      </TopItemChart>
    </div>

  </div>
</template>

<script lang="ts" name='HomeView' setup>
  import BarChart from "@/components/EchartsItem/BarChart.vue";
  import PieChart from "@/components/EchartsItem/PieChart.vue";
  import TopItemChart from "@/components/EchartsItem/TopItemChart.vue";
  import { useArticleStore } from "@/stores/modules/article";
  import { extractMultipleFields } from "@/utils/extract";
  import { storeToRefs } from "pinia";
  import { ref } from "vue"

  const textarea = ref(`本博客设置了三种身份，分别为普通用户，VIP用户和管理员用户。不同的用户拥有不同的权限，点击切换按钮可以进行切换.
  切换后会跳转到首页，再次进入则身份切换完成。当前普通访客，可见普通用户身份，该用户只能看到首页和文章管理页面，但是对于文章管理页面没有操作权限。
  `)

  const articleStore = useArticleStore();
  const { categoryCounts, tagCounts, notesCounts } = storeToRefs(articleStore)



  const barData = computed(() => {

    return extractMultipleFields(tagCounts.value, ["tag_name", "note_count"])
  })

  interface PieData {
    value: number,
    name: string
  }
  const pieData = computed(() => {
    const readingData: PieData[] = []
    const legendData: string[] = []
    const countData: PieData[] = []
    categoryCounts.value.forEach((item, index) => {
      legendData.push(item.category_name as string);
      readingData.push({ name: item.category_name, value: item.reading } as PieData)
      countData.push({ name: item.category_name, value: item.note_count } as PieData)
    })
    return {
      readingData,
      legendData,
      countData
    }
  })

  const articleReadViewData = computed(() => {
    return extractMultipleFields(notesCounts.value, ["name", "reading"])
  })




  onMounted(() => {
    if (articleStore.tagCounts.length === 0) {
      articleStore.getAricleTagAndCategoryInfo()
    }
  })
</script>

<style scoped lang="scss">


  .HomeView-container {
    .center-container {
      display: flex;
      justify-content: space-between;

    }



    @media screen and (max-width: 768px) {
      .center-container {
        flex-direction: column;
      }
    }


  }
</style>