import * as Yup from 'yup';

// 定义验证规则
const permissionSchema = Yup.object({
    permissionName: Yup.string()
        .required("权限名称是必填项")
        .min(1, "权限名称的最小长度为 1")
        .max(100, "权限名称的最大长度为 100"),
    description: Yup.string()
        .max(255, "描述的最大长度为 255")
        .notRequired(),
    permissionValue: Yup.string()
    .max(40, "描述的最大长度为 40")
    .notRequired(),
    type: Yup.string()
        .required("类型是必填项")
        .oneOf(["route", "button"], "类型必须是 'route' 或 'button'"),
    parentId: Yup.number()
        .integer("父级 ID 必须是整数")
        .min(0, "父级 ID 必须是非负整数")
        .notRequired(),
});

// 验证函数
export const validatePermission = async (data: {
    permissionName: string;
    description?: string;
    type: string;
    parentId?: number | null;
}):Promise<ValidationResult> => {
    try {
        // 执行验证
        await permissionSchema.validate(data, { abortEarly: false });
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
