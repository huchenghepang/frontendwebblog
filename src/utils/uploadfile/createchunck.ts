// import SparkMD5 from './spark-md5'
import SparkMD5 from 'spark-md5-es'

export function createChuck(blob, chunkIndex, start, end, fileInfo) {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        // 数据读取器
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            spark.append(e.target.result);
            resolve({
                chunkIndex,
                start,
                end,
                hash: spark.end(),
                blob,
                fileInfo,
                chunkSize:end-start,
            })
        }

        fileReader.onerror = (error) => {
            reject(error.message)
        }

        fileReader.readAsArrayBuffer(blob);

    })

}