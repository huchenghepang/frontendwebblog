import validator from 'validator';
export const validateUpdate = (data: { username: string, avatar: string, email: string, signature?: string }): ValidationResult => {
    const errors: string[] = [];

    // 验证 username
    if (typeof data.username !== 'string' || data.username.length < 2 || data.username.length > 20) {
        errors.push('用户名必须是字符串类型，长度至少为 2 个字符，最多 20 个字符');
    }

    // 验证 avatar
    if (typeof data.avatar !== 'string' || !validator.isURL(data.avatar, {
        protocols: ['http', 'https'],  // 允许 http 和 https 协议
        require_protocol: true,         // 要求 URL 包含协议部分 (http:// 或 https://)
    })) {
        errors.push('头像链接必须是有效的 URL');
    }

    // 验证 email
    if (typeof data.email !== 'string' || !validator.isEmail(data.email)) {
        errors.push('邮箱格式无效');
    }

    // 验证 signature
    if (data.signature && (typeof data.signature !== 'string' || data.signature.length > 100)) {
        errors.push('个性签名长度不能超过 100 个字符');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};


