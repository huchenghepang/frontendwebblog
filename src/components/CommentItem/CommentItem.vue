<template>
    <div class="comment-section">
        <h3>文章评论</h3>

        <!-- 发表评论 -->
        <div v-if="isLogin">
            <textarea v-model="newComment" maxlength="200" placeholder="写下你的评论..." class="comment-input"
                rows="4"></textarea>
            <button @click="submitComment" style="margin-bottom: 4px;margin-top: 0px;"
                >提交评论</button>
        </div>
        <!-- 如果用户没有登录，显示登录提示 -->
        <div v-else>
            <p class="login-prompt">
                <router-link to="/login">请登录后发表评论！</router-link>
            </p>
        </div>

        <!-- 评论列表 -->
        <div v-if="comments.length > 0">
            <transition-group name="group-comments">
                <template v-for="comment in comments" :key="comment.commentId">
                    <CommentChildItem @getComments="getComments" :userId="userStore.userInfo.userId"
                        @toggleLike="toggleLike" :comment="comment"></CommentChildItem>
                </template>
            </transition-group>
        </div>

        <!-- 提示没有评论 -->
        <p v-else class="no-comments">暂时没有评论哦，快来第一个评论吧！</p>
    </div>
</template>


<script lang="ts" setup>
    import { ref, onMounted } from 'vue'
    import { reqGetCommentsByArticle, reqAddComment, reqToggleCommentLike } from '@/api/comment'
    import { useUserStore } from '@/stores/modules/user'
    import { storeToRefs } from 'pinia'
    import type { CommentItemResponse, CustomCommentItemData, ToggleCommentLikeRequest } from '@/types/comment';
    import { validate } from '@/schema/validate';
    import { addCommentSchema, likeCommentSchema, queryCommentSchema } from '@/schema/comment';
    import buildTreeFromList from '@/utils/buildTreeFromList';
    import { flattenComments } from '@/utils/extract';
    import moment from 'moment';
    import CommentChildItem from './CommentChildItem.vue';
    import { useEvent } from '@/utils/mitt';
