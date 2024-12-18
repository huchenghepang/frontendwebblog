<template>
    <div class="RoleView-container">
        <div class="role">
            <!-- 搜索 -->
            <el-form ref="userearchform" :model="roleSearchForm" label-width="80px" @submit.prevent="getRoleById">
                <el-col>
                    <el-input :size="size" v-model="roleSearchForm.roleName" placeholder="角色名称" maxlength="20" clearable
                        style="width: 300px;margin: 10px" @clear="initRolesList" />
                    <el-button :size="size" type="primary" @click="getRoleById">搜索</el-button>
                    <el-button :size="size" type="success" @click="initRolesList">清空</el-button>
                </el-col>

            </el-form>
            <el-button type="primary" @click="addRole">添加</el-button>
            <el-button type="success" :disabled="selectRoleIdList.length == 0" @click="deleteRoleMul">批量删除</el-button>
            <el-table :data="rolesList" :size="size" style="width: 100%" @selection-change="selectionChange">
                <el-table-column header-align="center" type="selection" align="center" label="是否勾选" />
                <el-table-column type="index" prop="prop" label="序号" width="180" />
                <el-table-column prop="role_id" label="角色ID" width="180" />
                <el-table-column prop="role_name" label="角色名称" width="180" />
                <el-table-column prop="description" label="描述" width="180" />
                <el-table-column prop="created_at" label="创建时间" />

                <el-table-column prop="updated_at" label="修改时间" />
                <el-table-column label="操作">
                    <template #default="{ row, $index }">
                        <hint-button type="success" icon="Edit" title="修改角色信息" :size="size" @click="updateRole(row)" />
                        <hint-button type="primary" icon="InfoFilled" :size="size"  title="分配角色权限"
                            @click.stop="addPermissionRole(row)" />
                        <el-popconfirm :title="`确认要删除${row.role_name}吗?`" @confirm="deleteRole(row)">
                            <template #reference>
                                <hint-button type="info" icon="Delete" :size="size" title="删除" />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :size="size" v-model:current-page="pagination.page" v-model:page-size="pagination.limit" background
                :page-sizes="pagination.limits" layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />

            <!--    编辑对话-->
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
                <el-form ref="form" :model="roleInfo" label-width="80px">
                    <el-form-item label="角色名" prop="id">
                        <el-input v-model="roleInfo.roleName" minlength="4" />
                    </el-form-item>
                    <el-form-item label="描述" prop="roleName">
                        <el-input v-model="roleInfo.description" minlength="4" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmUpdateORAddRole">确 定</el-button>
                    </span>
                </template>
            </el-dialog>

            <!--    权限的分配-->
            <el-dialog  v-model="permissionVisible" :title="`分配${roleInfo.roleName}权限`" width="50%"
                @close="initRolePermissions">


                <el-tree style="max-width: 600px" :data="permissionList" empty-text="无数据" show-checkbox node-key="id"
                    :checkStrictly="true" :expand-on-click-node="false" :default-checked-keys="hasPermissionIds"
                    @check="handleCheckChange">
                    <template #default="{ node, data }">
                        <p class="custom-tree-node">
                            <span>权限名：{{ data.name }}</span>
                            <span>权限类型：{{ data.type }}</span>
                        </p>
                    </template>
                </el-tree>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button :size="size" @click="permissionVisible = false">取 消</el-button>
                        <el-button :size="size" type="primary" @click="assignPermissionByRoleId">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" name='RoleView' setup>
    import { ref, reactive, onMounted } from 'vue';
    import { reqAddRole, reqAssignPermissions, reqDeleteBatchRole, reqDeleteRole, reqFindRoleByName, reqGetRolePermissions, reqGetRolesList, reqUpdateRole } from '@/api/role';
    import moment from 'moment';
    import { validate } from '@/schema/validate';
    import { addRoleParamSchema, permissionAssignmentSchema } from '@/schema/roleSchema';
    import throttle from '@/utils/throttle';
    import { permissionValidateHandler } from '@/utils/permissionValidate';
