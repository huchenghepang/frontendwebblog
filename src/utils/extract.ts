/**
 * 通用工具函数：提取嵌套数组对象中指定字段的值
 * @param array 对象数组
 * @param key 要提取的字段名
 * @param childrenKey 嵌套子数组的键名，默认为 "children"
 * @returns 包含指定字段值的数组
 */
export function extractNestedField<T>(
    array: Array<any>,
    key: string,
    childrenKey: string = "children"
): T[] {
    const result: T[] = [];

    function extract(arr: Array<any>) {
        for (const item of arr) {
            if (item[key] !== undefined) {
                result.push(item[key]);
            }
            if (item[childrenKey] && Array.isArray(item[childrenKey])) {
                extract(item[childrenKey]);
            }
        }
    }

    extract(array);
    return result;
}


/**
 * 从嵌套数组中提取符合条件的字段值。
 *
 * @param {Array<any>} array - 要提取数据的数组，可以包含嵌套子数组。
 * @param {string} key - 用于判断是否满足提取条件的字段名。
 * @param {string} valueKey - 要提取的字段名。
 * @param {function} [fieldCondition=(value: any) => true] - 用于判断 `key` 字段是否符合条件的函数。默认为返回 `true`，表示所有项都符合条件。
 * @param {string} [childrenKey="children"] - 子项的字段名，默认为 `children`。如果该字段是一个数组，则递归提取其内容。
 * 
 * @returns {T[]} 返回提取的字段值数组，字段值的类型由 `T` 决定。
 * 
 * @template T - 返回数组中每个项的类型。
 * 
 * @example
 * // 示例：提取 `value` 字段值大于 10 的项的 `value` 字段
 * const data = [
 *   { id: 5, value: 12, children: [] },
 *   { id: 6, value: 8, children: [] },
 *   { id: 7, value: 15, children: [] },
 * ];
 * const result = extractNestedField<number>(data, 'value', 'value', value => value > 10);
 * console.log(result); // 输出: [12, 15]
 *
 * @example
 * // 示例：提取 `type` 为 `admin` 的项的 `id` 字段
 * const data = [
 *   { id: 1, type: 'admin', children: [] },
 *   { id: 2, type: 'user', children: [] },
 *   { id: 3, type: 'admin', children: [] },
 * ];
 * const result = extractNestedField<number>(data, 'type', 'id', type => type === 'admin');
 * console.log(result); // 输出: [1, 3]
 */
export function extractProNestedField<T>(
    array: Array<any>,
    key: string,
    valueKey: string,
    fieldCondition: (value: any) => boolean = () => true,
    childrenKey: string = "children"
): T[] {
    const result: T[] = [];

    function extract(arr: Array<any>) {
        for (const item of arr) {
            if (item[key] !== undefined && fieldCondition(item[key])) {
                if (item[valueKey] !== undefined) {
                    result.push(item[valueKey]);
                }
            }

            if (item[childrenKey] && Array.isArray(item[childrenKey])) {
                extract(item[childrenKey]);
            }
        }
    }

    extract(array);
    return result;
}


/**
 * 从嵌套数据中提取指定字段的值，支持提取多个字段。
 *
 * @param array - 要提取的嵌套数据数组
 * @param key - 用于判断当前项是否符合条件的字段名
 * @param valueKeys - 需要提取的字段名数组
 * @param fieldCondition - 用于判断字段是否符合条件的函数，默认为始终返回 true（即所有字段都符合条件）
 * @param childrenKey - 子项数组的字段名，默认为 "children"
 * @returns 提取出的多个字段的值组成的数组
 */
export function extractFieldsFromNestedData<T>(
    array: Array<any>,
    key: string,
    valueKeys: string[],  // 支持提取多个字段
    fieldCondition: (value: any) => boolean = () => true,
    childrenKey: string = "children"
): T[] {
    const result: T[] = [];

    /**
     * 递归提取嵌套数组中的字段
     * 
     * @param arr - 当前处理的数组
     */
    function extract(arr: Array<any>) {
        for (const item of arr) {
            // 判断当前项的 key 是否符合条件
            if (item[key] !== undefined && fieldCondition(item[key])) {
                // 提取多个字段值
                const extractedValues: Partial<T> = {};
                valueKeys.forEach(vk => {
                    // 如果当前项有该字段，则提取它
                    if (item[vk] !== undefined) {
                        extractedValues[vk] = item[vk];
                    }
                });

                // 如果有字段被提取到，加入结果数组
                if (Object.keys(extractedValues).length > 0) {
                    result.push(extractedValues as T);
                }
            }

            // 如果有子项，递归提取子项
            if (item[childrenKey] && Array.isArray(item[childrenKey])) {
                extract(item[childrenKey]);
            }
        }
    }

    // 开始提取
    extract(array);
    return result;
}

type ExtractField<T, K extends keyof T> = T[K][];

export function extractField<T, K extends keyof T>(arr: T[], key: K): ExtractField<T, K> {
    return arr.map(item => item[key]);
}




/**
 * 提取对象数组中多个字段的值，并返回一个包含这些字段的数组的对象。
 * 
 * @template T - 对象数组中每个元素的类型。
 * @template K - 要提取的字段名，必须是 T 类型的键。
 * 
 * @param {T[]} arr - 包含多个对象的数组。
 * @param {K[]} keys - 需要提取的字段名的数组，数组中的每个元素是 T 类型的一个键。
 * 
 * @returns {ExtractMultipleFields<T, K>} 返回一个对象，包含指定字段的值，每个字段对应一个数组。
 */
type ExtractMultipleFields<T, K extends keyof T> = {
    [P in K]: T[P][];
};

/**
 * 从对象数组中提取指定字段的值，返回一个包含这些字段内容的对象。
 * 
 * @param {T[]} arr - 包含多个对象的数组。
 * @param {K[]} keys - 要提取的字段名的数组。
 * @returns {ExtractMultipleFields<T, K>} 返回一个包含指定字段数组的对象。
 */
export function extractMultipleFields<T, K extends keyof T>(arr: T[], keys: K[]): ExtractMultipleFields<T, K> {
    const result = {} as ExtractMultipleFields<T, K>;

    keys.forEach((key) => {
        result[key] = arr.map(item => item[key]);
    });

    return result;
}


type AnyObject = { [key: string]: any };

/**
 * 扁平化提取所有子项（children字段）中的数据，排除有children字段的项
 * @param data 需要处理的对象，通常包含嵌套的children字段
 * @returns 返回一个包含所有子项的扁平化数组
 */
export function flattenComments(comments: any[]): any[] {
    const flatComments: any[] = [];

    // 递归扁平化每一个评论项，移除 children 字段
    const flatten = (comments: any[], parentId: number | null = null) => {
        comments.forEach(comment => {
            // 创建一个新的对象，将评论的信息以及父节点信息（parentId）保留，去除 children 字段
            const { children, ...flattenedComment } = comment;
            const flattenedWithParentId = { ...flattenedComment, parentId };

            // 将当前评论推入扁平化数组
            flatComments.push(flattenedWithParentId);

            // 如果当前评论有子评论，则递归处理
            if (comment.children && comment.children.length > 0) {
                flatten(comment.children, comment.commentId);
            }
        });
    };

    // 执行扁平化操作
    flatten(comments);

    return flatComments;
}
