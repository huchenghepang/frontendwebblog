<template>
    <div class="UserView-container">
        <div class="role">
            <!-- 搜索 -->
            <el-form ref="userearchform" :model="userSearchForm" label-width="80px" @submit.prevent="getUsersByName">
                <el-col>
                    <el-input v-model="userSearchForm.userName" placeholder="用户名" maxlength="20" clearable
                        style="width: 300px;margin: 10px" @clear="initUsersList" />
                    <el-button type="primary" @click="getUsersByName">搜索</el-button>
                    <el-button type="success" @click="initUsersList">清空</el-button>
                </el-col>

            </el-form>
            <el-button type="primary" @click="addUser">添加</el-button>

            <el-table :data="usersList" style="width: 100%">
                <el-table-column type="index" prop="prop" label="序号" width="180" />
                <el-table-column prop="user_id" label="用户ID" width="280" show-overflow-tooltip />
                <el-table-column prop="username" label="用户名" />
                <el-table-column prop="account" label="账号" width="180" />
                <el-table-column prop="register_datetime" label="注册时间" width="180" />
                <el-table-column prop="is_delete" label="是否删除" :formatter="formatIsDelete" />


                <el-table-column label="操作" width="auto">
                    <template #default="{ row, $index }">
                        <el-popconfirm :title="`确认要重置${row.username}的密码吗?`" @confirm="resetPassword(row)">
                            <template #reference>
                                <hint-button type="success" icon="Unlock" size="small" title="重置密码" />
                            </template>
                        </el-popconfirm>

                        <hint-button type="primary" icon="InfoFilled" size="small" title="分配角色权限"
                            @click.stop="addUserRoles(row)" />

                        <el-popconfirm :title="`确认要删除${row.username}吗?`" @confirm="removeUser(row.user_id)">
                            <template #reference>
                                <hint-button type="info" icon="Delete" size="small" title="删除" />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.limit" background
                :page-sizes="pagination.limits" layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />

            <!--    编辑对话-->
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
                <el-form ref="form" :model="userInfo" label-width="80px">
                    <el-form-item label="账号" prop="id">
                        <el-input v-model="userInfo.account" minlength="4" />
                    </el-form-item>
                    <el-form-item label="密码" prop="roleName">
                        <el-input v-model="userInfo.password" minlength="4" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmUpdateORAddUser">确 定</el-button>
                    </span>
                </template>
            </el-dialog>

            <!--    权限的分配-->
            <el-dialog v-model="roleVisible" :title="`为用户：${currentUserName}分配角色`" width="50%" @close="initUserRoles">


                <el-tree style="max-width: 600px" :data="rolesList" empty-text="无数据" show-checkbox node-key="id"
                    :expand-on-click-node="false" :default-checked-keys="hasRoleIds" @check="handleCheckChange">
                    <template #default="{ node, data }">
                        <p class="custom-tree-node">
                            <span>角色名：{{ data.name }}</span>
                        </p>
                    </template>
                </el-tree>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="roleVisible = false">取 消</el-button>
                        <el-button type="primary" @click="assignRolesByUserId">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" name='RoleView' setup>
    import { ref, reactive, onMounted } from 'vue';
    import moment from 'moment';
    import HintButton from '@/components/HintButton/HintButton.vue';
    import { validate } from '@/schema/validate';
    import { roleAssignmentSchema } from '@/schema/roleSchema';
    import throttle from '@/utils/throttle';
    import { reqAddUser, reqAssignUserRole, reqDeleteUser, reqFindUsersByName, reqGetUserRoleInfo, reqGetUsersList, reqResetUserPassword } from '@/api/admin';
    import { registerAddSchema } from '@/schema/admin';
    import { permissionValidateHandler } from '@/utils/permissionValidate';




    interface Pagination {
        page: number;
        limit: number;
        limits: number[];
        total: number;
    }

    const userSearchForm = reactive({ userName: '' });
    const usersList = ref<userInfoResponse[]>([]); // 这里可以根据实际数据类型做调整
    const userInfo: Ref<addUserParam> = ref({
        account: '',
        password: ''
    });

    const dialogTitle = ref('');
    const dialogVisible = ref(false);
    const roleVisible = ref(false);

    const pagination = reactive<Pagination>({
        page: 1,
        limit: 5,
        limits: [5, 10, 15, 20, 50, 100],
        total: 0
    });



    function formatIsDelete(row, column, cellValue) {
        return cellValue === 1 ? "是" : "否";
    }



    // 获取角色列表
    const getUsersList = throttle(async () => {
        const PaginationParams: PaginationParams = { page: pagination.page, limit: pagination.limit }
        const { code, data } = await reqGetUsersList(PaginationParams);
        if (code == 200) {
            usersList.value = (data.users as userInfoResponse[]).map(item => {
                item.register_datetime = moment(item.register_datetime).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            pagination.total = data.total
            ElMessage({ message: "获取用户数据成功", type: 'success' })
        } else {
            ElMessage({ message: "获取用户数据失败", type: "error" })
        }
    }, 500);

    // 分页控制
    const handleSizeChange = (size: number) => {
        pagination.limit = size;
        getUsersList();
    };

    const handleCurrentChange = (page: number) => {
        pagination.page = page;
        getUsersList();
    };

    // 初始化角色信息
    const inituserInfo = () => {
        userInfo.value.account = '';
        userInfo.value.password = '';
    };

    // 重置密码
    const resetPassword = async (row: userInfoResponse) => {

        if (!permissionValidateHandler('user.reset')) {
            return false
        }

        const { code, ErrorMessage } = await reqResetUserPassword(row.user_id)
        if (code == 200) {
            ElMessage({ message: "重置密码成功", type: "success" });
        } else {
            ElMessage({ message: ErrorMessage || "重置密码失败", type: "error" })
        }
    };



    async function addUserHandler() {

        if (!permissionValidateHandler('user.add')) {
            return false
        }

        const { valid, errors } = await validate(registerAddSchema, userInfo.value)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'error' })
        }
        const { code, ErrorMessage } = await reqAddUser(userInfo.value)
        if (code == 200) {
            ElMessage({ message: "成功添加用户", type: "success" });
            dialogVisible.value = false;
            getUsersList();
        } else {
            ElMessage({ message: ErrorMessage || "添加失败", type: "error" })
        }
    }

    // 添加或更新角色
    const confirmUpdateORAddUser = async () => {

        addUserHandler()

    };

    // 删除角色
    const removeUser = async (id: string) => {

        if (!permissionValidateHandler('user.delete')) {
            return false
        }

        const { code, ErrorMessage } = await reqDeleteUser(id);
        if (code == 200) {
            ElMessage({ message: '删除成功', type: 'success' });
            getUsersList();
        } else {
            ElMessage({ message: ErrorMessage || '删除失败', type: 'success' })
        }

    };





    function recursionRoleslist(rolesList: rolesResponse[]): number[] {
        let list: number[] = [];
        function recursion(rolesList: rolesResponse[]) {
            rolesList.forEach(role => {
                if (role.hasRole) {
                    list.push(role.id)
                }
            })
        }
        recursion(rolesList)
        return list
    }
    interface rolesResponse {
        "id": number,
        "name": string,
        "hasRole": boolean
    }
    const rolesList = ref<rolesResponse[]>([]); // 权限列表，可以根据实际定义
    // 获取角色权限信息
    const getRolesByUserId = async (id: string) => {
        const { code, data, ErrorMessage } = await reqGetUserRoleInfo(id)
        if (code == 200) {
            rolesList.value = data.roles;
            hasRoleIds.value = recursionRoleslist(rolesList.value)
            ElMessage({ message: '获取角色成功', type: 'success' })
        } else {
            ElMessage({ message: ErrorMessage || "获取角色失败", type: 'warning' })
        }
    };



    const currentUserName = ref('')
    // 显示分配角色权限 界面
    async function addUserRoles(row: userInfoResponse) {

        if (!permissionValidateHandler('user.assignrole')) {
            return false
        }


        roleVisible.value = true;
        getRolesByUserId(row.user_id);
        currentUserId.value = row.user_id;
        currentUserName.value = row.username
    }


    const hasRoleIds: Ref<number[]> = ref([])

    const handleCheckChange = (
        data,
        checkedNodes,
    ) => {
        hasRoleIds.value = checkedNodes.checkedKeys
    }

    // 分配角色权限
    const assignUserRoles = async (data: assignUserRoleParam) => {
        const { code, ErrorMessage } = await reqAssignUserRole(data)
        if (code == 200) {
            ElMessage({ message: '分配角色成功', type: 'success' });
            roleVisible.value = false;
        } else {
            ElMessage({ message: ErrorMessage || '分配角色失败', type: 'error' })
        }
    };

    // 确认分配权限
    const assignRolesByUserId = async () => {
        if (currentUserId.value) {
            const data: assignUserRoleParam = {
                userId: currentUserId.value,
                roleIds: hasRoleIds.value
            }
            const { valid, errors } = await validate(roleAssignmentSchema, data)
            if (!valid) {
                return ElMessage({ message: errors[0], type: 'error' })
            }
            assignUserRoles(data);
        }


    };



    function handleClose() {
        inituserInfo()
    }
    const currentUserId = ref('')
    // 初始化角色权限
    const initUserRoles = () => {
        currentUserId.value = '';
        hasRoleIds.value = [];
        rolesList.value = []
    };

    // 清空搜索条件并刷新用户列表
    const initUsersList = () => {
        userSearchForm.userName = '';
        pagination.page = 1;
        pagination.limit = 5;
        getUsersList();
    };

    /* 添加用户 */
    function addUser() {
        dialogVisible.value = true
    }

    // 获取用户通过用户名搜索
    const getUsersByName = async () => {
        if (!permissionValidateHandler("user.search")) {
            return false
        }
        if (userSearchForm.userName == '') return
        pagination.page = 1;
        const result = await reqFindUsersByName(userSearchForm.userName)
        if (result.code == 200) {
            usersList.value = result.data;
            pagination.total = result.data.length;
            pagination.limit = result.data.length
            ElMessage({ message: "找到了用户", type: "success" })
        } else {
            ElMessage({ message: "无法找到用户", type: "error" })
        }
    };



    onMounted(() => {
        getUsersList();
    });
</script>

<style scoped lang="scss">
    .UserView-container {
        width: 100%;
    }

    :deep() {
        .el-pagination {
            display: flex;
            justify-content: center;
        }

        .custom-tree-node {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
</style>