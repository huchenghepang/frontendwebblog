enum permissionType{
    'button',
    'route'
}

interface PermissionParamData {
    permissionName: string; // 权限名称
    description: string;    // 描述
    type: permissionType;           // 权限类型
    parentId: string;       // 父节点 ID
    permissionValue:string;// 权限值
}