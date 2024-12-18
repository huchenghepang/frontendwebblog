<template>
    <div class='NotesView-container'>
        <div>
            <el-button @click="clearFilter">清空筛选</el-button>
            <el-button @click="permissionValidateWrapper('article.add')(navigateToAdd)()">创建新文章</el-button>
            <ExcelButton style="margin-left: 5px;height: 2rem;" :data="notesListInfo"></ExcelButton>
        </div>
        <el-table row-key="id" current-row-key="id" ref="tableRef"
            :default-sort="{ prop: 'reading', order: 'descending' }" :data="notesListInfo" stripe style="width: 100%"
            :max-height="height">
            <el-table-column type=index prop="index" label="序号" width="150" />
            <el-table-column prop="id" label="文章ID" width="120" />
            <el-table-column prop="name" label="标题" show-overflow-tooltip width="auto" />
            <el-table-column prop="categoryName" label="分类" width="120" />
            <el-table-column prop="fileId" label="文件ID" show-overflow-tooltip width="120" />
            <el-table-column :filters="[
                { text: '归档', value: '1' },
                { text: '未归档', value: '0' },
            ]" :filter-method="filterHandler" label="是否归档" width="120">
                <template #default="scope">
                    <el-tooltip content="切换归档状态" placement="top">
                        <div style="display: flex; align-items: center;cursor: pointer;"
                            @click="()=>permissionValidateWrapper('article.assignarchive')(toggleArchive)(scope.row)">

                            <!-- 这里必须对应列表中的数据 -->
                            <IconFont v-if="scope.row.isArchive == 1" style="pointer-events: none;font-size: 2rem;"
                                name="icon-yiguidang" />
                            <IconFont v-else style="pointer-events: none;font-size: 2rem !important;"
                                name="icon-weiguidang1" />




                            <IconFont v-if="scope.row.isArchive == 1" style="pointer-events: none;font-size: 1.5rem;"
                                name="icon-xiangxia" />
                            <IconFont v-if="scope.row.isArchive == 0" style="pointer-events: none;font-size: 1.5rem;"
                                name="icon-shangjia" />


                        </div>
                    </el-tooltip>

                </template>
            </el-table-column>
            <el-table-column sortable prop="reading" label="阅读量" width="120" />
            <el-table-column :sort-method="sortDateTime" sortable label="创建时间" min-width="120">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span>{{ scope.row.createTime }}</span>
                        <el-icon>
                            <timer />
                        </el-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column sortable :sort-method="sortDateTime" label="更新时间" min-width="120">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span style="margin-left: 10px">{{ scope.row.updatedTime }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="auto">
                <template #default="scope">
                    <el-button link type="primary" @click="()=>permissionValidateWrapper('article.edit')(editItem)(scope.row)" size="small">
                        编辑
                    </el-button>
                    <el-popconfirm :title="`要删除吗${scope.row.name}`" confirmButtonText="确定" cancelButtonText="取消"
                        confirmButtonType="primary" @confirm="()=>permissionValidateWrapper('article.delete')(deleteRow)(scope.row)" cancelButtonType="text"
                        icon="el-icon-question" iconColor="#f90">
                        <template #reference>
                            <el-button link type="primary" size="small">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>


                </template>
            </el-table-column>
        </el-table>
        <div v-if="loading" style="text-align: center; padding: 10px;">
            正在加载...
        </div>
    </div>
</template>

<script lang="ts" name='NotesView' setup>
    import { reqDeleteNote, reqGetNotesPageLimit, reqToggleArchiveNote } from "@/api/note";
import ExcelButton from "@/components/ExcelButton/ExcelButton.vue";
    import IconFont from "@/components/IconFont/IconFont.vue";
    import router from "@/router";
    import { deleteNoteSchema, toggleArchiveNoteSchema } from "@/schema/note";
    import { validate } from "@/schema/validate";
    import useCenterStore from "@/stores/modules/center";
    import {permissionValidateWrapper } from "@/utils/permissionValidate";
    import throttle from "@/utils/throttle";
    import type { TableInstance } from "element-plus";
    import moment from "moment";
    import { storeToRefs } from "pinia";
    import { ref } from "vue"
    
    

    const centerStore = useCenterStore()

    const { appMainShapeInfo, navBarShapeInfo } = storeToRefs(centerStore)

    const height = computed(() => {
        if (navBarShapeInfo.value?.clientHeight && appMainShapeInfo.value.clientHeight) {
            return appMainShapeInfo.value.clientHeight - navBarShapeInfo.value.clientHeight - 100
        } else {
            return 600
        }
    })
    const notesListInfo: Ref<NoteInfoData[]> = ref([])
    const paginationInfo = ref<Pagination>({
        total: 0,         // 总记录数
        totalPages: 0,    // 总页数
        page: 1,          // 当前页数
        limit: 20,         // 每页记录数
    })
    /* 获取notes数据 */
    async function getNotesData() {
        try {
            const { code, data, ErrorMessage } = await reqGetNotesPageLimit({ page: paginationInfo.value.page, limit: paginationInfo.value.limit })
            if (code == 200) {
                const { notes, currentPage, totalPages, totalRecords } = data;
                (notes as NoteInfoData[]).map(item => {
                    item.updatedTime = moment(item.updatedTime).format('YYYY-MM-DD HH:mm:ss')
                    item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                })
                notesListInfo.value = [...notesListInfo.value, ...notes];
                paginationInfo.value.total = totalRecords;
                paginationInfo.value.totalPages = totalPages;
                loading.value = false
            } else {
                ElMessage({ message: '获取文章数据失败', type: 'error' })
            }
        } catch (error) {
            ElMessage({ message: '获取文章数据失败', type: 'error' })
        }
    }


    function editItem(row: NoteInfoData) {
        const noteId = row.id;
        const fileId = row.fileId;
        if (noteId && fileId) {
            router.push({
                name: "editnote",
                params: {
                    fileId,
                    noteId
                }
            })
        }

    }


    /* 删除文章 */
    async function deleteNote(row: NoteInfoData) {
        try {
            const noteId = row.id;
            let fileId = '';
            const index = notesListInfo.value.findIndex((item, index) => {
                const frag = item.id === noteId;
                if (frag) {
                    fileId = item.fileId
                    return true
                } else {
                    false
                }
            })
            const { valid, errors } = await validate(deleteNoteSchema, { noteId, fileId })
            if (!valid) {
                return ElMessage({ message: errors[0], type: 'warning' })
            }

            const { code, ErrorMessage } = await reqDeleteNote({ noteId, fileId });
            if (code == 200) {
                ElMessage({ message: '成功删除', type: 'success' })
                // 一个数据
                notesListInfo.value.splice(index, 1);

            } else {
                ElMessage({ message: ErrorMessage || '删除失败', type: 'error' })
            }
        } catch (error) {
            ElMessage({ message: '删除失败', type: 'error' })
        }


    }
    function deleteRow(index: number) {
        deleteNote(index)
    }


    /* 排序 */
    /* 比较时间 */
    function sortDateTime(a: NoteInfoData, b: NoteInfoData) {
        const timeA = new Date(a.createTime).getTime(); // 将a行的时间字符串转换为时间戳
        const timeB = new Date(b.createTime).getTime(); // 将b行的时间字符串转换为时间戳
        return timeA - timeB; // 返回比较结果，如果timeA小于timeB则返回负数，表示a应该排在b前面，以此类推来确定排序顺序

    }

    const tableRef = ref<TableInstance>()
    /* 筛选 */
    function clearFilter() {
        tableRef.value!.clearFilter()
    }

    function filterHandler(value: number, row: NoteInfoData) {
        return value == row.isArchive
    }



    async function getToggleArchiveNote(row: NoteInfoData) {
        /* 发请求要row 本地处理用index */
        const noteId = row.id;
        let isArchived = false;
        const index = notesListInfo.value.findIndex((item, index) => {
            const frag = item.id === noteId;
            if (frag) {
                isArchived = item.isArchive == 1 ? false : true;
                return true
            } else {
                false
            }
        })
        try {
            const { valid, errors } = await validate(toggleArchiveNoteSchema, {
                noteId,
                isArchived
            })
            if (!valid) {
                return ElMessage({ message: errors[0], type: 'warning' })
            }
            const { code, ErrorMessage } = await reqToggleArchiveNote({
                noteId,
                isArchived
            })
            if (code == 200) {
                notesListInfo.value[index].isArchive = isArchived ? 1 : 0;
                ElMessage({ message: '切换成功', type: 'success' });

            } else {
                ElMessage({ message: ErrorMessage || '切换失败', type: 'error' })
            }
        } catch (error) {
            ElMessage({ message: '切换失败', type: 'error' })
        }
    }
    const toggleArchive = throttle((row: NoteInfoData) => {
        getToggleArchiveNote(row)
    }, 1000)


    /* 滚动到底部 */
    const loading = ref(false) // 是否正在加载数据
    const loadMoreData = async () => {
        if (loading.value) return
        if (paginationInfo.value.page >= paginationInfo.value.totalPages) {
            return
        }

        paginationInfo.value.page = paginationInfo.value.page + 1;
        loading.value = true;
        await getNotesData()

    }
    const bottomDistance = 20
    // 监听滚动事件
    const handleScroll = () => {
        if (!scrollContainer) return
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer
        if (scrollTop + clientHeight >= scrollHeight - bottomDistance && !loading.value) {
            loadMoreData()
        }
    }
    let scrollContainer: any = null // 滚动容器的引用

    /* 跳转到添加新文章 */
    function navigateToAdd() {
        router.push({
            name:"editnote"
        })
    }
    

    onMounted(() => {
        getNotesData();
        const tableEl = tableRef.value?.$el
        if (tableEl) {
            scrollContainer = tableEl.querySelector('.el-scrollbar__wrap')
            if (scrollContainer) {
                scrollContainer.addEventListener('scroll', handleScroll)
            }
        }
    })

    // 组件卸载前解绑事件
    onBeforeUnmount(() => {
        if (scrollContainer) {
            scrollContainer.removeEventListener('scroll', handleScroll)
        }
    })

</script>

<style scoped lang="scss">


</style>