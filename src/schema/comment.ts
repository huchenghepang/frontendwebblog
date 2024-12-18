import * as Yup from 'yup';

// 添加评论的验证规则
export const addCommentSchema = Yup.object().shape({
    articleId: Yup.number()
        .positive('文章 ID 必须是正数')
        .integer('文章 ID 必须是整数')
        .required('文章 ID 是必填项'),
    userId: Yup.string()
        .min(1, '用户 ID 至少需要 1 个字符')
        .max(255, '用户 ID 最多只能包含 255 个字符')
        .required('用户 ID 是必填项'),
    parentId: Yup.number()
        .min(0, '父评论 ID 必须大于或等于 0')
        .nullable(),
    content: Yup.string()
        .min(1, '评论内容 至少需要 1 个字符')
        .required('评论内容 是必填项')
});

// 删除评论的验证规则
export const deleteCommentSchema = Yup.object().shape({
    commentId: Yup.number()
        .positive('评论 ID 必须是正数')
        .integer('评论 ID 必须是整数')
        .required('评论 ID 是必填项'),
    userId: Yup.string()
        .min(1, '用户 ID 至少需要 1 个字符')
        .max(255, '用户 ID 最多只能包含 255 个字符')
        .required('用户 ID 是必填项')
});

// 编辑评论的验证规则
export const editCommentSchema = Yup.object().shape({
    commentId: Yup.number()
        .positive('评论 ID 必须是正数')
        .integer('评论 ID 必须是整数')
        .required('评论 ID 是必填项'),
    userId: Yup.string()
        .min(1, '用户 ID 至少需要 1 个字符')
        .max(255, '用户 ID 最多只能包含 255 个字符')
        .required('用户 ID 是必填项'),
    content: Yup.string()
        .min(1, '评论内容 至少需要 1 个字符')
        .required('评论内容 是必填项')
});

// 审核评论的验证规则
export const auditCommentSchema = Yup.object().shape({
    commentId: Yup.number()
        .positive('评论 ID 必须是正数')
        .integer('评论 ID 必须是整数')
        .required('评论 ID 是必填项'),
    status: Yup.string()
        .oneOf(['approved', 'rejected'], '状态 必须是 "approved" 或 "rejected" 中的一个')
        .required('状态 是必填项')
});

// 查询评论的验证规则
export const queryCommentSchema = Yup.object().shape({
    articleId: Yup.number()
        .positive('文章 ID 必须是正数')
        .integer('文章 ID 必须是整数')
        .required('文章 ID 是必填项'),
    status: Yup.string()
        .oneOf(['pending', 'approved', 'rejected'], '状态 必须是 "pending"、"approved" 或 "rejected" 中的一个')
        .optional()
        .default('approved')  // 默认状态为 approved
});

// 批量删除评论的验证规则
export const deleteCommentsSchema = Yup.object().shape({
    commentIds: Yup.array()
        .of(
            Yup.number()
                .positive('评论 ID 必须是正数')
                .integer('评论 ID 必须是整数')
                .required('评论 ID 是必填项')
        )
        .min(1, '请至少选择一个评论进行删除')
        .required('评论 ID 数组是必填项')
});

// 批量审核评论的验证规则
export const auditCommentsSchema = Yup.object().shape({
    commentIds: Yup.array()
        .of(
            Yup.number()
                .positive('评论 ID 必须是正数')
                .integer('评论 ID 必须是整数')
                .required('评论 ID 是必填项')
        )
        .min(1, '请至少选择一个评论进行审核')
        .required('评论 ID 数组是必填项'),
    status: Yup.string()
        .oneOf(['pending', 'approved', 'rejected'], '状态 必须是 "pending"、"approved" 或 "rejected" 中的一个')
        .required('状态 是必填项')
});

// 点赞评论的验证规则
export const likeCommentSchema = Yup.object().shape({
    commentId: Yup.number()
        .positive('评论 ID 必须是正数')
        .integer('评论 ID 必须是整数')
        .required('评论 ID 是必填项'),
    userId: Yup.string()
        .min(1, '用户 ID 至少需要 1 个字符')
        .max(255, '用户 ID 最多只能包含 255 个字符')
        .required('用户 ID 是必填项')
});