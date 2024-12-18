export default function findIndexChain(data, obejctId,targetId) {
    const chain = [];

    function search(array, currentIndex) {
        for (let i = 0; i < array.length; i++) {
            const item = array[i];
            if (item[obejctId]=== targetId) {
                chain.push(currentIndex);
                return true; // 找到目标，返回
            }
            if (item.children && item.children.length > 0) {
                if (search(item.children,currentIndex + i + 1)) {
                    chain.unshift(currentIndex+i); // 记录父级索引
                    return true; // 找到目标，返回
                }
            }
        }
        return false; // 未找到
    }

    search(data, 0);
    return chain.length > 0 ? chain : null; // 如果未找到返回 null
}
