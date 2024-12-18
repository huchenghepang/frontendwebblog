import { reqGetCommentsByUser, reqNoReviewCommentCount } from "@/api/comment";
import { defineStore } from "pinia";
import type { CommentItem } from "@/types/comment";
import useBadgeStore from "./Bagde";

type StatusType = 'pending' | 'success'; // 定义状态类型，表示仓库的状态（loading, success, error）



// 定义状态类型，comment 模块的状态
interface commentState {
    status: StatusType; // 仓库的状态字段
    comments: CommentItem[];
    userId: string
    // 在此处添加状态的其他字段并为其定义类型
    // 示例：count: number;
}

const usecommentStore = defineStore('commentStore', {
    state(): commentState {
        return {
            status: 'pending' as StatusType, // 默认状态是pending
            comments: [],
            userId: ''
            // 在这里初始化其他状态字段
        };
    },
    actions: {
        // 在这里定义用于改变状态的actions
        async getComments(userId: string) {
            this.userId = userId;
            try {
                const { code, ErrorMessage, data } = await reqGetCommentsByUser({ userId: userId })
                if (code == 200) {
                    const commentsMap = new Map<number, string | undefined>();
                    this.comments = (data as CommentItem[]).map((item, index, list) => {

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
                    this.status = 'success';

                } else {
                    ElMessage({ message: ErrorMessage || '获取评论失败', type: "warning" })
                }
            } catch (error) {
                console.log(error);
                ElMessage({ message: '获取评论出错', type: "error" })
            }
        },
        async getNoReviewCommentCount() {
            try {
                const { code, ErrorMessage, data } = await reqNoReviewCommentCount()
                if (code == 200) {
                    if(typeof data ==='number'){
                        const badgestore = useBadgeStore();
                        badgestore.unReviewCount = data;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    getters: {
        // 用户自己的评论数量
        myComments(state): CommentItem[] {
            return state.comments.filter((item) => item.userId === state.userId);
        },

        // 别人评论回复给我的数量
        repliesToMe(state): CommentItem[] {
            return state.comments.filter((item) => item.parentUserId === state.userId && item.userId !== state.userId);
        },

        // 计算回复的评论
        commentsRepliedByMe(state): CommentItem[] {
            const repliedCommentIds = this.repliesToMe.map(comment => comment.commentId); // 使用 getter
            return state.comments.filter(comment => comment.parentId && repliedCommentIds.includes(comment.parentId));
        },

        // 计算还没有回复的评论
        commentsNoRepliedByMe(state): CommentItem[] {
            const myCommentParentIds = this.myComments.map(comment => comment.parentId); // 使用 getter
            const list = this.repliesToMe.filter((comment) => {
                if (comment.parentUserId === comment.userId || !comment.parentId) return false;
                return !myCommentParentIds.includes(comment.commentId);
            });
            const badgestore = useBadgeStore();
            if (list) {

                badgestore.reviseUnAnsweredCoumt(list.length)
            }
            return list
        },

        // 评论文章的评论
        commentsAboutArticle(state): CommentItem[] {
            return state.comments.filter((item) => !item.parentId);
        },

        // 自己回复自己的内容
        commentsByMyself(state): CommentItem[] {
            return state.comments.filter((item) => item.userId === item.parentUserId);
        }
    }
});

// comment 仓库 - 该仓库管理 comment 模块的状态
export default usecommentStore;