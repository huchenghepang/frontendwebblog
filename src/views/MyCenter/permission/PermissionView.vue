<template>
    <div class="PermissionView-container">
        <div class="custom-tree-container">
            <el-tree style="max-width: 100%" :data="dataSource" show-checkbox node-key="permission_id"
                default-expand-all :expand-on-click-node="false">
                <template #default="{ node, data }">

                    <span class="custom-tree-node">
                        <template v-if="inputVisible || currentActive !== node.id">
                            <span>{{ data.permission_name }}</span>
                            <span>{{ data.permission_value}}</span>
                            <span>{{ data.description }}</span>
                            <span>{{ data.type }}</span>
                            <span class="right-container">
                                <a class="append-btn btn button" @click="append(node, data)"> 添加 </a>
                                <a class="edit-btn btn button" @click="Edit(node, data)"> 编辑 </a>

                                <el-popconfirm width="220" :icon="InfoFilled" icon-color="#626AEF" title="你确定要删除这个吗"
                                    @confirm="remove(node, data)" @cancel="onCancel">
                                    <template #reference>
                                        <el-button :disabled="!data.can_delete" class="delete-btn btn" size="small"
                                            type="danger" :icon="Delete" />
                                    </template>
                                    <template #actions="{ confirm, cancel }">
                                        <el-button size="small" @click="cancel">不!</el-button>

                                        <el-button type="danger" size="small" :disabled="!data.can_delete"
                                            @click="confirm">
                                            是?
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                            </span>
                        </template>

                        <template v-else-if="!inputVisible && currentActive === node.id">
                            <el-input  v-model="updateForm.permissionName" style="width: 300px;"
                                size="small" />
                            <el-input   v-model="updateForm.permissionValue" style="width: 100px;"
                            size="small" />
                            <el-input  v-model="updateForm.description" style="width: 300px;"
                                size="small" />
                            <el-select v-model="updateForm.type" placeholder="Select" :size="`small`"
                                style="width: 100px;height: 100%;">
                                <el-option v-for="item in ['button', 'route']" :key="item" :label="item"
                                    :value="item" />
                            </el-select>
                            <span class="right-container">
                                <a class="edit-btn btn button" @click="Edit(node, data)"> 取消 </a>
                                <a class="append-btn btn button" @click="handleInputConfirm(node, data)"> 确定 </a>
                            </span>
                        </template>


                    </span>
                </template>
            </el-tree>
        </div>
        <el-dialog v-model="dialogVisible" title="添加权限" width="500"  :lock-scroll="false">
            <el-form :model="addForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="权限名称">
                    <el-input v-model="addForm.permissionName" />
                </el-form-item>
                <el-form-item label="权限值">
                    <el-input v-model="addForm.permissionValue" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="addForm.description" />
                </el-form-item>
                <el-form-item label="权限类型">
                    <el-select v-model="addForm.type" placeholder="选择" :size="`small`">
                        <el-option :disabled="currentData.type == 'button'" label="route" value="route" />
                        <el-option label="button" value="button" />
                    </el-select>
                </el-form-item>

                <el-form-item label="父级权限ID">
                    <el-select v-model="addForm.parentId" placeholder="选择" :size="`small`">
                        <el-option label="同级添加" :value="currentData.parent_id ? currentData.parent_id : 0" />
                        <el-option label="下级添加" :disabled="currentData.type == 'button'"
                            :value="currentData.permission_id" />
                    </el-select></el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelDialog">取消</el-button>
                    <el-button type="primary" @click="submitAddForm">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name='PermissionView' setup>
    import { ref } from 'vue'
    import type Node from 'element-plus/es/components/tree/src/model/node'
    import type { SinglePermission } from '@/types/customResponse';
    import { reqAddPermission, reqDeleteCurrentPermission, reqPermissionsInfo, reqUpdatePermission } from '@/api/permission';
    import { InfoFilled } from '@element-plus/icons-vue'
    import {
        Delete,
    } from '@element-plus/icons-vue';
    import type { PermissionParamData } from '@/types/permission'
    import { validatePermission } from '@/schema/permission';
    import { findParentFieldInDynamicChildren } from '@/utils/findParentFild';
    import { permissionValidateHandler, permissionValidateWrapper } from '@/utils/permissionValidate';

    interface Tree {
        id: number
        label: string
        children?: Tree[]
    }


    const dialogVisible = ref(false);






    const addForm: Ref<PermissionParamData> = ref({
        permissionName: '', // 权限名称
        description: '',    // 描述
        type: '',       // 权限类型
        parentId: null,       // 父节点 ID
        permissionValue:''
    });

    function initData() {
        addForm.value = {
            permissionName: '', // 权限名称
            description: '',    // 描述
            type: '',       // 权限类型
            parentId: null,       // 父节点 ID
        }
    }

    const currentData: Ref<SinglePermission> = ref({})



    const append = (node: Node, data: SinglePermission) => {
        dialogVisible.value = true;
        /* 路由可用添加路由或者按钮 按钮下面不能添加路由 */
        /* 如果当前的按钮权限 */
        currentData.value = data

    }

    function cancelDialog() {
        dialogVisible.value = false
    }

    async function submitAddForm() {

        if (!permissionValidateHandler('permission.add')) {
            return false
        }

        try {
            const { valid, errors } = await validatePermission(addForm.value)
            if (!valid) {
                ElMessage({ message: errors[0], type: "error" });
                return
            }
            const { code } = await reqAddPermission(addForm.value);
            if (code == 200) {
                ElMessage({ message: "添加权限成功", type: "success" });
                dialogVisible.value = false;
                getPermissionsInfo();
                initData()


            } else {
                ElMessage({ message: "添加权限失败", type: "error" })
            }
        } catch (error) {
            ElMessage({ message: "添加权限失败", type: "error" })
        }


    }

    const remove = async (node: Node, data: SinglePermission) => {
        if (!permissionValidateHandler('permission.delete')) {
            return false
        }
        try {
            const { code } = await reqDeleteCurrentPermission(data.permission_id)
            if (code == 200) {
                ElMessage({ message: "删除成功", type: 'success' });
                getPermissionsInfo()
            } else {
                ElMessage({ message: "删除失败", type: "error" })
            }
        } catch (error) {
            ElMessage({ message: "删除失败", type: "error" })
        }

    }
    const currentActive: Ref<number | null> = ref(null)
    function Edit(node: Node, data: SinglePermission) {
        if (!permissionValidateHandler('permission.edit')) {
            return false
        }
        inputVisible.value = !inputVisible.value;
        currentActive.value = node.id;
        updateForm.value = {
            permissionName: data.permission_name,
            description: data.description,
            type: data.type,
            parentId: data.parent_id,
            permissionValue:data.permission_value
        }
    }



    const dataSource: Ref<SinglePermission[]> = ref([]);

    async function getPermissionsInfo() {
        try {
            const { data } = await reqPermissionsInfo();
            dataSource.value = data as SinglePermission[]
        } catch (error) {
            console.log(error);

        }
    }

    const clicked = ref(false)
    function onCancel() {
        clicked.value = true
    }

    const updateForm: Ref<PermissionParamData> = ref({
        permissionName: 'string', // 权限名称
        description: 'string',    // 描述
        type: 'button',       // 权限类型
        parentId: 'string',       // 父节点 ID
    })

    const inputVisible = ref(true)

    async function handleInputConfirm(node: Node, data: SinglePermission) {
        try {
            const { valid, errors } = await validatePermission(updateForm.value)
            if (!valid) {
                ElMessage({ message: errors[0], type: "error" });
                return
            }
            const updateParam = updateForm.value;
            console.log(updateParam);
            console.log(data.permission_id);
            const { code } = await reqUpdatePermission(data.permission_id, updateParam)
            if (code == 200) {
                ElMessage({ message: "更新权限成功", type: "success" });
                inputVisible.value = !inputVisible.value
                getPermissionsInfo()
            } else {
                ElMessage({ message: "更新权限失败", type: "error" })
            };

        } catch (error) {
            ElMessage({ message: "更新权限失败", type: "error" })
        }
    }
    onMounted(() => {
        getPermissionsInfo()
    })




</script>

<style scoped lang="scss">

    .custom-tree-container {
       
    }

    :deep() {
        .el-tree{
            @media screen and (max-width: 768px) {
            .btn{
                padding: 2px;
            }
        }
        }

        .custom-tree-node {
            width: 100%;
            padding: 10px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 1rem;
            padding-right: 8px; 
            overflow: auto;
          
            .btn {
                padding: 0 8px;
                margin: 0 4px;
                background-color: orange;
                border-radius: 50%;
                color: #fafafa;
                box-sizing: border-box;
                user-select: none;
                /* 禁止文本选中 */

                &:hover {
                    background-color: blueviolet;
                    color: #ccc;
                }
            }

            .append-btn {
                background-color: #5294b3;
            }

            .delete-btn {
                background-color: #df3f3f;
            }

        }
    }

</style>