/**
 * 修改文件名
 * @param file - 原始 File 对象
 * @param newFileName - 新的文件名
 * @returns 修改文件名后的新 File 对象
 */
export function renameFile(file: File, newFileName: string): File {
    if (!(file instanceof File)) {
        throw new Error("参数 file 必须是一个 File 对象");
    }

    // 获取原文件的扩展名（后缀名）
    const originalExtension = file.name.split('.').pop();
    if (originalExtension) {
        // 如果提供的新文件名没有扩展名，则添加原文件的扩展名
        if (!newFileName.includes('.')) {
            newFileName += `.${originalExtension}`;
        } else {
            // 如果新文件名有扩展名，检查是否与原文件扩展名一致，不一致则替换
            const providedExtension = newFileName.split('.').pop();
            if (providedExtension!== originalExtension) {
                newFileName = newFileName.replace(`.${providedExtension}`, `.${originalExtension}`);
            }
        }
    }

    return new File([file], newFileName, {
        type: file.type, // 保留原文件的 MIME 类型
        lastModified: file.lastModified, // 保留原文件的最后修改时间
    });
}

/**
 * 从文件名中去除文件扩展名
 * @param fileName - 包含扩展名的文件名
 * @returns 去除扩展名后的文件名
 */
export function getFileNameWithoutExtension(fileName:string):string {
    const parts = fileName.split('.');
    parts.pop();
    return parts.join('.');
}