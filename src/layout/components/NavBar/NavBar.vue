<template>
    <div class="NavBar-container">
        <el-page-header :icon="null">
            <template #title>
                <div @click="toggleCollapseStatus">
                    <el-icon :size="18">
                        <Expand v-if="isCollapseScrollBar" />
                        <Fold v-else />
                    </el-icon>
                </div>
            </template>
            <template #breadcrumb>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/center/home' }">
                        首页
                    </el-breadcrumb-item>
                    <template v-for="(item, index) in splitPaths" :key="index">
                        <el-breadcrumb-item :to="{ name: item.name }">{{ item.meta.title }}</el-breadcrumb-item>

                    </template>


                </el-breadcrumb>
            </template>
            <template #content>
                <div class="userinfo" v-if="isShowUserInfo">
                    <span class="my-avator"> <el-avatar class="mr-3" :size="36" :src="userInfo.avatar" /></span>

                    <span class="account"><b>账户：</b>{{ userInfo.account }}</span>
                    <span class="username"> <b>用户名：</b>{{ userInfo.username }} </span>
                    <span class="signature"><b>个性签名：</b>{{ userInfo.signature }}</span>
                    <span class="email"><b>网络邮箱：</b>{{ userInfo.email }}</span>

                    <el-button type="primary" :icon="Edit" circle @click="showEditUserInfo" />
                    <hint-button type="primary" icon="SwitchButton" title="退出登录" @click="LoginOut" />

                    <div class="userinfo-right">
                        <span class="current-role"><b>当前角色：</b>{{ userInfo.currentRole.roleName }}</span>
                        <el-select v-model="currentRoleId" placeholder="切换角色" size="default" style="width: 240px"
                            @change="changeRole">
                            <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName"
                                :value="item.roleId" />
                        </el-select>
                    </div>
                </div>
            </template>
        </el-page-header>
        <el-dialog v-model="dialogFormVisible" title="个人资料修改" width="500" :lock-scroll="false">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off" />
                </el-form-item>
                <el-form-item label="个性签名" :label-width="formLabelWidth">
                    <el-input v-model="form.signature" autocomplete="off" />
                </el-form-item>
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" :action="actionURL" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="image">
                        <img v-if="!imageUrl" :src="form.avatar" class="avatar">
                        <img v-else :src="imageUrl" class="avatar">
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="submitUpdate">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name='NavBar' setup>
    import useCenterStore from "@/stores/modules/center";
    import type { UserProfile } from "@/types/customResponse";
    import { Edit } from '@element-plus/icons-vue'
    import { storeToRefs } from "pinia";
    import { ElMessage } from 'element-plus'
    import { Plus } from '@element-plus/icons-vue'
    import type { UploadProps } from 'element-plus'
    import { watch, inject } from 'vue'
    import Message from "@/components/Message";
    import { validateUpdate } from "@/schema/user";
    import { reqUpdateUserInfo } from "@/api/user";
    import throttle from "@/utils/throttle";
    import { useUserStore } from "@/stores/modules/user";
    import { useRoute, useRouter } from "vue-router";
    import { extractFieldsFromNestedData } from "@/utils/extract";
    import { useRoutesStore } from "@/stores/modules/routes";
