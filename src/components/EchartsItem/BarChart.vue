<template>
    <div class='BarChart-container' ref="barChartContainer"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts/core';
    import { GridComponent, type GridComponentOption } from 'echarts/components';
    import { BarChart, type BarSeriesOption } from 'echarts/charts';
    import { CanvasRenderer } from 'echarts/renderers';
    import { ref, watch, onMounted, onUnmounted, nextTick, defineProps } from "vue";

    echarts.use([GridComponent, BarChart, CanvasRenderer]);

    type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

    const props = defineProps({
        xAxisData: {
            type: Array as () => string[],
            default: () => []
        },
        data: {
            type: Array as () => number[],
            default: () => []
        }
    });

    const barChartContainer = ref<HTMLDivElement | null>(null);  // 图表容器引用
    let myChart: echarts.ECharts | null = null;

    // 默认配置
    const option: Ref<EChartsOption> = ref({
        title: {
            text: '标签图表',
            textStyle: {
                color: '#ccc',
                fontSize: 26
            },
            left: '40%',  // 将标题固定在左边
            top: '0',    // 将标题垂直居中
            position: 'absolute'  // 确保标题位置固定
        },
        xAxis: {
            type: 'category',
            data: props.xAxisData,
            axisLabel: {
                interval: 0,  // 显示所有的标签
                rotate: 45,   // 旋转标签，防止标签重叠
                fontSize: 12   // 标签字体大小
            }
        },
        yAxis: {
            type: 'value',
            axisTick: {
                show: true, // 显示刻度线
                interval: 'auto' // 自动设置刻度线的显示间隔
            },
            splitNumber: 1, // 设置刻度的数量为 10
            min: 1, // 设置 y 轴的最小值为 0
        },
        series: [
            {
                data: props.data,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                }
            }
        ],
        // dataZoom 控件，允许用户滑动查看 x 轴的数据
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,    // 初始显示区域的起始位置
                end: 100,    // 初始显示区域的结束位置
                handleSize: '8%',
                height: 20,
                bottom: 10
            }
        ]
    });

    // 更新图表
    function updateChart() {
        if (myChart) {
            myChart.setOption(option.value);
        }
    }

    // 响应式数据
    const data = ref<number[]>(props.data);
    const xAxisData = ref<string[]>(props.xAxisData);

    // 监听 props 数据的变化
    watch([() => props.data, () => props.xAxisData], (newData) => {

        // 这个必须做 要不刷新会丢失不会自动进行刻度的判断
        // @ts-ignore
        option.value.xAxis.data = newData[1];  // 更新响应式 xAxisData
        // @ts-ignore
        option.value.series[0].data = newData[0];  // 更新响应式 xAxisData

        nextTick(() => {
            updateChart();  // 等待 DOM 更新后更新图表
        });
    }, { deep: true });



    // 初始化图表
    onMounted(() => {

        if (barChartContainer.value) {
            myChart = echarts.init(barChartContainer.value);
            nextTick(() => {
                updateChart(); // 初次渲染时更新图表
            });

            // 确保图表初始化后绑定点击事件
            myChart.on('click', (params) => {
                // 确保点击的是柱状图的系列部分
                if (params.componentType === 'series') {
                    const clickedIndex = params.dataIndex;  // 获取点击的柱子索引
                    const totalData = xAxisData.value.length; // 数据的总数
                    const visibleCount = Math.ceil(totalData * (option.value.dataZoom[0].end / 100));  // 当前视图显示的柱子数量

                    let start = option.value.dataZoom[0].start;
                    let end = option.value.dataZoom[0].end;

                    // 判断点击位置是前半部分还是后半部分
                    if (clickedIndex < totalData / 2) {
                        // 点击前半部分：向前滚动
                        start = Math.max(start - 10, 0);  // 向前滚动 10%，但不超出范围
                        end = Math.max(end - 10, visibleCount);  // 确保 end 位置不超过可视范围
                    } else {
                        // 点击后半部分：向后滚动
                        start = Math.min(start + 10, 100 - visibleCount);  // 向后滚动 10%，但不超出 100%
                        end = Math.min(end + 10, 100);  // 确保 end 位置不超过 100%
                    }

                    // 更新 dataZoom 范围
                    myChart.setOption({
                        dataZoom: [
                            {
                                start: start,   // 更新起始位置
                                end: end        // 更新结束位置
                            }
                        ]
                    });
                }
            });
        }
    });

    // 清理图表实例
    onUnmounted(() => {
        if (myChart) {
            myChart.dispose();
        }
    });

</script>

<style scoped lang="scss">
    .BarChart-container {
        width: 100%;
        height: 400px !important;

        @media screen and (max-width: 768px) {
            width: 100% !important;
            transform: scale(0.9);  // 缩放图表，调整比例为80%
            transform-origin: center center;  // 设置缩放原点为左上角
        }
    }
</style>