import { useDeviceStore } from '@/stores/modules/device';


    interface Pagination {
        page: number;
        limit: number;
        limits: number[];
        total: number;
    }

    const frag = ref(0);
    const roleSearchForm = reactive({ roleName: '' });
    const rolesList = ref<RoleInfo[]>([]); // 这里可以根据实际数据类型做调整
    const roleInfo: Ref<addRoleParam> = ref({
        roleName: '',
        description: '',
    });
    const selectRoleIdList = ref<number[]>([]);

    const deviceStore =  useDeviceStore()
    const size = computed(()=>{
        return deviceStore.isLargeScreen?'default':'small'
    })
    const dialogTitle = ref('');
    const dialogVisible = ref(false);
    const permissionVisible = ref(false);

    const pagination = reactive<Pagination>({
        page: 1,
        limit: 5,
        limits: [5, 10, 15, 20, 50, 100],
        total: 0
    });







    // 获取角色列表
    const getRolesList = throttle(async () => {
        const PaginationParams: PaginationParams = { page: pagination.page, limit: pagination.limit }
        const { code, data } = await reqGetRolesList(PaginationParams);
        if (code == 200) {
            rolesList.value = data.roles.map(role => {
                role.created_at = moment(role.created_at).format('YYYY-MM-DD HH:mm:ss')
                role.updated_at = moment(role.updated_at).format('YYYY-MM-DD HH:mm:ss')
                return role
            });
            pagination.total = data.total
            ElMessage({ message: "获取角色数据成功", type: 'success' })
        } else {
            ElMessage({ message: "获取角色数据失败", type: "error" })
        }
    }, 500);

    // 分页控制
    const handleSizeChange = (size: number) => {
        pagination.limit = size;
        getRolesList();
    };

    const handleCurrentChange = (page: number) => {
        pagination.page = page;
        getRolesList();
    };

    // 初始化角色信息
    const initRoleInfo = () => {
        roleInfo.value.roleName = '';
        roleInfo.value.description = '';
    };

    const updateRoleId: Ref<number | null> = ref(null)
    // 编辑角色
    const updateRole = (row: RoleInfo) => {
        dialogTitle.value = '修改角色';
        dialogVisible.value = true;
        updateRoleId.value = row.role_id;
        roleInfo.value.roleName = row.role_name;
        roleInfo.value.description = row.description
        frag.value = 1;
    };


    async function addRoleHandler() {

        const { valid, errors } = await validate(addRoleParamSchema, roleInfo.value)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'error' })
        }
        const { code, ErrorMessage } = await reqAddRole(roleInfo.value)
        if (code == 200) {
            ElMessage({ message: "成功添加角色", type: "success" });
            dialogVisible.value = false;
            getRolesList();
        } else {
            ElMessage({ message: ErrorMessage || "添加失败", type: "error" })
        }
    }
    async function updateRoleHandler() {
        const { valid, errors } = await validate(addRoleParamSchema, roleInfo.value)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'error' })
        }
        if (updateRoleId.value) {
            const { code, ErrorMessage } = await reqUpdateRole(roleInfo.value, updateRoleId.value)
            if (code == 200) {
                ElMessage({ message: "更新角色信息成功", type: "success" });
                dialogVisible.value = false;
                getRolesList();
            } else {
                ElMessage({ message: ErrorMessage || "更新失败", type: "error" })
            }
        } else {
            ElMessage({ message: "角色ID不存在", type: 'warning' })
        }


    }
    // 添加或更新角色
    const confirmUpdateORAddRole = async () => {
        if (frag.value) {
            if (!permissionValidateHandler('role.update')) {
                return false
            }
            updateRoleHandler()
        } else {
            if (!permissionValidateHandler('role.add')) {
                return false
            }
            addRoleHandler()
        }
    };

    // 删除角色
    const removeRole = async (id: number) => {
        const { code, ErrorMessage } = await reqDeleteRole(id);
        if (code == 200) {
            ElMessage({ message: '删除成功', type: 'success' });
            if (rolesList.value.length === 1 && pagination.page !== 1) {
                /* 如果这个是这一页唯一一个那么需要回到上一页 */
                pagination.page--;
            }
            getRolesList();
        } else {
            ElMessage({ message: ErrorMessage || '删除失败', type: 'success' })
        }

    };

    const deleteRole = (row: RoleInfo) => {

        if (!permissionValidateHandler('role.delete')) {
            return false
        }

        try {
            removeRole(row.role_id);
        } catch (e) {


        }
    };

    // 批量删除角色
    const deleteRoleMul = async () => {
        if (!permissionValidateHandler('role.delete')) {
            return false
        }

        const deleteCount = selectRoleIdList.value.length
        if (deleteCount > 0) {
            if (deleteCount === rolesList.value.length && pagination.page !== 1) {
                pagination.page--;
            }
            const { code, ErrorMessage } = await reqDeleteBatchRole({ ids: selectRoleIdList.value })
            if (code == 200) {
                getRolesList()
                ElMessage({ message: '批量删除成功', type: 'success' });
            } else {
                ElMessage({ message: ErrorMessage || '批量删除失败', type: 'error' })
            }
        }
    };

    // 选择角色列表
    const selectionChange = (selection: RoleInfo[]) => {
        selectRoleIdList.value = selection.map(item => item.role_id);
    };

    function recursionPermissionslist(permissionList: rolePermissionType[]): number[] {
        let list: number[] = [];
        function recursion(permissions: rolePermissionType[]) {
            permissions.forEach(permission => {
                if (permission.hasPermission) {
                    list.push(permission.id)
                }
                if (permission.children.length > 0) {
                    recursion(permission.children)
                }
            })
        }
        recursion(permissionList)
        return list
    }

    const permissionList = ref<rolePermissionType[]>([]); // 权限列表，可以根据实际定义
    // 获取角色权限信息
    const getPermissionsByRoleId = async (id: number) => {
        const { code, data, ErrorMessage } = await reqGetRolePermissions(id)
        if (code == 200) {
            permissionList.value = data.permissions;
            hasPermissionIds.value = recursionPermissionslist(permissionList.value)
            ElMessage({ message: '获取权限成功', type: 'success' })
        } else {
            ElMessage({ message: ErrorMessage || "获取权限失败", type: 'warning' })
        }
    };

    // 添加角色
    function addRole() {
        dialogTitle.value = '添加角色'
        dialogVisible.value = true
        frag.value = 0
    }


    // 显示分配角色权限 界面
    async function addPermissionRole(row: RoleInfo) {
        if (!permissionValidateHandler("permission.edit")) {
            return false
        }
        permissionVisible.value = true;
        getPermissionsByRoleId(row.role_id);
        updateRoleId.value = row.role_id
    }


    const hasPermissionIds: Ref<number[]> = ref([])

    const handleCheckChange = (
        data,
        checkedNodes,
    ) => {
        hasPermissionIds.value = checkedNodes.checkedKeys
    }

    // 分配角色权限
    const assignRolePermissions = async (data: PermissionAssignment) => {
        const { code, ErrorMessage } = await reqAssignPermissions(data)
        if (code == 200) {
            ElMessage({ message: '分配权限成功', type: 'success' });
            permissionVisible.value = false;
        } else {
            ElMessage({ message: ErrorMessage || '分配权限失败', type: 'error' })
        }
    };

    // 确认分配权限
    const assignPermissionByRoleId = async () => {
        if (updateRoleId.value) {
            const data: PermissionAssignment = {
                roleId: updateRoleId.value,
                permissionIds: hasPermissionIds.value
            }
            const { valid, errors } = await validate(permissionAssignmentSchema, data)
            if (!valid) {
                return ElMessage({ message: errors[0], type: 'error' })
            }
            assignRolePermissions(data);
        }


    };

    function handleClose() {
        initRoleInfo()
    }

    // 初始化角色权限
    const initRolePermissions = () => {
        updateRoleId.value = null;
        hasPermissionIds.value = [];
        permissionList.value = []

    };

    // 清空搜索条件并刷新角色列表
    const initRolesList = () => {
        roleSearchForm.roleName = '';
        pagination.page = 1;
        pagination.limit = 5;
        getRolesList();
    };

    // 获取角色通过ID搜索
    const getRoleById = async () => {
        if (!permissionValidateHandler('role.search')) {
            return false
        }
        if (roleSearchForm.roleName == '') return
        pagination.page = 1;
        pagination.limit = 1;
        const result = await reqFindRoleByName(roleSearchForm.roleName)
        if (result.code == 200) {
            rolesList.value = [result.data];
            pagination.total = 1;
            ElMessage({ message: "找到了角色", type: "success" })
        } else {
            ElMessage({ message: "无法找到角色", type: "error" })
        }
    };



    onMounted(() => {
        getRolesList();
    });
</script>

<style scoped lang="scss">
    .RoleView-container {
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

        @media screen and (max-width: 768px) {
            width: 100%;
            height: 100%;
            transform-origin: left top;
        }
    }
</style>