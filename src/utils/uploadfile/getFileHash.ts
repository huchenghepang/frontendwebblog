import SparkMD5 from 'spark-md5-es'

/**
 * 使用 SparkMD5 计算文件的唯一标识符
 * @param {Blob} fileBuffer - 文件的二进制数据（注意这里应该是Blob类型更合适）
 * @returns {Promise<string>} 文件的哈希值
 */
export async function encryptFileBufferToHash(fileBuffer: Blob): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        let loaded = 0;
        fileReader.onload = (e) => {
            spark.append(e.target.result as ArrayBuffer);
            loaded += (e.target.result as ArrayBuffer).byteLength;
            if (loaded === fileBuffer.size) {
                const hash = spark.end();
                resolve(hash);
            }
        };

        fileReader.onerror = (error) => {
            reject(null);
        };

        fileReader.readAsArrayBuffer(fileBuffer);
    });
}