import * as Yup from 'yup';

// 通用验证函数，确保 T 是一个对象类型
export const validate = async <T extends Record<string, any>>(schema: Yup.ObjectSchema<T>, data: T): Promise<{ valid: boolean, errors: string[] }> => {
    try {
        // 执行验证
        await schema.validate(data, { abortEarly: false });
        return {
            valid: true,
            errors: []
        };
    } catch (error) {
        // 捕获验证失败的错误信息
        if (error instanceof Yup.ValidationError) {
            return {
                valid: false,
                errors: error.errors // 错误信息数组
            };
        }
        throw error; // 其他错误抛出
    }
};


/*
 const userSchema = Yup.object({
    username: Yup.string()
        .required("用户名是必填项")
        .min(3, "用户名的最小长度为 3")
        .max(50, "用户名的最大长度为 50"),
    email: Yup.string()
        .required("邮箱是必填项")
        .email("请输入有效的邮箱"),
});

// 验证数据
const userData = {
    username: 'john_doe',
    email: 'john@example.com',
};

const userValidationResult = await validate(userSchema, userData);

if (userValidationResult.valid) {
    console.log("用户数据验证通过");
} else {
    console.log("用户数据验证失败:", userValidationResult.errors);
}
     */