<template>
    <div class='ManageComment-container'>
        <div class="header-container">
            <el-button type="primary" :disabled="selectCommentIdList.length == 0"
                @click="() => isShowReviewDialog = true">批量审核</el-button>
            <el-button type="success" :disabled="selectCommentIdList.length == 0"
                @click="deleteCommentMul">批量删除</el-button>
            <div class="filter-container">
                <el-tooltip class="box-item" effect="dark" content="网络获取什么状态下的评论" placement="top-start">
                    <el-checkbox-group v-model="checkedComments" size="default" @change="getComments">
                        <el-checkbox-button v-for="commentStatus in filterComments" :key="commentStatus"
                            :value="commentStatus">
                            {{ commentStatus == 'pending' ? '尚未审核' : (commentStatus == "approved" ? '审核通过' : '审核不通过') }}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </el-tooltip>
            </div>
        </div>

        <el-table stripe :row-class-name="tableRowClassName" :data="commentsList" style="width: 100%"
            @selection-change="selectionChange">
            <el-table-column header-align="center" type="selection" align="center" label="是否勾选" />
            <el-table-column type="index" prop="prop" label="序号" width="80" />
            <el-table-column prop="userName" label="回复方" width="80" />
            <el-table-column prop="parentUserName" label="被回复方" width="80" />
            <el-table-column prop="parentComent" show-overflow-tooltip label="被回复方评论" width="180" />
            <el-table-column prop="content" label="回复内容" width="180" show-overflow-tooltip />
            <el-table-column prop="articleTitle" label="文章" show-overflow-tooltip width="180" />
            <el-table-column prop="createdDateTime" label="创建时间" />

            <el-table-column prop="updatedDateTime" label="修改时间" />
            <el-table-column prop="status" label="审核状态" :filters="[
                { text: '待审核', value: 'pending' },
                { text: '审核通过', value: 'approved' },
                { text: '审核不通过', value: 'rejected' },
            ]" :formatter="formatter" :filter-method="filterHandler" />
            <el-table-column label="操作">
                <template #default="{ row, $index }">
                    <el-popconfirm :title="`确认要删除吗?`" @confirm="deleteComment(row.commentId)">
                        <template #reference>
                            <hint-button type="danger" icon="Delete" size="default" title="删除" />
                        </template>
                    </el-popconfirm>

                    <hint-button type="success" icon="CircleCheck" @click="showReview(row.commentId)" size="default"
                        title="审核" />


                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.limit" background
            :page-sizes="pagination.limits" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange" />

        <el-dialog v-model="isShowReviewDialog" title="审核选择提醒" width="500" center>
            <span>
                请选择一个审核的状态
            </span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShowReviewDialog = false">取消</el-button>

                    <el-button type="info" @click="examinationPassed('pending')">
                        待审核
                    </el-button>
                    <el-button type="danger" @click="examinationPassed('rejected')">
                        审核不通过
                    </el-button>
                    <el-button type="success" @click="examinationPassed('approved')">
                        审核通过
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name='ManageComment' setup>
    import { reqAuditCommentsAdmin, reqDeleteCommentsAdmin, reqGetCommentsByAdmin } from "@/api/comment";
    import { auditCommentsSchema, deleteCommentsSchema } from "@/schema/comment";
    import { validate } from "@/schema/validate";
