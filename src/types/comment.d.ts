export interface CommentItemResponse {
    commentId: number;  // 评论ID
    articleId: number;  // 文章ID
    userId: string;     // 用户ID，假设为 UUID 字符串
    userName: string;   // 用户名
    parentId: number | null;  // 父评论ID，可能为空
    content: string;    // 评论内容
    createdDateTime: string;  // 评论创建时间，ISO格式字符串
    updatedDateTime: string;   // 评论更新时间，ISO格式字符串
    status: 'approved' | 'pending' | 'rejected';  // 评论状态，预设三种状态
    likeCount: number;  // 点赞数量
    replyCount: number; // 回复数量
    articleTitle: string;  // 文章标题
    articleFileId: string;  // 文章文件ID，假设为字符串
    parentUserName: string | null;  // 父评论的用户名，可能为空
    parentUserId: string,
    liked?: Boolean
}

interface CustomCommentItemData extends CommentItemResponse {
    children?: CommentItemResponse[];
}

interface CommentItem extends CommentItemResponse {
    parentComent: string
}

// 请求参数类型：定义评论请求相关的参数结构

export interface AddCommentRequest {
    articleId: number;  // 文章 ID
    userId: string;     // 用户 ID
    parentId?: number;  // 父评论 ID（可选）
    content: string;    // 评论内容
}

export interface DeleteCommentRequest {
    commentId: number;  // 评论 ID
    userId: string;     // 用户 ID
}

export interface EditCommentRequest {
    commentId: number;  // 评论 ID
    userId: string;     // 用户 ID
    content: string;    // 评论内容
}

export interface AuditCommentRequest {
    commentId: number;  // 评论 ID
    status: 'approved' | 'rejected';  // 评论审核状态
}

export interface QueryCommentRequest {
    articleId: number;  // 文章 ID
    status: 'pending' | 'approved' | 'rejected';  // 评论状态，默认为 'approved'
}

export interface DeleteCommentsRequest {
    commentIds: number[];  // 多个评论 ID，必须是一个数组
}

export interface AuditCommentsRequest {
    commentIds: number[];  // 多个评论 ID，必须是一个数组
    status: 'pending' | 'approved' | 'rejected';  // 审核状态
}

interface LikeCommentRequest {
    commentId: number;  // 评论 ID
    userId: string;     // 用户 ID
}

// 切换评论点赞状态请求参数类型
export interface ToggleCommentLikeRequest {
    commentId: number;
    userId: string;
}

type CommentStatus = 'pending' | 'approved' | 'rejected';
type CommentStatusArray = [CommentStatus, CommentStatus, CommentStatus] | [CommentStatus, CommentStatus] | [CommentStatus];
interface GetCommentsByAdminRequest {
    page: number;
    limit: number;
    status?: CommentStatusArray;
}