import { permissionValidateHandler } from '@/utils/permissionValidate';




    const props = defineProps({
        articleId: {
            type: Number,
            default: 0
        }
    })


    watch(() => props.articleId, () => {
        getComments();
    })


    const userStore = useUserStore()
    const { isLogin } = storeToRefs(userStore)
    const newComment = ref('');
    const comments = ref<CustomCommentItemData[]>([])
    const isSubmitting = ref(false);
    interface position { x: number, y?: number }


    /* 找到评论的位置 */
    function findCommentPath(
        arr: CustomCommentItemData[],
        targetValue: any,
        targetField: keyof CustomCommentItemData,
    ): position | null {
        const position: position = {
            x: 0,
        }
        let isFind = false;
        arr.forEach((item, x) => {
            if (item[targetField] === targetValue) {
                isFind = true;
                return position.x = x
            }
            if (item.children && item.children.length > 0) {
                (item.children as CustomCommentItemData[]).forEach((child, y) => {
                    if (child[targetField] === targetValue) {
                        isFind = true;
                        position.x = x;
                        return position.y = y
                    }
                })
                if (isFind) {
                    return position
                }
            }

        })

        if (isFind) {
            return position
        } else {
            return null
        }
    }


    const getComments = async () => {
        const data = { articleId: props.articleId, status: "approved" };
        const { valid, errors } = await validate(queryCommentSchema, data)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' })
        }
        try {
            const { code, ErrorMessage, data } = await reqGetCommentsByArticle({ articleId: props.articleId, status: "approved" })
            if (code == 200) {
                (data as CommentItemResponse[]).map(item => {
                    item.createdDateTime = moment(item.createdDateTime).format("YYYY-MM-DD HH:mm:ss")
                    item.updatedDateTime = moment(item.updatedDateTime).format("YYYY-MM-DD HH:mm:ss")
                    return item
                })
                const treeData = buildTreeFromList(data, 'commentId', 'parentId', 'children', 0)
                treeData.map((item, index) => {
                    const children = flattenComments(item.children);
                    item.children = children
                    return item
                });
                comments.value = treeData
            } else {
                ElMessage({ message: ErrorMessage || '获取评论失败', type: "warning" })
            }
        } catch (error) {
            console.log(error);

            ElMessage({ message: '获取评论出错', type: "error" })
        }
    }


    const toggleLike = async (commentId: number) => {
        console.log(commentId);

        const liekDataParams: ToggleCommentLikeRequest = {
            userId: userStore.userInfo.userId,
            commentId: commentId
        }
        const { valid, errors } = await validate(likeCommentSchema, liekDataParams)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' })
        }
        try {
            const { code, ErrorMessage, data } = await reqToggleCommentLike(liekDataParams)
            if (code == 200) {

                // getComments();
                const position = findCommentPath(comments.value, commentId, 'commentId')
                if (position) {
                    console.log(position);

                    if (data.action === 'like') {

                        if (!position.y && position.y !== 0) {
                            // @ts-ignore
                            comments.value[position.x].likeCount++;
                            // @ts-ignore
                            comments.value[position.x].liked = true;
                        } else {
                            // @ts-ignore
                            comments.value[position.x]['children'][position.y].likeCount++;
                            // @ts-ignore
                            comments.value[position.x]['children'][position.y].liked = true;
                        }


                        ElMessage({ message: '点赞成功', type: "success" });
                    } else {
                        if (!position.y && position.y !== 0) {
                            // @ts-ignore
                            comments.value[position.x].likeCount--;
                            // @ts-ignore
                            comments.value[position.x].liked = false;
                        } else {
                            // @ts-ignore
                            comments.value[position.x]['children'][position.y].likeCount--;
                            // @ts-ignore
                            comments.value[position.x]['children'][position.y].liked = false;
                        }
                        ElMessage({ message: '取消点赞成功', type: "success" });
                    }

                }
            } else {
                ElMessage({ message: ErrorMessage || '点赞失败', type: "warning" })
            }
        } catch (error) {
            console.log(error);
            ElMessage({ message: '点赞出错', type: "error" })
        }
    }

  

    const submitComment = async () => {
        if (!permissionValidateHandler("comment.add")) {
            return false;
        }
        // 执行权限相关的逻辑
        const tempData = {
            articleId: props.articleId,
            userId: userStore.userInfo.userId,
            parentId: 0,
            content: newComment.value
        };
        const { valid, errors } = await validate(addCommentSchema, tempData);
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' });
        }
        try {
            const { code, ErrorMessage } = await reqAddComment(tempData);
            if (code == 200) {
                ElMessage({ message: '添加评论成功', type: "success" });
                getComments()
            } else {
                ElMessage({ message: ErrorMessage || '添加失败', type: "warning" });
            }
        } catch (error) {
            ElMessage({ message: '添加评论出错', type: "error" });
        }finally{
            newComment.value = ''
        }
    }


    /* 绑定自定义事件 */
    useEvent('toggleLike', toggleLike)
    useEvent('getComments', getComments)


    onMounted(() => {
        getComments();
    })
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

    .comment-section {
        width: min($notebook-area-width, 60%);
        max-width: 1500px;
        padding: 20px;
        box-sizing: border-box;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        @include filter_invert();
    }

    h3 {
        font-size: 22px;
        margin-bottom: 20px;
        text-align: center;
        color: #333;
    }

    /* 登录提示样式 */
    .login-prompt {
        text-align: center;
        font-size: 18px;
        
        background: #fff3e0;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-top: 30px;
        font-weight: bold;
        max-width: 80%;
        margin-left: auto;
        margin-right: auto;
        transition: background 0.3s ease;
        cursor: pointer;
        margin-bottom: 15px;
        &:hover {
            background: #ffe0b2;
        }

        a{
            color: #ff6f61;
        }
    }

    .comment-input,
    .reply-input {
        width: 100%;
        padding: 14px;
        margin-bottom: 15px;
        border: 1px solid transparent;
        border-radius: 6px;
        font-size: 16px;
        resize: none;
        box-sizing: border-box;
        background-color: #fff;
        background-clip: padding-box;
        border-image: linear-gradient(45deg, #ff7a00, #00bcd4, #3e8e41, #f44336) 1;

        &:focus {
            border-color: transparent;
            border-image: linear-gradient(45deg, #ff7a00, #00bcd4, #3e8e41, #f44336) 1;
            outline: none;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
        }
    }

    button {
        width: 100%;
        padding: 12px;
        border: none;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        font-size: 16px;
        margin-top: 15px;
        box-sizing: border-box;
        transition: background-color 0.3s ease;

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        &:hover {
            background-color: #0056b3;
        }
    }

    .comment-item {
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        background-color: #fff;
        box-sizing: border-box;
        border: 2px solid transparent;
        border-image: linear-gradient(45deg, #ff7a00, #00bcd4, #3e8e41, #f44336) 1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: #007bff;
        }
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .username {
        color: #007bff;
        font-size: 16px;
    }

    .status {
        padding: 3px 8px;
        border-radius: 3px;
        font-size: 14px;
        text-transform: uppercase;
    }

    .approved {
        background-color: #28a745;
        color: white;
    }

    .pending {
        background-color: #ffc107;
        color: white;
    }

    .comment-content {
        margin: 10px 0;
        font-size: 16px;
        line-height: 1.5;
    }

    .comment-datetime {
        display: flex;
        justify-content: space-between;
        font-size: 0.6rem;
        color: #c0c0c0;
        margin-bottom: 5px;


    }

    .no-comments {
        text-align: center;
        color: #888;
        font-size: 16px;
    }

    /* 回复按钮 */
    .reply-button {
        width: auto;
        padding: 8px 16px;
        margin-top: 10px;
        background-color: #28a745;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        font-size: 14px;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #218838;
        }
    }

    @media screen and (max-width: 768px) {
        .comment-section {
            width: 100%;
        }

        .comment-item {
            padding: 15px;
            margin-bottom: 15px;
        }

        .comment-header {
            font-size: 14px;
        }

        .username {
            font-size: 14px;
        }

        .status {
            font-size: 12px;
        }

        .comment-content {
            font-size: 14px;
        }


        button {
            padding: 12px;
            font-size: 14px;
        }

        h3 {
            font-size: 20px;
        }
    }

    @media screen and (max-width: 480px) {

        .comment-input,
        .reply-input {
            font-size: 14px;
            padding: 10px 5px;
        }

        button {
            font-size: 15px;
            padding: 10px;
        }

        .comment-item {
            padding: 12px;
            margin-bottom: 12px;
        }

        .comment-header {
            font-size: 12px;
        }

        .username {
            font-size: 12px;
        }

        .status {
            font-size: 10px;
        }

        .comment-content {
            font-size: 12px;
        }
    }

</style>
