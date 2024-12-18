/**
 * 根据子项的字段值找到父项的字段值（适用于树状结构）
 * @param array - 树状结构的数组
 * @param childId - 子项的 id 值
 * @param childKey - 子项字段名，例如 "id"
 * @param targetField - 父项中需要获取的字段名，例如 "name"
 * @param childrenKey - 子节点字段名，例如 "children"
 * @returns 父项的目标字段值，找不到时返回 null
 */
export function findParentFieldInDynamicChildren<T>(
    array: T[],
    childId: any,
    childKey: keyof T,
    targetField: keyof T,
    childrenKey: keyof T
): T[keyof T] | null {
    for (const node of array) {
        // 获取子节点数组
        const children = node[childrenKey] as T[] | undefined;

        // 检查当前节点的子节点是否包含目标子项
        if (children && children.some(child => child[childKey] === childId)) {
            return node[targetField] || null;
        }

        // 递归检查子节点
        if (children && children.length > 0) {
            const result = findParentFieldInDynamicChildren(children, childId, childKey, targetField, childrenKey);
            if (result !== null) return result;
        }
    }

    // 未找到，返回 null
    return null;
}

/**
 * 根据子项的 id 找到父项的字段值（适用于平面结构）
 * @param data - 平面结构的数组
 * @param childId - 子项的 id 值
 * @param parentKey - 父项的 id 字段名，例如 "id"
 * @param childParentKey - 子项中指向父项的字段名，例如 "parentId"
 * @param targetField - 父项中需要获取的字段名，例如 "name"
 * @returns 父项的目标字段值，找不到时返回 null
 */
export function findParentFieldInFlatData<T>(
    data: T[],
    childId: any,
    parentKey: keyof T,
    childParentKey: keyof T,
    targetField: keyof T
): T[keyof T] | null {
    // 找到子项
    const child = data.find(item => item[parentKey] === childId);
    if (!child) return null;

    // 获取子项的父项 ID
    const parentId = child[childParentKey];
    if (parentId === null || parentId === undefined) return null;

    // 找到对应的父项
    const parent = data.find(item => item[parentKey] === parentId);
    return parent ? parent[targetField] : null;
}