import { config } from "@/config/config";

    const props = defineProps({
        isShowUserInfo: {
            type: Boolean,
            default: true
        }
    })

    const centerStore = useCenterStore();
    const { isCollapseScrollBar } = storeToRefs(centerStore);


    const instance = getCurrentInstance();
    watch(isCollapseScrollBar, () => {
        setInstanceShapeInfo()
    })

    const currentRoleId: number = ref(undefined)

    const userInfo: UserInfo = inject("userInfo") as UserInfo
    const roles: roleType[] = inject("roles") as roleType[]

    function setInstanceShapeInfo() {
        if (instance && instance.proxy) {
            // 访问组件的根 DOM 元素
            const componentElement = instance.proxy.$el;
            // 例如：调用 store 方法设置元素形状信息
            centerStore.setElementShapeInfo(componentElement, 'navBarShapeInfo');
        }
    }


    /* 注册自定义事件 */
    const emit = defineEmits(["updateUserInfo", "changeRole"])

    onMounted(() => {
        setInstanceShapeInfo()
    })




    function toggleCollapseStatus() {
        centerStore.toggleCollapseScrollBar();

    }


    /* 修改个人信息 */
    const formLabelWidth = '140px'
    let form: Ref<UserProfile> = ref({
        username: "",
        avatar: "",
        email: "",
        signature: ""
    })



    function showEditUserInfo() {
        form.value = {
            username: userInfo.username,
            avatar: userInfo.avatar,
            email: userInfo.email,
            signature: userInfo.signature
        }
        dialogFormVisible.value = true
    }
    const dialogFormVisible = ref(false);

    // 上传地址
    const actionURL = config.uploadSingleUrl;
    const imageUrl = ref()
    /* 上传头像 */
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
        response,
        uploadFile
    ) => {

        const { data } = response
        imageUrl.value = data.imageURL;


        form.value.avatar = data.imageURL;
    }

    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
        if (rawFile.type !== 'image/jpeg') {
            ElMessage.error('头像必须是JPG格式')
            return false
        } else if (rawFile.size / 1024 / 1024 > 2) {
            ElMessage.error('头像不能超过 2MB!')
            return false
        }
        return true
    }
    async function submitUpdate() {
        const { valid, errors } = validateUpdate(form.value)
        if (!valid) {
            Message({ text: errors[0], type: "error" });
            return
        }

        try {
            const { code } = await reqUpdateUserInfo(form.value);
            if (code == 200) {
                Message({ text: "更新成功", type: "success" });
                emit("updateUserInfo", "a")
                dialogFormVisible.value = false;
            } else {
                Message({ text: "更新失败", type: "error" })
            }
        } catch (error) {
            Message({ text: (error as Error).message || "更新失败", type: "error" })
        }
    }
    const userStore = useUserStore()
    /* 退出登录 */
    function LoginOut() {
        userStore.logout()
    }

    const route = useRoute()
    const { cacheRoutes } = storeToRefs(useRoutesStore());
    const splitPaths = ref([])
    watch(() => route.path, () => {
        const pathsList = route.path.split("/").slice(1);

        let list = []
        pathsList.forEach((pathString, index) => {
            const value = extractFieldsFromNestedData(Array.from(cacheRoutes.value), "path", ["meta", "name"], path => path == pathString || path.startsWith(pathString));
            if (value && value.length > 0) {
                list.push({
                    path: pathString,
                    ...value[0],
                })
            }

        })
        splitPaths.value = list;

    }, {
        immediate: true
    })



    /* 切换角色 */
    const changeRole = throttle((value: number) => {
        emit("changeRole", value)
    }, 2000)

</script>

<style scoped lang="scss">
    .NavBar-container {
        background-color: #f9f9f9;
        /* 背景色 */
        border: 1px solid #ddd;
        /* 边框 */
        border-radius: 8px;
        /* 圆角 */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        /* 阴影效果 */
        font-family: Arial, sans-serif;
        /* 字体 */
        overflow: hidden;
        /* 防止溢出 */
    }


    /* 个人信息 */
    .userinfo {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 5px 0px;
    }

    .userinfo .mr-3 {
        margin-right: 10px;
        /* 头像与其他元素的间距 */
    }

    .userinfo span {
        margin-right: 10px;
        /* 每个信息块的间距 */
        white-space: nowrap;
        /* 防止内容换行 */
        overflow: hidden;
        text-overflow: ellipsis;
        /* 超出部分用省略号显示 */
        color: #333;
        /* 字体颜色 */
        font-size: 14px;
        /* 字体大小 */
    }

    .userinfo .account {
        font-weight: bold;
        /* 突出账户 */
        color: #3a6fa7;
        /* 蓝色高亮 */
        cursor: pointer;
    }

    .userinfo .username,
    .userinfo .signature,
    .userinfo .email,
    .userinfo .current-role {
        justify-self: flex-end;
        font-weight: normal;
        cursor: pointer;

        &:hover {
            background-color: #ddd;
        }
    }



    @media screen and (max-width: 768px) {
        .userinfo {
            flex-wrap: wrap;
            /* 小屏幕时换行 */
        }

        .userinfo span {
            margin-bottom: 10px;
            /* 行间距 */
        }
    }

    :deep() {
        .el-page-header__breadcrumb {
            height: 20px;
            margin-bottom: 0;
            padding: 2px 10px 2px;
            border-bottom: 1px dashed rgba(0, 0, 0, 0.3);
        }

        .el-page-header__left {
            width: 100%;
            margin: 0;
        }

        .el-page-header__content {
            width: 100%;
        }

    }

    /* 解决双滚动条 */
    :deep(.el-dialog) {
        display: flex !important;
        flex-direction: column !important;
        margin: 0 !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        overflow-y: auto !important;
        overflow-x: auto !important;
        max-height: 90vh !important;

        @media screen and (max-width: 768px) {
            top: 0;
            left: 0;
            width: 100vw;
            transform: translate(0, 0);
        }
    }

    .avatar {
        width: 50px;
        height: 50px;
    }

    .my-avator {
        @include filter_invert();
    }
</style>