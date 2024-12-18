<template>
    <div class="article-container">
        <!-- 传入URL -->
        <!-- <MarkdownViewer :mdUrl="`https://raw.githubusercontent.com/adam-p/markdown-here/master/README.md`" /> -->
        <!-- 传入本地文件 -->
        <!-- 文章标题 -->
        <MarkdownViewer v-if="localFile" :file="localFile" />
        <MarkdownViewer v-else :content="currentArticleFileContent.content" :article-info="{
            title: currentArticleFileContent.name,
            datetime: currentArticleFileContent.createDateTime,
            editTimeDays: currentArticleFileContent.editTimeDays,
            reading: currentArticleFileContent.reading
        }" />

        <!-- 评论 -->
        <CommentItem v-if="currentArticleFileContent.content && currentArticleFileContent.content?.length > 0"
            :articleId="currentArticleFileContent.noteId"></CommentItem>

        <div class="background">
            <div ref="recommend" v-loading="loadingLeft" v-onReachBottom:20="onReachBottom" class="recommend">
                <h2>最新推荐笔记</h2>
                <div class="recommend-item">
                    <ArticleItem v-for="(item, index) in articleList" :key="item.note_id" v-slideIn
                        :content="item.summary" :datetime="item.create_time" :title="item.note_name" :tags="item.tags"
                        :category="item.note_category" :file-id="item.file_id" />
                </div>
                <div class="load-more">
                    <el-button :disabled="pageInfo.currentPage >= pageInfo.total" type="primary" size="small"
                        @click="onReachBottom">
                        加载更多
                    </el-button>
                </div>
                <!-- 到底提醒 -->
                <div class="recommend-footer" style="display: block; height: 20px; width: 100%; text-align: center">
                    <span v-if="pageInfo.currentPage >= pageInfo.total">💯全部加载完成🫡</span>
                </div>
            </div>
        </div>


        <el-drawer :lock-scroll="false" v-model="isShowDrawer" class="drawer-upload" :close="cancelForm"
            :show-close="false" direction="btt" size="70%">
            <template #header="{ close, titleId, titleClass }">
                <h4 :id="titleId" style="margin: 0 auto" :class="titleClass">
                    同学，输入你要上传的笔记信息吧！
                </h4>
                <el-button type="danger" @click="cancelForm">
                    <el-icon class="el-icon--left">
                        <CircleCloseFilled />
                    </el-icon>
                    关闭
                </el-button>
            </template>
            <div class="demo-drawer__content">
                <el-form :model="form" class="upload-form">
                    <el-form-item label="笔记名称" :label-width="formLabelWidth">
                        <el-input v-model="form.noteName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="分类" :label-width="formLabelWidth">
                        <el-select v-model="form.category" placeholder="请选择分类">
                            <el-option v-for="(categoryitem, index) in categoryInfo" :key="categoryitem.id"
                                :label="categoryitem.name" :value="categoryitem.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签" :label-width="formLabelWidth">
                        <div class="flex gap-2">
                            <el-tag v-for="tag in form.Tags" :key="tag" closable :disable-transitions="false"
                                @close="handleTagClose(tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue"
                                style="display: inline-block" class="w-20" size="small"
                                @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">
                                + 新标签
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="创建时间" class="datetime-picker">
                        <el-date-picker v-model="form.datetime" value-format="YYYY-MM-DD HH:mm:ss"
                            class="datetime-picker" type="datetime" placeholder="选择笔记的建立时间和日期"
                            :default-time="defaultTime" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="是否归档">
                        <el-radio-group v-model="form.isArchive">
                            <el-radio value="true" size="large">
                                是
                            </el-radio>
                            <el-radio value="false" size="large">
                                否
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="选择文件">
                        <el-upload ref="upload" class="upload-demo" drag accept=".md" :limit="1"
                            :disabled="isAllowUploadFile" :http-request="requestUploadFile" :on-exceed="handleExceed">
                            <div class="el-upload__text">
                                拖动文件 或 <em>点击上传</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    提示：MD笔记文件
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="是否上传附件">
                        <el-switch v-model="isShowUploadImage" inline-prompt active-text="是" inactive-text="否" />
                        <CustomImagesUpload v-if="isShowUploadImage" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div style="display: flex; justify-content: center" v-if="isShowDrawer">
                    <el-button @click="cancelForm">
                        取消
                    </el-button>
                    <el-button type="primary" :loading="loading" @click="onClick" :disabled="isAllowUploadFile">
                        {{ loading ? '上传中 ...' : '上传' }}
                    </el-button>
                </div>
            </template>
        </el-drawer>
        <FloatButtonGroup>
            <button class="my-btn" style="background-color: #ff7675;" @click="openDrager">
                上传笔记
            </button>
            <button class="my-btn" style="background-color: #ff7675;" @click="downloadNote">
                下载笔记
            </button>

            <BackgroundColorPicker />
            <FilePicker text="本地文件" style="position: static" :accepted-types="['.md']"
                @file-selected="handleFileInLocal" />
        </FloatButtonGroup>
        <BackgroundColorPicker style="position: fixed; bottom: 20px;display:none ;" />
    </div>

