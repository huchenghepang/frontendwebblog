<template>
    <div class="MyCommentView-container">
        <!-- 顶部统计卡片 -->
        <div class="statistics" @click="changeCommentType">
            <el-card class="statistics-card" :class="{ active: currentReslyType == 0 }" data-type="0" shadow="always">
                <div class="card-content">
                    <h3>总评论</h3>
                    <strong>{{ comments.length }}</strong>
                </div>
            </el-card>
            <el-card class="statistics-card" :class="{ active: currentReslyType == 1 }" data-type="1" shadow="always">
                <div class="card-content">
                    <h3>我的评论</h3>
                    <strong>{{ myComments.length }}</strong>
                </div>
            </el-card>
            <el-card class="statistics-card " :class="{ active: currentReslyType == 2 }" data-type="2" shadow="always">
                <div class="card-content">
                    <h3>他人评论</h3>
                    <strong>{{ repliesToMe.length }}</strong>
                </div>
            </el-card>
            <el-card class="statistics-card" :class="{ active: currentReslyType == 3 }" data-type="3" shadow="always">
                <div class="card-content">
                    <h3>已回复</h3>
                    <strong>{{ commentsRepliedByMe.length }}</strong>
                </div>
            </el-card>
            <el-card class="statistics-card" :class="{ active: currentReslyType == 4 }" data-type="4" shadow="always">
                <div class="card-content">
                    <h3>尚未回复</h3>
                    <strong>{{ commentsNoRepliedByMe.length }}</strong>
                </div>
            </el-card>
            <el-card class="statistics-card" :class="{ active: currentReslyType == 5 }" data-type="5" shadow="always">
                <div class="card-content">
                    <h3>评论文章</h3>
                    <strong>{{ commentsAboutArticle.length }}</strong>
                </div>
            </el-card>
            <el-card class="statistics-card" :class="{ active: currentReslyType == 6 }" data-type="6" shadow="always">
                <div class="card-content">
                    <h3>评论自己</h3>
                    <strong>{{ commentsByMyself.length }}</strong>
                </div>
            </el-card>
        </div>

        <!-- 当没有评论时的提示 -->
        <div v-if="comments.length === 0" class="empty-comments">
            <el-alert title="评论空空如也，赶快去评论吧！" type="warning" />
        </div>


        <!-- 评论列表 -->
        <template v-if="renderComments.length === 0">
            <!-- 当没有评论时的提示 -->
            <div class="empty-comments">
                <el-alert title="评论空空如也，没有任何评论！" style="padding: 10px;text-align: center;" type="warning" />
            </div>
        </template>
        <template v-else>
            <div v-for="comment in renderComments" :key="comment.commentId">
                <el-card class="comment-card"
                    :class="{ 'my-comment': comment.userId === userInfo.userId, 'reply-to-me': comment.parentId }"
                    shadow="always">
                    <div class="comment-header">
                        <span class="comment-time">{{ formatDate(comment.createdDateTime) }}</span>
                        <span class="comment-article">涉及文章：{{ comment.articleTitle }}</span>
                    </div>
                    <div class="comment-content">
                        <p class="replytome">
                            <span class="username">{{ comment.parentUserId === userInfo.userId ? '我（' : '对方（'
                                }}{{ comment.parentUserName ? comment.parentUserName : '文章' }}）：</span>
                            <span>{{ comment.parentComent }}</span>
                        </p>
                        <p class="accept-comment">{{ comment.userId === userInfo.userId ? '我（' : '对方（' }}
                            {{ comment.userName }} ）:
                            {{ comment.content }}</p>
                    </div>
                    <div class="comment-footer">
                        <span class="like-count">{{ comment.likeCount }} <IconFont name="icon-xihuan1"></IconFont>
                        </span>
                        <el-button type="success" size="small"
                            @click="goToArticle(comment.articleFileId)">查看文章</el-button>
                        <el-button :disabled="userInfo.userId !== comment.userId" type="danger" size="small"
                            @click="deleteComment(comment.commentId)">删除</el-button>
                    </div>
                </el-card>
            </div>
        </template>

    </div>
</template>

