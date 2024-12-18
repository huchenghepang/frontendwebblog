<template>

    <button @click="exportToExcel" class="export-button">
        <span>导出 Excel</span>
    </button>

</template>

<script lang="ts" setup>
    import { defineProps, PropType } from 'vue';
    import * as XLSX from 'xlsx';

    // 接收外部传入的数组数据和字段重命名映射关系
    const props = defineProps({
        data: {
            type: Array as PropType<Array<Record<string, any>>>, // 确保传入的数据是数组对象
            default: () => [] // 默认值为空数组
        },
        fieldNameMap: {
            type: Object as PropType<Record<string, string>>, // 接收一个对象，映射字段名称
            default: () => ({
                id: '编号',
                name: '名称',
                categoryId: '分类ID',
                fileId: '文件ID',
                createTime: '创建时间',
                isArchive: '是否归档',
                reading: '阅读数',
                updatedTime: '更新时间',
                categoryName: '分类名称'
            })
        }
    });

    // 导出 Excel 文件的函数
    const exportToExcel = () => {
        const data = props.data;
        const fieldNameMap = props.fieldNameMap;

        // 检查数据是否为空
        if (!data || data.length === 0) {
            alert('没有数据可导出');
            return;
        }

        // 重命名数据字段
        const renamedData = data.map(item => {
            const renamedItem: Record<string, any> = {};
            Object.keys(item).forEach(key => {
                // 如果有映射关系，则重命名
                const newKey = fieldNameMap[key] || key; // 如果没有映射关系，则保持原字段名
                renamedItem[newKey] = item[key];
            });
            return renamedItem;
        });

        // 直接将重命名后的数据作为 Excel 工作表进行转换
        const ws = XLSX.utils.json_to_sheet(renamedData);

        // 设置列宽
        const colWidths = calculateColumnWidths(renamedData);
        ws['!cols'] = colWidths; // 设置列宽

        // 设置每个单元格的对齐方式：水平和垂直居中
        Object.keys(ws).forEach(cell => {
            if (ws[cell].v !== undefined) {  // 确保单元格有值
                if (!ws[cell].s) {
                    ws[cell].s = {};  // 初始化单元格样式
                }
                ws[cell].s.alignment = {
                    horizontal: 'center', // 水平居中
                    vertical: 'center'   // 垂直居中
                };
            }
        });


        // 创建工作簿
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // 获取当前日期并格式化为 'YYYY-MM-DD'
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        // 生成包含日期的文件名
        const fileName = `导出的数据_${formattedDate}.xlsx`;

        // 导出 Excel 文件
        XLSX.writeFile(wb, fileName);
    };

    // 动态计算每列宽度
    const calculateColumnWidths = (data: Array<Record<string, any>>) => {
        const colWidths: any[] = [];

        // 获取每列最大内容长度
        Object.keys(data[0]).forEach((col, colIndex) => {
            let maxLength = col.length + 10; // 列头的长度
            data.forEach(row => {
                const cellValue = String(row[col]); // 强制转换为字符串
                maxLength = Math.max(maxLength, cellValue.length); // 比较并更新最大长度
            });
            colWidths.push({ wch: maxLength + 2 }); // 设置列宽，稍微加宽一点
        });

        return colWidths;
    };
</script>

<style scoped lang="scss">
    .export-button {
        padding: 8px 15px;
        font-size: 14px;
        background-color: #5a9e5d;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        color: white;
        border: 0.05rem solid #faf9f9;
        border-radius: 5px;
        cursor: pointer;


        &:hover {
            background-color: #34aa38;
        }

        &:active {
            background-color: #68bd6a;
        }
    }
</style>