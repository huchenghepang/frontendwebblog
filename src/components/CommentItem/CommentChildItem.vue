<template>
    <div class="CommentChildItem-container">
        <!-- 评论头部 -->
        <div class="comment-header">
            <span class="username">{{ comment.userName }} {{ comment.parentUserName ? `@${comment.parentUserName}` : ''
                }}</span>
            <div>
                <span v-if="props.userId === comment.userId && props.userId" class="status mine">我的评论</span>
                <span v-else-if="props.userId === comment.parentUserId && props.userId" class="status mine">涉及我的</span>
                <span v-if="comment.status === 'approved'" class="status approved">已通过</span>
                <span v-else class="status pending">待审核</span>
            </div>
        </div>

        <!-- 评论内容 -->
        <p class="comment-content">{{ comment.content }}</p>

        <!-- 评论时间 -->
        <p class="comment-datetime">
            <span>发布于：{{ formatDate(comment.createdDateTime) }}</span>
            <span>编辑于：{{ timeAgo(comment.updatedDateTime) }}</span>
        </p>

        <!-- 评论点赞数和回复数 -->
        <div class="comment-stats">
            <div>
                <!-- <span>回复数量：{{ comment.replyCount }}</span> -->
                <!-- 编辑与删除功能 -->
                <IconFont v-if="props.userId === comment.userId" @click="openAddOrEdit(1)" name="icon-bianji"
                    style="font-size: 1rem; cursor: pointer;"></IconFont>
                <el-popconfirm v-if="props.userId === comment.userId" style="border: none;" title="确定删除这个评论吗?"
                    v-on:confirm="deleteComment(comment.commentId)">
                    <template #reference>
                        <span>
                            <IconFont name="icon-shanchu" style="font-size: 1rem; cursor: pointer; border: none;">
                            </IconFont>
                        </span>
                    </template>
                </el-popconfirm>
            </div>

            <div>
                <IconFont @click="openAddOrEdit(0)" name="icon-huifu1"
                    style="font-size: 1rem; cursor: pointer; margin-right: 5px;">
                </IconFont>
                <IconFont name="icon-dianzan" v-if="!comment.liked" style="font-size: 1rem; cursor: pointer;"
                    @click="toogleLike(props.comment.commentId)">
                </IconFont>

                <IconFont name="icon-2" v-else style="font-size: 1rem; cursor: pointer;"
                    @click="toogleLike(props.comment.commentId)"></IconFont>

                <span>{{ comment.likeCount }}</span>
            </div>
        </div>

        <transition name="fade">
            <!-- 回复功能 -->
            <div v-if="showAddOrEdit" class="reply-container">
                <textarea ref="inputRef" maxlength="200" @blur="blur" v-model="content" placeholder="写下你的回复..."
                    class="comment-input" rows="3"></textarea>
                <div class="bottom-eara-container">
                    <button class="cancel-btn" @click="cancel">取 消</button>
                    <button class="submit-btn" @click="submit(comment)">{{ currentType === 0 ? "提交回复" : "提交编辑"
                        }}</button>
                </div>
            </div>
        </transition>

        <!-- 子评论递归调用 -->
        <div v-if="comment.children && comment.children.length > 0" class="children-comments">
            <transition-group name="group-comments">
                <CommentChildItem v-for="child in comment.children" :key="child.commentId" :comment="child"
                    :userId="props.userId" />
            </transition-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { reqAddComment, reqDeleteComment, reqEditComment } from "@/api/comment";
    import { addCommentSchema, deleteCommentSchema, editCommentSchema } from "@/schema/comment";
    import { validate } from "@/schema/validate";
    import type { CustomCommentItemData } from "@/types/comment";
    import { timeAgo } from "@/utils/computeDaysFormat";
    import emitter from "@/utils/mitt";
