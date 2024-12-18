<template>
    <!-- 图表容器 -->
    <div ref="articleNeworkContainer" class="ArticleNework-container"></div>
</template>

<script lang="ts">

    import { defineComponent, onMounted, ref, onBeforeUnmount, watch } from 'vue';
    import * as echarts from 'echarts';
    import { useRouter } from 'vue-router';

    interface NoteInfo {
        "name": string,
        "fileID": string,
        "reading": number
    }

    export default defineComponent({
        name: 'ArticleNework',
        props: {
            nodes: {
                type: Array as () => NoteInfo[],  // 节点数据，包含文章标题和文件ID
                required: true,
                default: () => [
                    { name: '文章 A', fileID: "abc", id: '1' },
                ],
            },
        },
        setup(props) {
            const articleNeworkContainer = ref<HTMLDivElement | null>(null);  // 用于绑定图表容器
            const router = useRouter();  // 获取 Vue Router 实例
            let chart: echarts.ECharts | null = null;

            // 获取 ECharts 配置项
            const getOption = () => {
                const uniqueNodes = Array.from(new Set(props.nodes.map(node => node.fileID)))
                              .map(fileID => props.nodes.find(node => node.fileID === fileID)) as NoteInfo[];
                return {
                    tooltip: {
                        formatter: '{b}', // 提示框内容，显示节点名称
                    },
                    animation: true,
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',  // 力引导布局
                            roam: true,  // 允许拖动
                            symbolSize: 15,  // 节点的大小，修改为 30
                            label: {
                                show: true,
                                position: 'bottom',  // 将标签显示在节点下方
                                formatter: '{b}',  // 显示节点名称
                                color: "#fff",
                            },
                            edgeSymbol: ['none', 'arrow'],  // 边上箭头
                            edgeSymbolSize: [4, 10],  // 箭头大小
                            edgeLabel: {
                                show: true,
                                formatter: '{c}', // 边的描述
                            },
                            data: uniqueNodes.map(node => ({
                                name: node.name,
                                value: node.reading,
                                id: node.fileID,  // 节点的文件ID
                            })),  // 使用父组件传递的节点数据
                            links: [],  // 文章之间没有关系，所以这里不需要边数据
                            force: {
                                repulsion: 150,  // 节点之间的斥力
                                edgeLength: [50, 200],  // 连线的最短和最长距离
                            },
                        },
                    ],
                };
            };

            // 初始化 ECharts 实例
            onMounted(() => {
                if (articleNeworkContainer.value) {
                    chart = echarts.init(articleNeworkContainer.value);
                    chart.setOption(getOption());  // 设置配置项

                    // 监听节点点击事件
                    chart.on('click', (params) => {
                        if (params.data && params.data.fileID) {
                            // 根据节点的 id 跳转到相应的路由
                            router.push({ path: '/article', query: { fileId: params.data.fileID, name: params.data.name } });
                        }
                    });

                    // 悬浮时增加节点大小和改变颜色
                    chart.on('mouseover', (params) => {
                        chart?.setOption({
                            series: [
                                {
                                    data: props.nodes.map(node => ({
                                        ...node,
                                        symbolSize: params.data.name === node.name ? 20 : 10,  // 鼠标悬浮时增大节点
                                        itemStyle: {
                                            color: params.data.name === node.name ? '#8A5CEC' : '#5bc0de',  // 鼠标悬浮时改变节点颜色
                                        },
                                    })),
                                },
                            ],
                        });
                    });

                    // 鼠标移开时恢复节点状态
                    chart.on('mouseout', () => {
                        chart?.setOption({
                            series: [
                                {
                                    data: props.nodes.map(node => ({
                                        ...node,
                                        symbolSize: 15,  // 恢复默认大小
                                        itemStyle: {
                                            color: '#FFA500',  // 恢复默认颜色
                                        },
                                    })),
                                },
                            ],
                        });
                    });
                }
            });

            // 监听 props.nodes 变化
            watch(() => props.nodes, (newNodes) => {
                if (chart) {
                    chart.setOption(getOption());  // 更新图表配置
                }
            });

            // 销毁图表实例，防止内存泄漏
            onBeforeUnmount(() => {
                chart?.dispose();
            });

            return {
                articleNeworkContainer,
            };
        },
    });
</script>

<style scoped lang="scss">
    .ArticleNework-container {
        border-radius: 8px;
        top: 0;
        left: 0;
        height: 800px; // 设置固定高度
        width: 100%; // 设置固定宽度
        position: absolute;

        :deep() {

            canvas {
                width: 100%;
                height: 100%; // 让画布的高度跟容器一致
            }

        }
    }

    @media screen and (max-width:768px) {
        .ArticleNework-container {
            height: 180px; // 设置固定高度
        }
    }
</style>