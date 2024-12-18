<template>
    <el-upload
      
        ref="uploadRef"
        class="upload-demo"
        :action="uploadURL"
        :auto-upload="false"
        :multiple="true"
        :limit="10"
        name="images"
        :disabled="isAllowUploadImage"
        
        list-type="picture"
        accept="image/jpeg,image/jpeg,image/png"
    >
        <template #trigger>
            <el-button type="primary" size="small" :disabled="isAllowUploadImage">选择文件</el-button>
        </template>
  
        <el-button type="success" size="small" @click="submitUpload" :disabled="isAllowUploadImage" >
            点击上传
        </el-button>
  
        <template #tip>
            <div class="el-upload__tip">
                jpg/png 格式文件 并且不要超过10MB 并且手动提前提交
            </div>
        </template>
    </el-upload>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadInstance } from 'element-plus'
import { permissionValidateHandler } from '@/utils/permissionValidate';
import { config } from '@/config/config';
  
const uploadRef = ref<UploadInstance>();

const uploadURL = config.uploadUrl;
  
const submitUpload = () => {
    uploadRef.value!.submit()
}

const isAllowUploadImage = computed(
    ()=>{
        return !permissionValidateHandler('center.uploadimage')
    }
)


</script>

  <style lang="scss" scoped>
    .upload-demo{
      margin: 0 0;
      width: 500px;
      height: 40px;
      text-align: center;
    }
  </style>