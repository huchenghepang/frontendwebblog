<template>
    <div class='PieChart-container' ref="pieChartContainer"></div>
</template>

<script lang="ts" name='PieChart' setup>
    import { ref } from "vue"
    import * as echarts from 'echarts/core';
    import {
        TooltipComponent,
        type TooltipComponentOption,
        LegendComponent,
        type LegendComponentOption
    } from 'echarts/components';
    import { PieChart, type PieSeriesOption } from 'echarts/charts';
    import { LabelLayout } from 'echarts/features';
    import { CanvasRenderer } from 'echarts/renderers';

    echarts.use([
        TooltipComponent,
        LegendComponent,
        PieChart,
        CanvasRenderer,
        LabelLayout
    ]);

    interface PieData {
        value: number,
        name: string
    }
    type EChartsOption = echarts.ComposeOption<
        TooltipComponentOption | LegendComponentOption | PieSeriesOption
    >;

    const props = defineProps({
        legendData: {
            type: Array as () => PieData[],
            default: []
        },
        readingData: {
            type: Array as () => PieData[],
            default: []
        },
        countData: {
            type: Array as () => number[],
            default: []
        }
    })


    /*

        {a}：系列名称。
        {b}：数据项名称。
        {c}：数据项值。
        {d}：百分比。

     */


    const pieChartContainer = ref<HTMLDivElement | null>(null);  // 用于绑定图表容器
    let myChart: echarts.ECharts | null = null;
    const option: Ref<EChartsOption> = ref({
        // 配置图表的标题
        title: {
            text: '分类图表',
            textStyle: {
                color: '#ccc',
                fontSize: 26
            },
            left: '0',  // 将标题固定在左边
            top: '40%',    // 将标题垂直居中
            position: 'absolute'  // 确保标题位置固定
        },
        // 配置提示框
        tooltip: {
            // 触发方式为数据项触发
            trigger: 'item',
            // 提示框格式器，用于定义提示框显示的内容和格式
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        // 配置图例
        legend: {
            // 图例数据，用于标识不同系列的数据
            data: props.legendData
        },

        // 配置图表的系列，这里是一个饼图
        series: [
            {
                // 系列的名称
                name: '阅读量',
                // 系列的类型为饼图
                type: 'pie',
                // 选中模式为单选
                selectedMode: 'single',
                // 饼图的半径，内半径为 0，外半径为 30%
                radius: [0, '30%'],
                // 标签的位置为内部
                label: {
                    position: 'inner',
                    fontSize: 14,
                    formatter: '{b}: {c}' // 显示 name 和 value 的数量 
                },
                // 标签线不显示
                labelLine: {
                    show: false
                },
                // 系列的数据
                data: props.readingData
            },
            {
                // 系列的名称
                name: '文章数量',
                // 系列的类型为饼图
                type: 'pie',
                // 饼图的半径，内半径为 45%，外半径为 60%
                radius: ['50%', '75%'],
                // 标签线的长度为 30
                labelLine: {
                    length: 20
                },
                // 标签的格式化器
                label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#F6F8FC',
                    borderColor: '#8C8D8E',
                    borderWidth: 1,
                    borderRadius: 4,
                    // 富文本样式
                    rich: {
                        a: {
                            color: '#6E7079',
                            lineHeight: 22,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#8C8D8E',
                            width: '100%',
                            borderWidth: 1,
                            height: 0
                        },
                        b: {
                            color: '#4C5058',
                            fontSize: 14,
                            fontWeight: 'bold',
                            lineHeight: 33
                        },
                        per: {
                            color: '#fff',
                            backgroundColor: '#4C5058',
                            padding: [3, 4],
                            borderRadius: 4
                        }
                    }
                },
                // 系列的数据
                data: props.countData
            },

        ]

    });

    function updateChart() {
        if (myChart) {
            option.value && myChart.setOption(option.value);
        }

    }


    watch([() => props.countData, () => props.readingData, () => props.legendData], (newData) => {

        // @ts-ignore
        option.value.series[0].data = newData[1];  // 更新响应式 xAxisData
        // @ts-ignore
        option.value.series[1].data = newData[0];  // 更新响应式 xAxisData
        // @ts-ignore
        option.value.legend.data = newData[2];  // 更新响应式 xAxisData
        nextTick(() => {
            updateChart();  // 等待 DOM 更新后更新图表
        });
    })

    onMounted(() => {
        if (pieChartContainer.value) {
            myChart = echarts.init(pieChartContainer.value);
            option.value && myChart.setOption(option.value);
        }

    })

    onUnmounted(() => {
        if (myChart) {
            myChart.dispose();
        }

    })


</script>

<style scoped lang="scss">

    .PieChart-container {
        min-width: 50%;
        height: 400px !important;
        
        @media screen and (max-width: 768px) {
            width: 100%;
            transform: scale(0.9);  // 缩放图表，调整比例为80%
            transform-origin: center center;  // 设置缩放原点为左上角
        }
    }

</style>