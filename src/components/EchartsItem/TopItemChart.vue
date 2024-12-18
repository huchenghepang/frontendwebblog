<template>
    <div class="TopItemChart-container" ref="topItemChartContainer"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts/core';
    import { GridComponent, type GridComponentOption } from 'echarts/components';
    import { BarChart, type BarSeriesOption } from 'echarts/charts';
    import { CanvasRenderer } from 'echarts/renderers';
    import { ref, watch, onMounted, onUnmounted, nextTick, defineProps } from "vue";

    // 注册 ECharts 组件
    echarts.use([GridComponent, BarChart, CanvasRenderer]);

    type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

    // 接收父组件传递的 props 数据
    const props = defineProps({
        articleTitles: {
            type: Array as () => string[],
            default: () => [] // 默认值为空数组
        },
        articleViews: {
            type: Array as () => number[],
            default: () => [] // 默认值为空数组
        }
    });

    const topItemChartContainer = ref<HTMLDivElement | null>(null); // 图表容器引用
    let myChart: echarts.ECharts | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null; // 定时器 ID

    // 用来存储文章的模拟阅读量（从 1 开始）
    const simulatedViews = ref<number[]>(props.articleViews.map(() => 1)); // 初始化阅读量为 1

    // 默认 ECharts 配置
    const option: Ref<EChartsOption> = ref({
        title: {
            text: '文章阅读量前十',
            textStyle: {
                color: '#333',
                fontSize: 20,
                rich: {
                    ellipsis: {
                        width: 200, // 设定最大宽度
                        overflow: 'truncate', // 设置文本溢出时的显示方式
                        align: 'center', // 可选，调整省略号位置
                        fontSize: 20,  // 字体大小
                        color: '#333'  // 字体颜色
                    }
                }
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (params: any) => {
                const data = params[0];
                return `${data.name}<br/>阅读量: ${data.value}`;
            }
        },
        xAxis: {
            type: 'value',
            name: '阅读量',
            axisLabel: {
                formatter: '{value}'
            }
        },
        yAxis: {
            type: 'category',
            name: '文章标题',
            nameGap: 20,  // 设置坐标轴名称与坐标轴标签之间的距离
            data: props.articleTitles,
            inverse: true, // 倒序排列
            axisLabel: {
                interval: 0, // 显示所有标签
                fontSize: 12,
                // 可以加入 CSS 样式来防止文字溢出
                formatter: (value: string) => value
            },
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 10 // 只显示前 10 个文章
        },
        series: [
            {
                name: '阅读量',
                type: 'bar',
                data: simulatedViews.value,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}',
                    valueAnimation: true
                },
                itemStyle: {
                    color: '#5470C6' // 柱状图颜色
                }
            }
        ],
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    });

    // 更新图表配置
    function updateChart() {
        if (myChart) {
            myChart.setOption(option.value);
        }
    }

    // 排序数据并更新
    function sortData() {
        // 将数据与标题关联，并按照阅读量降序排序
        const sortedData = props.articleTitles
            .map((title, index) => ({
                title,
                views: simulatedViews.value[index]
            }))
            .sort((a, b) => b.views - a.views); // 降序排序

        // 更新排序后的数据
        const sortedTitles = sortedData.map(item => item.title);
        const sortedViews = sortedData.map(item => item.views);

        // 使用 @ts-ignore 强制更新数据
        // 这里我们直接用新的排序后的数据更新 yAxis 和 series 数据
        // @ts-ignore
        option.value.yAxis.data = sortedTitles;
        // @ts-ignore
        option.value.series[0].data = sortedViews;
        nextTick(() => {
            updateChart()
        })


    }

    // 监听 props 数据变化并进行排序
    watch([() => props.articleTitles, () => props.articleViews], (newData) => {
        // @ts-ignore
        option.value.yAxis.data = newData[0];
        // @ts-ignore
        simulatedViews.value = newData[1].map(item => {
            return 1
        });
        sortData(); // 每次数据变化时进行排序
    }, {
        deep: true
    });

    // 模拟动态数据更新
    function updateData() {
        let allAtMax = true;  // 判断是否所有文章已达到最大阅读量

        for (let i = 0; i < props.articleViews.length; i++) {
            if (simulatedViews.value[i] < props.articleViews[i]) {  // 比较当前模拟阅读量和真实最大阅读量
                allAtMax = false;  // 还有文章未达到最大阅读量
                const increment = Math.floor(Math.random() * 100);  // 随机增加 0 到 100
                simulatedViews.value[i] += increment;  // 增加当前文章的模拟阅读量

                // 确保模拟阅读量不超过真实最大值
                if (simulatedViews.value[i] > props.articleViews[i]) {
                    simulatedViews.value[i] = props.articleViews[i];
                }
            }
        }

        // 更新图表并排序
        sortData();

        // 如果所有文章已达到最大阅读量，停止定时器
        if (allAtMax) {
            stopUpdate();  // 停止定时器
        }
    }

    // 启动定时器
    function startUpdate() {
        if (!intervalId) {
            intervalId = setInterval(updateData, 3000);  // 每 1 秒更新一次数据
        }
    }

    // 停止定时器
    function stopUpdate() {
        if (intervalId) {
            clearInterval(intervalId);  // 清除定时器
            intervalId = null;
        }
    }

    // 图表初始化
    onMounted(() => {
        if (topItemChartContainer.value) {
            myChart = echarts.init(topItemChartContainer.value);

            nextTick(() => {
                updateChart(); // 初次渲染时加载图表
                startUpdate(); // 启动定时更新
            });
        }
    });

    // 组件卸载时清理图表实例
    onUnmounted(() => {
        if (myChart) {
            myChart.dispose();
            myChart = null;
        }
        stopUpdate();  // 组件卸载时停止更新
    });
</script>

<style scoped lang="scss">
    .TopItemChart-container {
        width: 100%;
        height: 300px;
        /* 图表高度 */
        margin: 20px auto;
        /* 居中对齐 */
        
        @media screen and (max-width: 768px) {
            width: 100%;
            transform: scale(0.9);  // 缩放图表，调整比例为80%
            transform-origin: center center;  // 设置缩放原点为左上角
        }
    }
</style>