<script lang="ts" setup>

    import { reqDeleteComment, reqGetCommentsByUser } from "@/api/comment";
    import { deleteCommentSchema } from "@/schema/comment";
    import { validate } from "@/schema/validate";
    import usecommentStore from "@/stores/modules/comment";
    import { useUserStore } from "@/stores/modules/user";
    import type { CommentItemResponse } from "@/types/comment";
    import { storeToRefs } from "pinia";
    import { ref } from "vue";
    import { useRouter } from "vue-router";

    // Vue Router 实例
    const router = useRouter();

    const userStore = useUserStore();
    const { userInfo } = storeToRefs(userStore)

    interface CommentItem extends CommentItemResponse {
        parentComent: string
    }


    const commentStore = usecommentStore();
    const { comments, myComments, repliesToMe, commentsRepliedByMe, commentsNoRepliedByMe, commentsAboutArticle, commentsByMyself, status } = storeToRefs(commentStore)



    const currentReslyType = ref(0)
    const renderComments: ComputedRef<CommentItem[]> = computed(() => {
        switch (currentReslyType.value) {
            case 0: return comments.value; // 全部评论
            case 1: return myComments.value; // 用户自己的评论
            case 2: return repliesToMe.value; // 别人评论回复给我的数量
            case 3: return commentsRepliedByMe.value; // 已经回复的
            case 4: return commentsNoRepliedByMe.value; // 尚未回复的
            case 5: return commentsAboutArticle.value; // 评论文章的评论
            case 6: return commentsByMyself.value; //自己的评论
            default:
                // 确保有一个默认返回值，即使它可能不会被使用
                return [] as CommentItem[];
        }

    })



    // 跳转到对应文章的功能
    const goToArticle = (articleFileId: string) => {
        router.push({ name: "article", params: { id: articleFileId } });
    };

    // 删除评论
    const deleteComment = async (commentId: number) => {


        const tempData = { commentId, userId: userInfo.value.userId };
        const { valid, errors } = await validate(deleteCommentSchema, tempData);
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' });
        }
        try {
            const { code, ErrorMessage } = await reqDeleteComment(tempData);
            if (code == 200) {
                ElMessage({ message: '删除评论成功', type: "success" });
                commentStore.getComments(userInfo.value.userId);
            } else {
                ElMessage({ message: ErrorMessage || '删除失败', type: "warning" });
            }
        } catch (error) {
            ElMessage({ message: '删除评论出错', type: "error" });
        }
    };


    // 格式化时间的方法
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    };

    /* 改变评论的类型 */
    function changeCommentType(event: Event) {
        const Element = event.target as HTMLDivElement
        const targetElement = Element.closest('.statistics-card') as HTMLDivElement
        const { type } = targetElement.dataset

        if (type) {
            currentReslyType.value = +type;
        }




    }

    onMounted(() => {
        if (status.value === "pending") {
            commentStore.getComments(userStore.userInfo.userId)
        }
    })
</script>

<style scoped lang="scss">
    .MyCommentView-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
    }

    .statistics {
        display: flex;
        gap: 20px;
        justify-content: space-between;
        flex-wrap: wrap;
        /* 让统计卡片在小屏幕上换行 */
    }

    .statistics-card {
        width: 100%;
        max-width: 200px;
        padding: 20px;
        border-radius: 12px;
        background: linear-gradient(145deg, #f1f1f1, #d4d4d4);
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.5);
        transition: all 0.3s ease;
    }




    .statistics-card:hover {
        box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.2), -6px -6px 16px rgba(255, 255, 255, 0.6);
    }

    .card-content {
        text-align: center;
        color: #333;
    }

    .active {
        background: linear-gradient(145deg, #926161, #4592be);

        .card-content {
            h3 {
                color: #fafafa !important;
            }

            strong {
                color: rgb(172, 36, 131);
            }
        }
    }

    .card-content h3 {
        font-size: 16px;
        margin-bottom: 10px;
        font-weight: 600;
        color: #3b3b3b;
    }

    .card-content strong {
        font-size: 24px;
        color: #409eff;
    }

    .empty-comments {
        padding: 10px;
        text-align: center;
        margin-top: 16px;
    }

    .comment-card {
        border-radius: 8px;
        overflow: hidden;
        background-color: #fafafa;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 5px;
        transition: box-shadow 0.3s ease;
    }

    .comment-card:hover {
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        padding: 12px;
        border-bottom: 1px solid #ececec;

        .comment-article {
            font-size: 0.9rem;
        }
    }

    .comment-header .comment-time {
        font-size: 12px;
        color: #aaa;
    }

    .comment-content {
        padding: 0.3rem;
        font-size: 0.75rem;
        line-height: 1.2;

        .username {
            padding: 4px;
        }

        .replytome,
        .accept-comment {
            padding: 10px;
        }
    }

    .comment-footer {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        border-top: 1px solid #ececec;
    }

    .comment-footer .like-count,
    .comment-footer .reply-count {
        font-size: 12px;
        color: #aaa;
    }

    .comment-footer .el-button {
        padding: 0 8px;
    }

    /* 区分样式 */
    .my-comment {
        background-color: #cce5ff;
        /* 蓝色背景，代表我的评论 */
    }

    .reply-to-me {
        background-color: #f0efec;
        /* 黄色背景，代表别人评论我的评论 */
    }

    @media (max-width: 768px) {
        .statistics {
            flex-direction: column;
            gap: 16px;
        }

        .statistics-card {
            width: 100%;
        }

        .comment-content {
            font-size: 16px;
        }

        .comment-footer .el-button {
            font-size: 12px;
        }
    }
</style>