interface FileMetadata {
  /** 文件的唯一标识符 */
  file_id: string,

  /** 文件的完整名称（包含扩展名） */
  file_fullname: string,

  /** 文件的扩展名 */
  file_ext: string,

  /** 文件内容 */
  content: string;

  /** 文件名（不包含扩展名） */
  name: string;

  /** 文件创建时间的时间戳 */
  file_createtime: string;

  /** 文件的创建日期（ISO 时间格式） */
  created_at: string;

  /** 文件创建时间的备用字段（ISO 时间格式） */
  create_time: string;

  /** 文件最近一次更新时间（ISO 时间格式） */
  updatedtime: string | null;

  /** 文件的阅读次数 */
  reading: number;

  /** 文件关联的笔记 ID */
  noteId: number;
}

interface FileInfoType {
  fileId: string,
  fileFullname: string,
  filExt: string,
  content: undefined | string,
  name: string,
  createDateTime: string, // 创建的时间
  // 最近编辑时间差
  updateTime: string | null,
  editTimeDays: number,//编辑的天数
  reading: number,// 阅读量
  noteId:number
}

/* 添加文字的请求参数 */
interface AddNoteRequest {
  name: string; // 笔记名称
  summary: string; // 笔记摘要
  text: string; // 笔记内容
  categoryId: number; // 分类ID
  isArchived: boolean; // 是否归档
  tags: string[]; // 标签数组
}

interface UpdateNoteRequest {
  noteId: number; // 笔记的唯一标识
  fileId: string; // 文件的唯一标识
  name: string; // 笔记名称
  summary: string; // 笔记摘要
  text: string; // 笔记内容
  categoryId: number; // 分类ID
  isArchived: boolean; // 是否归档
  tags: string[]; // 标签数组
}

interface NoteMarkDownInfo {
  noteId: number, // 笔记的唯一标识
  fileId: string, // 文件的唯一标识
}


interface DeleteNoteRequest {
  noteId: number; // 笔记的唯一标识
  fileId: string; // 文件的唯一标识
}

interface ToggleArchiveNoteRequest {
  noteId: number; // 笔记的唯一标识
  isArchived: boolean; // 是否归档
}


/* 获取的文章数据 */
interface NoteInfoData {
  "id": number,
  "name": string,
  "categoryId": number,
  "fileId": string,
  "createTime": string,
  "isArchive": number,
  "reading": number,
  "updatedTime": string,
  "categoryName": string
}

/* tags */
interface tagInfo {
  "noteId": number,
  "tagId": number,
  "tagName": string
}

interface NoteResponseData {
  fileName: string;
  fileId: string;
  filePath: string;
  fileExt: string;
  fileCreatetime: string;
  fileType: string;
  fileFullname: string;
  name: string;
  createTime: string;
  updatedtime: null | string;
  noteId: number;
  reading: number;
  categoryId: number;
  categoryName: string;
  content: string;
  isArchive:number;
  summary:string;
}