import { permissionValidateHandler } from "@/utils/permissionValidate";
    import { ref, nextTick } from "vue";

    // Props 接收评论数据
    const props = defineProps({
        comment: {
            type: Object as () => CustomCommentItemData,
            required: true,
        },
        userId: {
            type: String,
            required: true
        },
    });

    function submit(comment: CustomCommentItemData) {
        if (currentType.value === 0) {
            submitReply(comment);
        } else {
            editComment(comment);
        }
    }

    function warningLogin() {
        return ElMessage({ message: "请先登录！", type: 'warning' });

    }
    // 提交回复
    const submitReply = async (comment: CustomCommentItemData) => {
        if (!permissionValidateHandler("comment.add")) {
            return false;
        }
        const tempData = {
            articleId: comment.articleId,
            userId: props.userId,
            parentId: comment.commentId,
            content: content.value
        };
        const { valid, errors } = await validate(addCommentSchema, tempData);
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' });
        }
        try {
            const { code, ErrorMessage } = await reqAddComment(tempData);
            if (code == 200) {
                ElMessage({ message: '添加评论成功', type: "success" });
                emitter.emit("getComments");
                cancel();
            } else {
                ElMessage({ message: ErrorMessage || '添加失败', type: "warning" });
            }
        } catch (error) {
            ElMessage({ message: '添加评论出错', type: "error" });
        }
    };

    // 编辑评论
    const editComment = async (comment: CustomCommentItemData) => {

        const tempData = {
            commentId: comment.commentId,
            userId: props.userId,
            content: content.value
        };
        const { valid, errors } = await validate(editCommentSchema, tempData);
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' });
        }
        try {
            const { code, ErrorMessage } = await reqEditComment(tempData);
            if (code == 200) {
                ElMessage({ message: '编辑评论成功', type: "success" });
                emitter.emit("getComments");
                cancel();
            } else {
                ElMessage({ message: ErrorMessage || '编辑失败', type: "warning" });
            }
        } catch (error) {
            console.log(error);

            ElMessage({ message: '编辑评论出错', type: "error" });
        }
    };

    // 删除评论
    const deleteComment = async (commentId: number) => {

        if (!props.userId && props.userId === '') {
            return warningLogin()
        }

        const tempData = { commentId, userId: props.userId };
        const { valid, errors } = await validate(deleteCommentSchema, tempData);
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' });
        }
        try {
            const { code, ErrorMessage } = await reqDeleteComment(tempData);
            if (code == 200) {
                ElMessage({ message: '删除评论成功', type: "success" });
                emitter.emit("getComments");
                cancel();
            } else {
                ElMessage({ message: ErrorMessage || '删除失败', type: "warning" });
            }
        } catch (error) {
            ElMessage({ message: '删除评论出错', type: "error" });
        }
    };

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };

    /* 失去焦点 */
    function blur() {

        setTimeout(() => {
            content.value = '';
            showAddOrEdit.value = false
        }, 500);
    }



    /* 定义自定义事件 */


    const currentType = ref(0);  // 0 为回复，1 为编辑
    const content = ref("");  // 评论内容
    const showAddOrEdit = ref(false);  // 是否显示输入框

    const cancel = () => {
        showAddOrEdit.value = false;
        content.value = "";
    };

    const openAddOrEdit = (type: number) => {
        if (!props.userId && props.userId === '') {
            return warningLogin()
        }
        currentType.value = type;
        showAddOrEdit.value = true;
    };

    const toogleLike = (commentId: number) => {
        if (!props.userId && props.userId === '') {
            return warningLogin()
        }
        emitter.emit("toggleLike", commentId)
    };
</script>


<style scoped lang="scss">

    /* 定义评论列表的过渡 */
    .group-comments-enter-active,
    .group-comments-leave-active {
        transition: all 0.5s ease;
    }

    .group-comments-enter-from,
    .group-comments-leave-to {
        opacity: 0;
        transform: translateY(-20px);
    }

    .CommentChildItem-container {
        margin-top: 5px;
        background-color: transparent;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }

        &:focus-within {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            background-color: #d6d5d5;
        }

        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            .username {
                font-weight: bold;
                font-size: 0.8rem;
                color: #7a7878;
            }

            .status {
                font-size: 0.6rem;
                font-weight: bold;
                padding: 3px 8px;
                border-radius: 4px;
                cursor: pointer;
            }

            .status.approved {
                background-color: #e0f7e0;
                color: #388e3c;
            }

            .status.pending {
                background-color: #fff3e0;
                color: #ff6f00;
            }

            .status.mine {
                background-color: #fff3e0;
                color: #5d93c5;
            }
        }

        .comment-content {
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 15px;
            margin-top: 10px;

        }

        .comment-datetime {
            font-size: 0.6rem;
            color: #888;
            margin-bottom: 10px;

            span {
                margin-right: 10px;
            }
        }

        .comment-stats {
            display: flex;
            justify-content: space-between;
            font-size: 0.7rem;
            color: #555;
            margin-bottom: 15px;

            span {
                margin-right: 20px;
            }
        }

        .reply-container {
            width: 100%;


        }

        .comment-input {
            width: 100%;
            padding: 5px;
            font-size: 0.8rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: none;
            margin-bottom: 10px;

            &:focus {
                border-color: #4caf50;
                outline: none;
            }
        }



        .bottom-eara-container {
            display: flex;
            justify-content: space-between;


            .cancel-btn,
            .submit-btn {
                background-color: #4caf50;
                color: white;
                padding: 4px 8px;
                border: none;
                font-size: 0.75rem;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;

                &:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                &:hover {
                    background-color: #45a049;
                }
            }

            .cancel-btn {
                background-color: #b66d19;

                &:hover {
                    background-color: #caa765;
                }
            }
        }

        /* 定义过渡效果 */
        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.5s ease-in-out;
        }

        .fade-enter,
        .fade-leave-to {
            opacity: 0;
        }

        .fade-enter-to,
        .fade-leave {
            opacity: 1;
        }

        .fade-move {
            transition: transform 0.5s ease-in-out;
        }

    }


    @media screen and (max-width:768px) {
        .CommentChildItem-container {

            .username {

                font-size: 1rem;

            }

            .status {
                font-size: 0.7rem;

            }

            .comment-content {
                font-size: 1rem;
                color: #555;
                margin-bottom: 10px;
                margin-top: 5px;

            }

            .comment-datetime {
                font-size: 0.7rem;

                margin-bottom: 5px;

                span {
                    margin-right: 5px;
                }
            }

        }
    }
</style>