import usecommentStore from "@/stores/modules/comment";
    import type { CommentItem, CommentStatusArray } from "@/types/comment";
    import { permissionValidateHandler } from "@/utils/permissionValidate";
    import type { TableColumnCtx } from "element-plus";
    import moment from "moment";

    import { ref } from "vue"


    const commentsList = ref<CommentItem[]>([]);

    const selectCommentIdList = ref<number[]>([]);

    interface Pagination {
        page: number;
        limit: number;
        limits: number[];
        total: number;
    }


    /* 不同状态的行状态 */
    const tableRowClassName = ({
        row,
        rowIndex,
    }: {
        row: CommentItem
        rowIndex: number
    }) => {
        if (row.status === "pending") {
            return 'warning-row'
        } else if (row.status === "approved") {
            return 'success-row'
        }
        return ''
    }


    const formatter = (row: CommentItem, column: TableColumnCtx<CommentItem>) => {
        if (row.status === "pending") {
            return "待审核"
        } else if (row.status === 'approved') {
            return '审核通过'
        } else if (row.status === 'rejected') {
            return '审核不通过'
        } else {
            return row.status
        }
    }

    /* 刷选方法 */
    const filterHandler = (
        value: string,
        row: CommentItem,
        column: TableColumnCtx<CommentItem>
    ) => {
        const property = column['property']
        // @ts-ignore
        return row[property] === value
    }

    const pagination = reactive<Pagination>({
        page: 1,
        limit: 50,
        limits: [5, 10, 15, 20, 50, 100],
        total: 0
    });

    // 分页控制
    const handleSizeChange = (size: number) => {
        pagination.limit = size;
        getComments();
    };

    const handleCurrentChange = (page: number) => {
        pagination.page = page;
        getComments();
    };





    /* 选择状态变化触发的事件 */
    const selectionChange = (selection: CommentItem[]) => {
        selectCommentIdList.value = selection.map(item => item.commentId);
    };

    /* 删除单个评论 */
    function deleteComment(commentId: number) {
        selectCommentIdList.value = [commentId];

        deleteCommentMul()
    }

    /* 批量删除评论 */
    async function deleteCommentMul() {
        if (!permissionValidateHandler("comment.delete")) {
            return false;
        }

        const data = {
            commentIds: selectCommentIdList.value,
        }
        const { valid, errors } = await validate(deleteCommentsSchema, data)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'error' })
        }
        const { code, ErrorMessage } = await reqDeleteCommentsAdmin(data)
        if (code == 200) {
            ElMessage({ message: "删除成功", type: "success" });
            getComments();
        } else {
            ElMessage({ message: ErrorMessage || "删除失败", type: "error" })
        }

    }

    const isShowReviewDialog = ref(false);


    function showReview(commentId: number) {
        isShowReviewDialog.value = true;
        selectCommentIdList.value = [commentId];
    }


    /* 审核通过评论 */
    function examinationPassed(type: CommentStatus) {
        /* 验证权限 */

        isShowReviewDialog.value = false
        batchReview(type)
    }

    const commentStore = usecommentStore()
    /* 批量审核评论 */
    async function batchReview(type: CommentStatus) {
        if (!permissionValidateHandler("comment.review")) {
            return false;
        }
        const data = {
            commentIds: selectCommentIdList.value,
            status: type
        }
        const { valid, errors } = await validate(auditCommentsSchema, data)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'error' })
        }
        const { code, ErrorMessage } = await reqAuditCommentsAdmin(data)
        if (code == 200) {
            ElMessage({ message: "审核完成", type: "success" });
            getComments();
            commentStore.getNoReviewCommentCount()
        } else {
            ElMessage({ message: ErrorMessage || "审核失败", type: "error" })
        }

    }


    /* 获取评论 */
    async function getComments() {
        try {

            const { code, ErrorMessage, data } = await reqGetCommentsByAdmin({
                page: pagination.page,
                limit: pagination.limit,
                status: checkedComments.value
            })
            if (code == 200) {
                const commentsMap = new Map<number, string | undefined>();
                commentsList.value = (data.data as CommentItem[]).map((item, index, list) => {

                    /* 对日期进行格式化 */
                    item.createdDateTime = moment(item.createdDateTime).format('YYYY-MM-DD HH:mm:ss')
                    item.updatedDateTime = moment(item.updatedDateTime).format('YYYY-MM-DD HH:mm:ss')


                    if (item.parentUserId && item.parentId) {
                        // 创建一个快速查找父评论内容的映射
                        if (!commentsMap.has(item.parentId)) {
                            const parentComment = list.find(cm => cm.commentId === item.parentId);
                            if (parentComment) {
                                item.parentComent = parentComment.content
                                commentsMap.set(item.parentId, parentComment.content);
                            }
                        }
                        item.parentComent = commentsMap.get(item.parentId) || '';
                    }
                    return item;
                });
                pagination.total = data.totalRecords

            } else {
                ElMessage({ message: ErrorMessage || '获取评论失败', type: "warning" })
            }
        } catch (error) {
            console.log(error);
            ElMessage({ message: '获取评论出错', type: "error" })
        }
    }


    /* 筛选评论的状态 */
    type CommentStatus = 'pending' | 'approved' | 'rejected';
    const checkedComments = ref<CommentStatusArray>(['pending', 'approved', 'rejected'])
    const filterComments: [CommentStatus, CommentStatus, CommentStatus] = ['pending', 'approved', 'rejected']


    onMounted(() => {
        getComments()
    })
</script>

<style scoped lang="scss">


    .ManageComment-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .header-container {
            padding: 10px;
            width: 100%;
            display: flex;
            justify-content: flex-start;

            .filter-container {
                margin-left: 10px;
            }
        }

    }

</style>