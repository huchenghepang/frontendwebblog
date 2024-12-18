import * as Yup from 'yup';

export const addNoteSchema = Yup.object().shape({
    name: Yup.string().max(100, '名称不能超过100个字符').required('名称是必填项'),
    summary: Yup.string().max(200, '摘要不能超过200个字符').required('摘要是必填项'),
    text: Yup.string().required('内容是必填项'),
    categoryId: Yup.number().required('分类ID是必填项'),
    isArchived: Yup.boolean().required('归档状态是必填项'),
    tags: Yup.array()
        .of(
            Yup.string()
                .trim() // 确保没有多余空格
                .min(1, "标签不能为空") // 至少一个字符
        )
        .required("标签是必填项") // 数组本身为必填
        .min(1, "至少需要一个标签") // 至少需要一个元素,
});

export const updateNoteSchema = Yup.object().shape({
    noteId: Yup.number().required('笔记ID是必填项'),
    fileId: Yup.string().required('文件ID是必填项'),
    name: Yup.string().max(100, '名称不能超过100个字符').required('名称是必填项'),
    summary: Yup.string().max(200, '摘要不能超过200个字符').required('摘要是必填项'),
    text: Yup.string().required('内容是必填项'),
    categoryId: Yup.number().required('分类ID是必填项'),
    isArchived: Yup.boolean().required('归档状态是必填项'),
    tags: Yup.array()
        .of(
            Yup.string()
                .trim() // 确保没有多余空格
                .min(1, "标签不能为空") // 至少一个字符
        )
        .required("标签是必填项") // 数组本身为必填
        .min(1, "至少需要一个标签") // 至少需要一个元素,
});

export const deleteNoteSchema = Yup.object().shape({
    noteId: Yup.number().required('笔记ID是必填项'),
    fileId: Yup.string().required('文件ID是必填项'),
});

export const toggleArchiveNoteSchema = Yup.object().shape({
    noteId: Yup.number().required('笔记ID是必填项'),
    isArchived: Yup.boolean().required('归档状态是必填项'),
});
