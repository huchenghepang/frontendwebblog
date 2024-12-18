import * as Yup from 'yup';

/* 添加的验证 */

export const addRoleParamSchema = Yup.object({
    roleName: Yup.string().required('角色名称是必须的').min(1, "角色名称的最小长度是1").max(255, '角色名称的最大长度是255'),
    description: Yup.string().required("描述是必填的").min(0).max(500, '描述不要超过500个字符')
})

// 定义验证规则
export const permissionAssignmentSchema = Yup.object({
    roleId: Yup.number()
        .required("角色 ID 是必填项"), // 角色 ID 必填
    permissionIds: Yup.array()
        .of(Yup.number().integer("权限 ID 必须是整数").required("每个权限 ID 必须是整数"))
        .required("权限 ID 数组是必填项"),
});

// 定义验证规则
export const roleAssignmentSchema = Yup.object({
    userId: Yup.string().min(1)
        .required("用户 ID 是必填项"), // 角色 ID 必填
    roleIds: Yup.array()
        .of(Yup.number().integer("角色 ID 必须是整数").required("每个角色 ID 必须是整数"))
        .required("角色 ID 数组是必填项"),
});