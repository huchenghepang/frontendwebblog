// 电脑线程的数量 确定可以创建多少个WORKER 来工作
const THREAD_COUNT_MAX = navigator.hardwareConcurrency || 4;

const CHUNK_SIZE_SINGLE = 1024 * 1024 * 5; // 默认是5MB
/**
 * Description
 * @param {File} file - 文件
 * 
 */
export function cutFile(file) {
  return new Promise((resolve, reject) => {
    const TOTAL_CHUNK = Math.ceil(file.size / CHUNK_SIZE_SINGLE);
    let THREAD_TASK_COUNT = Math.ceil(TOTAL_CHUNK / THREAD_COUNT_MAX); // 最大线程开启时分配多少任务，处理多少分片
    let CURRENT_THREAD_END = 0; // 当前执行完了多少线程
    let promiseList = [];
    // 文件信息
    const fileInfo = {
      createTime: file.lastModified,
      fileSize: file.size,
      fileType: file.type,
      fileName: file.name,
      TOTAL_CHUNK, // 总分片
    };
    let THREAD_COUNT = 1;
    // 判断是否需要开启的最大线程 如：处理15个分片 开2线程 23分片 开3线程
    if (THREAD_TASK_COUNT <= THREAD_COUNT_MAX) {
      THREAD_COUNT = THREAD_TASK_COUNT;
      THREAD_TASK_COUNT = Math.ceil(TOTAL_CHUNK / THREAD_COUNT);
    } else {
      THREAD_COUNT = THREAD_COUNT_MAX;
    }

    for (let index = 0; index < THREAD_COUNT; index++) {
      console.log(new URL("/src/utils/uploadfile/work.js", import.meta.url));
      let worker = new Worker(new URL(/* @vite-ignore */ "/src/utils/uploadfile/worker.js?worker_file&type=module", import.meta.url), {
        type: "module",
      });
      // let worker = new Worker();
      // 使用线程监听消息
      worker.onmessage = (e) => {
        let result = e.data;
        for (let i in result) {
          promiseList[result[i].chunkIndex] = result[i];
        }
        CURRENT_THREAD_END++;
        if (worker) {
          worker.terminate();
          worker = undefined;
        }

        // 所有线程结束 resolve结果
        if (CURRENT_THREAD_END === THREAD_COUNT) {
          // 结束线程释放资源
          resolve(promiseList);
        }
      };
      const taskData = {
        startChunk: index * THREAD_TASK_COUNT,
        endChunk: Math.min((index + 1) * THREAD_TASK_COUNT, TOTAL_CHUNK),
        CHUNK_SIZE_SINGLE,
        file,
        fileInfo,
      };

      worker.postMessage({ taskData });
    }
  });
}
