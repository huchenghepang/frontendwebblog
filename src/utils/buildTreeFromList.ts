/**
 * 将平面结构的列表数据转换成树形结构
 * 
 * 该函数将根据节点的父子关系字段，将列表数据转化为树形结构。每个节点将有一个 `children` 字段，
 * 其中包含该节点的所有子节点。函数支持通过传入字段名称参数来适应不同数据结构。
 * 
 * @param {Array<Object>} list - 待转换的列表数据。每个节点对象应包含以下字段:
 *   - idField {string} 节点的唯一标识
 *   - parentIdField {string|null} 父节点的 ID, 根节点的 parentIdField 为 null
 *   - childrenField {Array} 子节点的数组字段
 * @param {string} idField - 节点的唯一标识字段名
 * @param {string} parentIdField - 父节点 ID 字段名
 * @param {string} childrenField - 子节点的字段名
 * @param {any} conditionFild - 判断顶级节点的字段
 * 
 * @returns {Array<Object>} 返回树形结构的节点数据，包含 `children` 字段表示子节点
 * 
 * @example
 * const data = [
 *   { id: 1, name: '根节点', parentId: null },
 *   { id: 2, name: '子节点1', parentId: 1 },
 *   { id: 3, name: '子节点2', parentId: 1 },
 *   { id: 4, name: '子节点1-1', parentId: 2 }
 * ];
 * 
 * const tree = buildTreeFromList(data, 'id', 'parentId', 'children');
 * console.log(tree);
 */
export default function buildTreeFromList(list: any[], idField = 'id', parentIdField = 'parentId', childrenField = 'children', conditionFild: any) {
    const nodeMap = new Map();

    // 创建一个 ID -> 节点对象的映射，初始化每个节点的 children 字段为空数组
    list.forEach(node => {
        nodeMap.set(node[idField], { ...node, [childrenField]: [] });
    });

    const tree: any[] = [];
    // 遍历列表，根据 parentIdField 建立父子关系
    list.forEach(node => {
        if (node[parentIdField] === conditionFild) {
            // 如果父节点为 null，说明当前节点是根节点
            tree.push(nodeMap.get(node[idField]));
        } else {
            // 如果有父节点，找到父节点并将当前节点加入其 children 数组
            const parentNode = nodeMap.get(node[parentIdField]);
            if (parentNode) {
                parentNode[childrenField].push(nodeMap.get(node[idField]));
            }
        }
    });

    return tree;
};



