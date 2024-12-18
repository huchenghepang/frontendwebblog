<template>
    <div class="CategoryAdminView-container">
        <!-- 添加按钮 -->
        <el-button class="add-btn" type="primary" @click="showDialog(0)">添加分类</el-button>
        <!-- 添加|或者修改的对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
            <el-form ref="form" :model="categoriesParam" label-width="80px">
                <el-form-item label="分类名" prop="name">
                    <el-input v-model.trim="categoriesParam.name" minlength="4" />
                </el-form-item>
                <el-form-item label="分类级别" prop="level">
                    <el-select v-model="categoriesParam.level" placeholder="选择" size="default" style="width: 240px"
                        @change="changeLevel">
                        <el-option v-for="(item, index) in [1, 2, 3]" :key="index" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="categoriesParam.level !== 1" label="父类" prop="parentId">
                    <template v-if="categoriesParam.level === 2">
                        <el-select v-model="categoriesParam.parentId" placeholder="一级分类" size="small"
                            style="width: 240px">
                            <el-option v-for="item in categoriesList " :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </template>
                    <template v-if="categoriesParam.level === 3">
                        <div>
                            <span>一级分类：</span>
                            <el-select v-model="currentFirstCategoryId" placeholder="一级分类" size="small"
                                style="width: 240px" default-first-option>
                                <el-option v-for="item in categoriesList " :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>

                        </div>
                        <div>
                            <span>二级分类：</span>
                            <el-select v-model="categoriesParam.parentId" placeholder="二级分类" size="small"
                                style="width: 240px">
                                <el-option v-for="item in secondCategory " :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </div>

                    </template>
                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmUpdateORAddCateGory">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 展示分类信息的表格：包含修改和删除按钮 -->
        <el-table row-key="id" border :data="categoriesList" style="width: 100%">
            <el-table-column label="分类ID" width="180">
                <template #default="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类名">
                <template #default="scope">
                    <div>{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="父级ID" width="180">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span style="margin-left: 10px">{{ scope.row.parent_id }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="级别" width="180">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <span style="margin-left: 10px">{{ scope.row.level }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template #default="scope">
                    <el-button icon="Edit" type="default" size="small" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    <el-popconfirm :icon="InfoFilled" title="确定要删除这个吗?" @confirm="handleDelete(scope.row)">
                        <template #reference>
                            <el-button icon="Delete" size="small" type="danger">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" name='CategoryAdminView' setup>
    import { ref } from "vue"
    import { reqGetArticlesCategories } from "@/api/articles";
    import buildTreeFromList from "@/utils/buildTreeFromList";
    import { validate } from "@/schema/validate";
    import { addCategoriesSchema } from "@/schema/category";
    import { reqAddCategory, reqDeleteCategory, reqUpdateCategory } from "@/api/category";
    import { InfoFilled } from '@element-plus/icons-vue'
    import { permissionValidateHandler } from "@/utils/permissionValidate";




    const handleDelete = async (row: CategoryInfo) => {

        if (!permissionValidateHandler('category.delete')) {
            return false
        }

        const id = row.id;
        const { code, ErrorMessage } = await reqDeleteCategory(id)
        if (code == 200) {
            ElMessage({ message: '删除分类成功', type: 'success' });
            getCategoryList()
        } else {
            ElMessage({ message: ErrorMessage || '删除分类失败', type: "error" })
        }
    }



    const categoriesList = ref<CategoryInfo[]>([])

    /* 获取分类的信息 */
    async function getCategoryList() {
        try {
            const { code, ErrorMessage, data } = await reqGetArticlesCategories()
            if (code == 200) {
                const newData = buildTreeFromList(data, 'id', 'parent_id', 'children', 0);
                categoriesList.value = newData;
                ElMessage({ message: "获取数据成功", type: 'success' })
            } else {
                ElMessage({ message: ErrorMessage || '获取数据失败', type: 'error' })
            }
        } catch (error) {
            ElMessage({ message: '获取数据失败', type: 'error' })
        }

    }

    //#region 修改或者添加分类
    /* 添加或者修改类 */
    const dialogVisible = ref(false);
    const titleFrag: Ref<0 | 1> = ref(0); // 0 代表添加 1 代表修改
    const dialogTitle = computed(() => {
        return titleFrag.value ? '更新分类' : "添加分类"
    });

    // 当前选定的一级分类ID获取其对应的，下级二级分类
    const currentFirstCategoryId: Ref<number> = ref(0)
    const secondCategory: Ref<CategoryInfo[]> = ref([]);
    watch(() => currentFirstCategoryId.value, (newValue) => {
        categoriesList.value.forEach(item => {
            if (item.id == newValue) {
                if (item.children) {
                    secondCategory.value = item.children
                }

            }
        })
    })
    const categoriesParam: Ref<CategoryParam> = ref({
        name: '',
        parentId: 0,
        level: 1,
    })


    /* 选择的级别发生变化时 */
    function changeLevel(value: number) {
        if (value === 1) {
            categoriesParam.value.parentId = 0;
        }
    }
    /* 显示对话框 */
    function showDialog(frag: 0 | 1) {
        dialogVisible.value = true;
        titleFrag.value = frag;
    }
    /* 关闭时候的处理 */
    function handleClose() {
        categoriesParam.value = {
            name: '',
            parentId: 0,
            level: 1,
        };

        currentFirstCategoryId.value = 0;
        secondCategory.value = []


    }
    async function getAddCategory() {

        /* 如果当前不是一级分类则 */
        if (categoriesParam.value.level !== 1 && categoriesParam.value.parentId == 0) {
            return ElMessage({ message: "父类没有选择", type: 'warning' })
        }
        const { valid, errors } = await validate(addCategoriesSchema, categoriesParam.value)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' })
        }
        const { code, ErrorMessage } = await reqAddCategory(categoriesParam.value)
        if (code == 200) {
            ElMessage({ message: '添加分类成功', type: 'success' });
            getCategoryList()
            dialogVisible.value = false;

        } else {
            ElMessage({ message: ErrorMessage || '添加分类失败', type: "error" })
        }

    }
    const currentId = ref(0);
    const handleEdit = (row: CategoryInfo) => {
        currentId.value = row.id;
        categoriesParam.value.name = row.name;
        categoriesParam.value.level = row.level;
        categoriesParam.value.parentId = row.parent_id;
        showDialog(1)
    }

    async function updateCategory() {

        /* 如果当前不是一级分类则 */
        if (categoriesParam.value.level !== 1 && categoriesParam.value.parentId == 0) {
            return ElMessage({ message: "父类没有选择", type: 'warning' })
        }
        const { valid, errors } = await validate(addCategoriesSchema, categoriesParam.value)
        if (!valid) {
            return ElMessage({ message: errors[0], type: 'warning' })
        }
        const { code, ErrorMessage } = await reqUpdateCategory(currentId.value, categoriesParam.value)
        if (code == 200) {
            ElMessage({ message: '更新分类成功', type: 'success' });
            getCategoryList()
            dialogVisible.value = false;

        } else {
            ElMessage({ message: ErrorMessage || '更新分类失败', type: "error" })
        }

    }



    function confirmUpdateORAddCateGory() {

        if (titleFrag.value === 0) {
            if (!permissionValidateHandler("category.add")) {
                return false
            }
            getAddCategory()
        } else {
            if (!permissionValidateHandler('category.edit')) {
                return false
            }
            updateCategory()
        }
    }
    //#endregion
    onMounted(() => {
        getCategoryList()
    })
</script>

<style scoped lang="scss">
    .add-btn {
        margin: 10px;
    }
</style>