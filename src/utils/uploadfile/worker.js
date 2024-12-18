import { createChuck } from "./createchunck";
self.onmessage = async function (e){
    // 任务数据
    const {taskData} = e.data;
    // 执行一些密集型任务
    let result = await performHeavyTask(taskData);
    // 将结果发送给主线程
    self.postMessage(result)
}

async function performHeavyTask(taskData){
    let result = [];
    let {
        startChunk,
        endChunk,
        CHUNK_SIZE_SINGLE,
        file,
        fileInfo,
    } = taskData;
    for(startChunk;startChunk<endChunk;startChunk++){
        let startIndex = startChunk*CHUNK_SIZE_SINGLE;
        let endIndex = Math.min((startChunk+1)*CHUNK_SIZE_SINGLE,file.size);
        let blob = file.slice(startIndex,endIndex);
        result.push(createChuck(blob,startChunk,startIndex,endIndex,fileInfo));
    }
    return await Promise.all(result)
}