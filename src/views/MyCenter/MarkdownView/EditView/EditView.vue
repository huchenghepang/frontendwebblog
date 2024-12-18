<template>
    <div class="EditView-container">
        <h2 class="title">{{ currentModule === 0 ? "编辑文章" : "更新文章" }}</h2>
        <v-md-editor v-model="noteForm.text" :mode="mode" :disabled-menus="[]"
            left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save| todo-list"
            @upload-image="(event: Event, insertImage: any, files: File[]) => permissionValidateWrapper('center.uploadimage')(handleUploadImage)(event, insertImage, files)"
            @save="saveMarkdwon" />



        <!-- 表单：添加文章和编辑 -->

        <el-drawer lock-scroll modal class="drawer-container" size="50%" :lock-scroll="false"
            v-model="isShowVisualDrawer" :direction="`btt`">
            <template #header>
                <div class="title-contain">
                    <h2>{{ currentModule === 0 ? "保存文章" : "更新文章" }}</h2>
                </div>
            </template>
            <template #default>
                <div>
                    <el-form :model="noteForm" ref="formRef" label-width="120px" class="form-container">
                        <!-- 名称 -->
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="noteForm.name" maxlength="100" show-word-limit placeholder="请输入名称" />
                        </el-form-item>

                        <!-- 摘要 -->
                        <el-form-item label="摘要" prop="summary">
                            <el-input type="textarea" v-model="noteForm.summary" maxlength="200" show-word-limit
                                placeholder="请输入摘要" />
                        </el-form-item>
                        <!-- 分类ID -->
                        <el-form-item label="分类ID" prop="categoryId">
                            <el-cascader :show-all-levels="false" :props="props2"
                                v-model:model-value="noteForm.categoryId" :options="categoryInfo">
                                <template #default="{ node, data }">
                                    <span>{{ data.name }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                </template>
                            </el-cascader>
                        </el-form-item>
                        <!-- 归档状态 -->
                        <el-form-item label="归档状态" prop="isArchived">
                            <el-switch v-model="noteForm.isArchived" />
                        </el-form-item>

                        <!-- 标签 -->
                        <el-form-item label="标签" prop="tags">
                            <el-tag v-for="tag in noteForm.tags" :key="tag" closable :disable-transitions="false"
                                @close="handleClose(tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
                                @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">
                                + 新标签
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template #footer>
                <div class="footer-container" style="flex: auto">
                    <el-button @click="onReset">重置</el-button>
                    <el-button @click="cancelForm">取消</el-button>
                    <el-button type="primary"
                        @click="permissionValidateWrapper('article.add')(noteSubmit)()">提交</el-button>
                </div>
            </template>
        </el-drawer>

    </div>
</template>

<script lang="ts" name='EditView' setup>
    import type { ApiResponse } from "@/types/customResponse";
    import { getFileNameWithoutExtension, renameFile } from "@/utils/globalUtils";
    import { encryptFileBufferToHash } from "@/utils/uploadfile/getFileHash";
    import { ref } from "vue";
    import type { InputInstance } from 'element-plus'
    import { reqGetArticlesCategories } from "@/api/articles";
    import buildTreeFromList from "@/utils/buildTreeFromList";
    import { validate } from "@/schema/validate";
    import { addNoteSchema, updateNoteSchema } from "@/schema/note";
    import { reqAddNote, reqNoteTags, reqNoteTContent, reqUpdateNote } from "@/api/note";
    import { useRoute } from "vue-router";
    import useCenterStore from "@/stores/modules/center";
    import { storeToRefs } from "pinia";
    import { useDeviceStore } from "@/stores/modules/device";
    import { permissionValidateWrapper } from "@/utils/permissionValidate";
    import { config } from "@/config/config";




    const mode: Ref<'preview' | 'editable'> = ref('editable') // editable 编辑模式 默认 纯预览模式 preview

    // 上传图片的接口
    const uploadURL = config.uploadSingleUrl;



    /* 上传图片 */
    async function uploadImage(file: File, uploadUrl?: string) {
        const url = new URL(uploadUrl || uploadURL);

        // 创建FormData对象附加文件
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await fetch(url, {
                method: "post",
                body: formData
            });
            if (!response.ok) {
                ElMessage({ message: '上传出现错误', type: 'error' });
                return null
            }
            const { code, ErrorMessage, data } = await response.json() as ApiResponse
            if (code == 200) {
                return data.imageURL
            } else {
                ElMessage({ message: ErrorMessage || '上传出现错误', type: 'error' });
                return
            }
        } catch (error) {
            ElMessage({ message: '上传出现错误', type: 'error' });
            return null
        }
    }
    async function handleUploadImage(event: Event, insertImage: any, files: File[]) {
        // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
        try {
            const fileName = await encryptFileBufferToHash(files[0]);

            if (fileName) {
                const file = renameFile(files[0], fileName);
                const imageURL = await uploadImage(file);
                const oldName = getFileNameWithoutExtension(files[0].name)
                // 此处只做示例
                insertImage({
                    url: imageURL,
                    desc: oldName || '图片',
                    // width: 'auto',
                    // height: 'auto',
                });
            }
        } catch (error) {
            ElMessage({ message: '处理图片出错', type: 'error' })
        }
    }

    function saveMarkdwon(text: string, html: string) {
        isShowVisualDrawer.value = true
    }

    //#region 表单数据

    // 控制底部抽屉的显示
    const isShowVisualDrawer = ref(false)

    // 表单数据
    const currentModule: Ref<0 | 1> = ref(0) // 0代表是添加文章的界面：不存在noteId 和
    const currentNoteInfo = ref<NoteMarkDownInfo>({
        fileId: '',
        noteId: -1,
    })
    const noteForm = ref<AddNoteRequest>({
        name: '', // 笔记名称
        summary: '', // 笔记摘要
        text: '', // 笔记内容
        categoryId: -1, // 分类ID
        isArchived: false, // 是否归档
        tags: [], // 标签数组
    });

    // 重置数据
    function onReset() {
        /* 难受的是Vue3没有直接重置原始数据的方式 */
        noteForm.value = {
            name: '', // 笔记名称
            summary: '', // 笔记摘要
            text: '', // 笔记内容
            categoryId: -1, // 分类ID
            isArchived: false, // 是否归档
            tags: [], // 标签数组
        }

    }
    interface CategoryInfo {
        "id": number,
        "name": string,
        "parent_id": number,
        "level": number,
        "slug": string
    }
    const props2 = {
        value: "id",
        checkStrictly: true,
        label: "name",
        emitPath: false
    }

    /* 获取分类数据 */
    const categoryInfo = ref<CategoryInfo[]>([])
    const fetchCategoryInfo = async () => {
        if (categoryInfo.value.length > 0) return
        try {
            const result = await reqGetArticlesCategories()
            if (result.code === 200) {
                const data = buildTreeFromList(result.data, 'id', 'parent_id', 'children', 0)
                categoryInfo.value = data;
                // console.log(data);

            }
        } catch (error) {
            console.dir(error)
        }
    }



    //#endregion
    // 显示表单组件

    /* 请求添加文章 */
    async function addNote() {
        const { valid, errors } = await validate(addNoteSchema, noteForm.value)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'error' })
        }
        const { code, ErrorMessage } = await reqAddNote(noteForm.value)
        if (code == 200) {
            ElMessage({ message: "保存文章成功", type: "success" });
            cancelForm()
        } else {
            ElMessage({ message: ErrorMessage || "保存文章失败", type: 'error' })
        }
    }

    /* 请求更新文章 */
    async function updateNote() {
        try {
            const updateParams = {
                ...noteForm.value,
                ...currentNoteInfo.value
            }
            const { valid, errors } = await validate(updateNoteSchema, updateParams)
            if (!valid) {
                return ElMessage({ message: errors[0], type: 'error' })
            }
            const { code, ErrorMessage } = await reqUpdateNote(updateParams);
            if (code == 200) {
                ElMessage({ message: "更新文章成功", type: "success" });
                onReset()
                cancelForm();
            } else {
                ElMessage({ message: ErrorMessage || "更新文章失败", type: 'error' })
            }
        } catch (error) {
            ElMessage({ message: "更新文章失败", type: 'error' })
        }
    }

    //#region 添加文章的提交
    function noteSubmit() {
        if (currentModule.value === 0) {
            addNote()
        } else {
            updateNote()
        }
    }
    /* 取消表单 */
    function cancelForm() {
        isShowVisualDrawer.value = false;
    }

    //#endregion

    //#region 可动态移除的tags

    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref<InputInstance>()
    const handleClose = (tag: string) => {
        noteForm.value.tags.splice(noteForm.value.tags.indexOf(tag), 1)
    }

    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value!.input!.focus()
        })
    }

    const handleInputConfirm = () => {
        if (inputValue.value) {
            noteForm.value.tags.push(inputValue.value);
        }
        inputVisible.value = false
        inputValue.value = ''
    }
    //#endregion


    /* 更新文章 */

    /* 获取文章的标签 */
    async function getTagsByNoteId(noteId: number) {
        try {
            const { code, error, data } = await reqNoteTags(noteId);
            if (code == 200) {
                (data as tagInfo[]).forEach(item => {
                    noteForm.value.tags.push(item.tagName)
                })
            }
        } catch (error) {

        }
    }

    /* 获取文章的内容 */
    async function getContentByNoteId(noteId: number) {
        try {
            const { code, ErrorMessage, data } = await reqNoteTContent(noteId);
            if (code == 200) {
                const contentInfo: NoteResponseData = data;
                noteForm.value.name = contentInfo.name;
                noteForm.value.isArchived = contentInfo.isArchive == 1 ? true : false;
                noteForm.value.categoryId = contentInfo.categoryId;
                noteForm.value.summary = contentInfo.summary;
                noteForm.value.text = contentInfo.content;
                ElMessage({ message: '获取文章内容成功', type: 'success' })
            } else {
                ElMessage({ message: ErrorMessage || '获取文章内容失败', type: 'error' })
            }
        } catch (error) {
            ElMessage({ message: '获取文章内容失败', type: 'error' })
        }
    }

    const centerStore = useCenterStore();
    const deviceStore = useDeviceStore()

    const { navBarShapeInfo, tagViewShapeInfo } = storeToRefs(centerStore)

    // 动态应用高度到 CSS 变量
    const applyHeight = (height: number) => {
        if (height) {
            document.documentElement.style.setProperty('--editor-my-height', height + "px")
        }
    }

    watchEffect(() => {
        const naVbarHeight = navBarShapeInfo.value.height || 0;
        const tagViewShapeHeight = tagViewShapeInfo.value.height || 0
        let computedHeight = 700;
        computedHeight = deviceStore.screenHeight - naVbarHeight - tagViewShapeHeight - 50;
        applyHeight(computedHeight)

    })

    const route = useRoute()
    onMounted(() => {
        // 请求分类数据
        fetchCategoryInfo();
        if (route.params?.noteId && route.params?.fileId) {
            currentModule.value = 1;
            currentNoteInfo.value = { noteId: +route.params.noteId, fileId: route.params.fileId as string };
            getTagsByNoteId(currentNoteInfo.value.noteId)
            getContentByNoteId(currentNoteInfo.value.noteId)
        }



    })

</script>

<style scoped lang="scss">
    .EditView-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
            padding: 1rem;
            height: 50px;
        }

    }

    :deep() {

        // 底部抽屉的样式
        .drawer-container {
            .title-contain {
                display: flex;
                justify-content: center;

                h4 {
                    font-size: 1.5rem;
                    font-weight: 700;
                }
            }
        }

        .footer-container {
            display: flex;
            justify-content: center;

        }


        /* 编辑器 */
        .v-md-editor {
            min-height: var(--editor-my-height) !important;
        }
    }
</style>