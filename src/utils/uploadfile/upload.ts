import { cutFile } from "./cutfile";

export async function uploadFile(file,uploadUrl,mergeUrl) {
  // 当前的分片
  let currentChunk = 0;
  // 以上传的大小
  let uploadedSize = 0;
  let fileName = file.name;
  if (!file) {
    return;
  }
  let CHUNK_LIST = await cutFile(file);
  console.log(CHUNK_LIST);

  // 总分片
  let totalChunks = CHUNK_LIST[0].fileInfo.TOTAL_CHUNK;
  // 文件的创建时间
  let fileInfo = CHUNK_LIST[0].fileInfo;
  // 分片的大小

  while (currentChunk < totalChunks) {
    try {
      const chunk = CHUNK_LIST[currentChunk];
      const chunkSize = chunk.chunkSize;
      await uploadChunk(chunk,uploadUrl);
      uploadedSize += chunkSize;
      currentChunk++;
    } catch (error) {
      console.log("出现网络错误");
      // 这个是关键啊 
      return Promise.reject(error.message);
    }
  }
  try {
    const result = await  mergeChunk({totalChunks,fileName,fileInfo},mergeUrl);
    return result;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

export async function uploadChunk(chunk,url) {
  const formData = new FormData();
  formData.append("chunk", chunk.blob);
  formData.append("chunkIndex", chunk.chunkIndex);
  formData.append("start", chunk.start);
  formData.append("end", chunk.end);
  formData.append("chunkSize", chunk.chunkSize);
  formData.append("hash", chunk.hash);
  formData.append("fileInfo", JSON.stringify(chunk.fileInfo));
  console.log(url)
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return Promise.reject(new Error("上传出现错误"));
  }
}

export async function mergeChunk({totalChunks,fileName,fileInfo},url) {
  // const { TOTAL_CHUNK, fileName, fileType, fileSize } = fileInfo;
  const tempData = {fileName,totalChunks,fileInfo}
  const formData1 = new FormData();
  formData1.append("fileInfo", JSON.stringify(tempData));
  // formData.append("totalChunks", String(totalChunks));

  const response = await fetch(url, {
    method: "POST",
    body: formData1,
  });

  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    return Promise.reject(new Error("服务器合并文件失败"));
  }
}