</template>

<script lang="ts" name="Article" setup>
    import FilePicker from '@/components/FilePicker/FilePicker.vue'
    import MarkdownViewer from '@/components/MarkdownViewer/MarkdownViewer.vue'
    import { ref, nextTick, onMounted, getCurrentInstance, watch } from 'vue'
    import { ElInput, ElMessage } from 'element-plus'
    import type { UploadRequestOptions, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
    import { uploadFile } from '@/utils/uploadfile/upload'
    import { reqAddArticle, reqGetArticles, reqGetArticlesCategories, reqGetContentArticle } from '@/api/articles'
    import useVuelidate from '@vuelidate/core'
    import { genFileId } from 'element-plus'
    import { required } from '@vuelidate/validators'
    import CustomImagesUpload from '@/components/CustomImagesUpload/CustomImagesUpload.vue'
    import ArticleItem from '@/components/ArticleItem/ArticleItem.vue'
    import emitter from '@/utils/mitt'
    import throttle from '@/utils/throttle'
    import moment from 'moment'
    import FloatButtonGroup from '@/components/FloatButtonGroup/FloatButtonGroup.vue'
    import BackgroundColorPicker from '@/components/BackgroundColorPicker/BackgroundColorPicker.vue'
    import { useRoute } from 'vue-router'
    import { permissionValidateHandler } from '@/utils/permissionValidate'
    import { useUserStore } from '@/stores/modules/user'
    import CommentItem from '@/components/CommentItem/CommentItem.vue'
    import { config } from '@/config/config'



    const isShowBtn = ref(true)

    const localFile = ref(null)

    const isShowDrawer = ref(false)
    const isShowUploadImage = ref(false)

    const loading = ref(false)

    interface ArticleForm {
        noteName: string
        category: string
        Tags: string[]
        datetime: string
        isArchive: boolean
        fileId: string
    }

    const form = ref<ArticleForm>({
        noteName: '',
        category: '',
        Tags: [],
        datetime: '',
        isArchive: false,
        fileId: ''
    })

    const categoryInfo = ref([])

    const defaultTime = new Date()

    const formLabelWidth = ref('120px')

    // 取消表单的逻辑
    const cancelForm = () => {
        isShowDrawer.value = false
        // form表单 回到初始状态
        form.value = {
            noteName: '',
            category: '',
            Tags: [],
            datetime: '',
            isArchive: false,
            fileId: ''
        }

        isShowUploadImage.value = false;
        upload.value!.clearFiles()
    }


    /* 打开底部抽屉 */
    const openDrager = () => {
        isShowDrawer.value = true
        // 获取文章分类信息
        fetchCategoryInfo()
    }

    /* 处理标签tag的逻辑 */

    const inputVisible = ref(false)
    const inputValue = ref('')
    const InputRef = ref<InstanceType<typeof ElInput>>()
    const handleTagClose = (tag: string) => {
        form.value.Tags.splice(form.value.Tags.indexOf(tag), 1)
    }
    // 处理键盘的键入
    const handleInputConfirm = () => {
        if (inputValue.value) {
            form.value.Tags.push(inputValue.value)
        }
        inputVisible.value = false
        inputValue.value = ''
    }

    // 显示可以编辑标签
    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value!.input!.focus()
        })
    }

    /* 日期时间选择 */

    const handleFileInLocal = (data) => {
        const file = data[0]
        if (file) {
            localFile.value = file // 保存选择的文件
            // 初始currentArticleFileContent
            currentArticleFileContent.value = {
                fileId: '',
                fileFullname: '',
                filExt: '',
                content: undefined,
                name: '',
                createDateTime: '', // 创建的时间
                // 最近编辑时间差
                updateTime: '',
                editTimeDays: 0,
                reading: 0,
                noteId: 0
            }

            nextTick(() => {
                /* 回到顶部 */
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            })
        }
    }

    const uploadUrl = new URL(config.prefixPath + '/api/upload', config.apiBaseUrl)
    const mergeUrl = new URL(config.prefixPath + '/api/merge', config.apiBaseUrl)
    // 手动实现文件上传的请求
    const requestUploadFile = async (options: UploadRequestOptions) => {
        try {
            const file = options.file
            const { data } = await uploadFile(file, uploadUrl, mergeUrl)

            form.value.fileId = data.fileId
        } catch (error) {
            console.error(error)
        }
    }

    const upload = ref<UploadInstance>()
    const handleExceed: UploadProps['onExceed'] = (files) => {
        upload.value!.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        upload.value!.handleStart(file)
        // 再次上传文件
        requestUploadFile({ file } as UploadRequestOptions)
    }

    // 提交上传文件的逻辑


    /* 是否能够上传文章 */
    const isAllowUploadFile = computed(() => {
        if (!permissionValidateHandler('article.upload')) {
            ElMessage({ message: "没有上传文章的权限", type: "info" })
            return true
        } else {
            return false
        }
    })

    const onClick = () => {
        try {
            addArticle()
        } catch (error) {
            (proxy! as any).$message({ text: '上传失败', type: 'error' })
        }
    }

    const fetchCategoryInfo = async () => {
        if (categoryInfo.value.length > 0) return
        try {
            const result = await reqGetArticlesCategories()
            if (result.code === 200) {
                categoryInfo.value = result.data
            }
        } catch (error) {
            console.dir(error)
        }
    }

    /* 表单验证 */

    const fileFormRule = {
        noteName: {
            required
        },
        category: {
            required
        },
        datetime: {
            required
        },
        isArchive: {
            required
        },
        fileId: {
            required
        },
        Tags: {
            required
        }
    }

    const $v = useVuelidate(fileFormRule, form)
    const { proxy } = getCurrentInstance()!
    async function addArticle() {
        const isFormCorrect = await $v.value.$validate()

        if (isFormCorrect) {
            // 整理信息
            const {
                noteName: noteName,
                category: category,
                Tags: tags,
                datetime: datetime,
                isArchive: isArchive,
                fileId: fileId
            } = form.value
            // 整理 tags
            const Tags = tags.join(',')
            const { data, code, message, ErrorMessage } = await reqAddArticle({ noteName, category, Tags, datetime, isArchive, fileId })
            if (code == 200 && message) {
                (proxy! as any).$message({ text: message, type: 'success' })
                cancelForm()
                getArticleContent(fileId)
            } else {
                (proxy! as any).$message({ text: ErrorMessage, type: 'error' })
            }
            return
        } else {
            (proxy! as any).$message({ text: '请完善信息', type: 'error' })
        }
        loading.value = false
    }

    const currentArticleFileContent: Ref<FileInfoType> = ref({
        fileId: '',
        fileFullname: '',
        filExt: '',
        content: undefined,
        name: '',
        createDateTime: '', // 创建的时间
        // 最近编辑时间差
        updateTime: '',
        editTimeDays: 0,
        reading: 0,
        noteId: 0,
    })

    // 获取在线文章内容
    async function getArticleContent(fileId: string) {
        try {
            const { data, code } = await reqGetContentArticle(fileId)
            if (code === 200) {


                const { file_id, file_fullname, file_ext, content, name, create_time, file_createtime, updatedtime, reading, noteId } = data as FileMetadata
                /* 处理时间的变化 */
                const createDateTime = moment(create_time).format('YYYY-MM-DD HH:mm:ss')
                const updateTime = moment(updatedtime || parseInt(file_createtime, 10)).format('YYYY-MM-DD HH:mm:ss');
                const nowDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
                // 时间差
                let editTime = moment(nowDateTime).diff(moment(updateTime), 'days')
                if (editTime < 0) {
                    editTime = 30
                }
                localFile.value = null // 重置本地文件
                currentArticleFileContent.value = {
                    fileId: file_id,
                    fileFullname: file_fullname,
                    filExt: file_ext,
                    content: content,
                    name,
                    createDateTime,
                    updateTime,
                    editTimeDays: editTime,
                    reading,
                    noteId
                }
                    ; (proxy! as any).$message({ text: '获取文章成功', type: 'success', duration: 1000 })
                /* 滑动到顶部 */
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                (proxy! as any).$message({ text: '获取文章失败', type: 'error', duration: 500 })
            }
        } catch (error) {
            (proxy! as any).$message({ text: '获取文章失败', type: 'error' })
        }
    }

    /* 获取文章列表数据 */

    const articleList = ref([])
    const pageInfo = ref({
        currentPage: 1,
        pageSize: 10,
        total: 0
    })

    const getArticleList = throttle(async () => {
        try {
            const {
                data: { current_page, notes, total_pages, total_records }
            } = await reqGetArticles({
                page: pageInfo.value.currentPage,
                pageSize: pageInfo.value.pageSize
            })
            loadingLeft.value = false
            pageInfo.value.total = total_pages
            notes.forEach((item) => {
                articleList.value.push(item)
            })
        } catch (error) {
            loadingLeft.value = false
            ElMessage('获取文章数据失败')
        }
    }, 1000)

    const loadingLeft = ref(false)
    // 触底事件
    const onReachBottom = throttle(async () => {
        // 获取更多数据
        if (pageInfo.value.currentPage < pageInfo.value.total) {
            pageInfo.value.currentPage++
            loadingLeft.value = true
            await getArticleList()
        }
    }, 1000)

    /* 下载笔记 */
    function downloadNote() {
        try {
            const content = currentArticleFileContent.value.content
            let link = document.createElement('a')
            link.download = currentArticleFileContent.value.fileFullname
            if (content) {
                let blob = new Blob([content], { type: 'text/plain' })
                link.href = URL.createObjectURL(blob)
                link.click()
                URL.revokeObjectURL(link.href);
                (proxy! as any).$message({ text: '下载成功', type: 'success' })
            }
        } catch (error) {
            (proxy! as any).$message({ text: '下载失败', type: 'error' })
        }
    }

    watch(
        () => articleList.value.length,
        () => {
            if (!route.query.fileId) {
                const fileId = articleList.value[0]['file_id']
                if (fileId && typeof fileId == 'string') {
                    getArticleContent(fileId)
                }
            } else {
                const newFileId = route.query.fileId
                if (newFileId && typeof newFileId == 'string') {
                    getArticleContent(newFileId)
                }
            }
        },
        {
            once: true
        }
    )

    const route = useRoute()
    watch(
        () => route.query.fileId,
        (newFileId, oldFileId) => {
            if (newFileId && typeof newFileId == 'string') {
                getArticleContent(newFileId)
            }
        }
    )


    onMounted(async () => {
        // 获取文章列表数据
        await getArticleList()

        /* emitter接收消息 */
        emitter.on('toggleShowBtn', (data: boolean) => {
            isShowBtn.value = data
        })
    })



    onMounted(() => {
        emitter.off('toggleShowBtn');
    })
</script>

<style scoped lang="scss">

    :deep(.drawer-upload) {
        width: 50vw;
        margin: 0 auto;
        // 隐藏滚动条
        overflow: hidden;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .demo-drawer__footer {
        display: flex;
        justify-content: center;
    }

    :deep(.el-drawer__title) {
        text-align: center;
    }

    :deep(.el-drawer__body) {
        &::-webkit-scrollbar {
            display: none;
        }
    }

    :deep(.upload-demo) {
        width: 400px;
    }

    @media screen and (max-width: 768px) {
        :deep(.drawer-upload) {
            width: 100vw;
        }

        :deep(.el-overlay) {
            width: 100vw;
        }
    }

    .article-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: var(--notebook-background-color);
        min-height: calc(100vw - $header-height);

        .background {
            position: fixed;
            top: $header-height;
            right: 0;
            height: calc(100vh - $header-height - 200px);
            width: 15vw;

            &::before {
                content: '';
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(ellipse at 70% 60%, #c3e060 0%, rgba(195, 224, 96, 0) 90%), radial-gradient(ellipse at 30% 30%, #c3e060 0%, rgba(195, 224, 96, 0) 60%), radial-gradient(ellipse at bottom left, #00a3cb 0%, rgba(0, 163, 203, 0) 70%), linear-gradient(135deg, rgba(18, 46, 119, 0) 0%, rgba(18, 46, 119, 0) 75%, #122e77 100%), linear-gradient(to right, #625793 0%, #d55d64 35%, #e49129 65%, #c0671c 100%);
                background-blend-mode: overlay, luminosity, multiply, saturation, color-dodge, lighten;
                filter: blur(100px);
                z-index: -1;
            }
        }

        /* 推荐区域 */
        .recommend {
            /* 位于视口右侧 */
            position: fixed;
            top: $header-height;
            text-align: center;
            overflow-x: hidden;
            width: 20vw;
            right: 0;
            height: calc(100vh - $header-height - 200px);
            overflow-y: auto;
            bottom: $header-height;
            background: transparent;
            border-radius: 10px;
            padding: 0 20px;

            /* 隐藏滚动条 */
            &::-webkit-scrollbar {
                display: none;
            }

            h2 {
                cursor: pointer;
                position: sticky;
                top: 0;
                display: block;
                width: 100%;
                box-shadow: 1px 2px 1px rgba(240, 235, 235, 0.2) inset;
                border-bottom: 2px solid #333;
                background-color: #ccc;
                border-radius: 20px;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                transition: all 0.5s 0.1 ease;
                z-index: 3;

                &:hover {
                    background-color: #a39999;
                    text-align: center;
                }
            }

            .recommend-item {
                z-index: 99;
                /* 隐藏滚动条 */

            }

            .load-more {
                display: none;

                @media screen and (max-width: 768px) {
                    display: block;
                }
            }

            @media screen and (max-width: 768px) {
                .recommend-footer {
                    display: none;
                }
            }

            /* 媒体查询 移动端*/
            @media screen and (max-width: 768px) {
                position: static;
                display: block;
                width: 100vw;
                height: auto;
                padding: 0;
            }
        }

    }

    @media screen and (max-width: 768px) {
        .article-container {
            padding: 0;

            .background {
                margin-top: 10px;
                position: static;
                display: block;
                width: 100vw;
                height: auto;
            }
        }
    }
</style>
