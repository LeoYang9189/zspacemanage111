<template>
  <div>
    <!-- 跑马灯提示语 -->
    <div class="marquee-container">
      <div class="marquee-content">
        <el-icon class="marquee-icon"><InfoFilled /></el-icon>
        <span class="marquee-text">此处用于维护首页顶部轮播的Banner图，点击箭头可以更改顺序，点击编辑图标可以更改标语文字</span>
      </div>
    </div>
    
    <el-card class="!border-none mt-4" shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          <span>新增 Banner</span>
        </el-button>
      </div>
      <div class="container">
        <el-row :gutter="30">
          <el-col v-for="(bannerItem, index) in bannerData" :key="index" :span="8">
            <el-card class="banner-card">
              <div class="banner-image-wrapper">
                <img :src="bannerItem.coverImage" alt="Banner" class="banner-image">
                <div class="image-overlay">
                  <div class="action-buttons">
                    <el-icon class="action-icon" @click="handlePreview(bannerItem.coverImage)">
                      <View />
                    </el-icon>
                    <el-icon class="action-icon" @click="handleEdit(index)">
                      <Edit />
                    </el-icon>
                    <el-icon class="action-icon delete" @click="handleDelete(index)">
                      <Delete />
                    </el-icon>
                  </div>
                </div>
              </div>
              <div class="banner-info">
                <div class="banner-header">
                  <div class="banner-sort">
                    <div class="sort-actions">
                      <el-icon class="sort-icon" :class="{ 'disabled': index === bannerData.length - 1 }"
                        @click="handleMoveDown(index)">
                        <SortDown />
                      </el-icon>
                      <el-icon class="sort-icon" :class="{ 'disabled': index === 0 }" @click="handleMoveUp(index)">
                        <SortUp />
                      </el-icon>
                    </div>
                    <span class="sort-text">排序: {{ bannerItem.sort }}</span>
                  </div>
                  <el-switch v-model="bannerItem.effectiveFlag" active-text="已上架" inactive-text="已下架" inline-prompt
                    active-color="#13ce66" inactive-color="#ff4949" class="banner-status-switch"
                    @change="handleStatusChange(index)" />
                </div>
                <div class="banner-editor">
                  <span>最后编辑: {{ bannerItem.updatedName }}</span>
                  <span class="edit-time">{{ bannerItem.updatedTime }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 新增 Banner 弹框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增 Banner' : '编辑 Banner'" width="500px"
      :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="图片">
          <el-upload class="banner-uploader" :action="`${config.baseUrl}/admin/common/upload`" :show-file-list="false"
            :on-success="handleUploadSuccess" accept="image/*">
            <img v-if="formData.coverImage" :src="formData.coverImage" class="upload-preview" />
            <el-icon v-else class="upload-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题1">
          <el-input v-model="formData.title1" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="标题2">
          <el-input v-model="formData.title2" placeholder="请输入标题2" />
        </el-form-item>
        <el-form-item label="标题3">
          <el-input v-model="formData.title3" placeholder="请输入标题3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="consumerLists">
import dayjs from 'dayjs'
import type { UploadProps } from 'element-plus'
import { cloneDeep } from 'lodash';
import { getRoutePath } from '@/router'
import useUserStore from '@/stores/modules/user'
import { getPageConfiguration, savePageConfiguration } from '@/api/stock'
import { tryCatch } from "@/utils/util";
import { SortUp, SortDown, View, Edit, Delete, Plus, InfoFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import config from '@/config'

const temp = {
  coverImage: '',
  title1: '',
  title2: '',
  title3: '',
  sort: -1,
  effectiveFlag: false,
  updatedName: '',
  updatedTime: ''
}

const userStore = useUserStore()
const bannerData = ref([])
const dialogVisible = ref(false)
const formData = ref(temp)
const dialogType = ref('add')
const editIndex = ref(-1)
const getBannerData = async () => {
  const [err, res] = await tryCatch(getPageConfiguration, {
    pageCode: 'Banner'
  })
  if (err) return
  bannerData.value = res
}
getBannerData()

const saveBanner = async () => {
  const [err, res] = await tryCatch(savePageConfiguration, bannerData.value)
}

// 向上移动排序
const handleMoveUp = (index: number) => {
  if (index > 0) {
    const temp = { ...bannerData.value[index] }
    bannerData.value[index] = { ...bannerData.value[index - 1] }
    bannerData.value[index - 1] = temp
    // 这里可以调用后端API更新排序
    saveBanner()
  }
}

// 向下移动排序
const handleMoveDown = (index: number) => {
  if (index < bannerData.value.length - 1) {
    const temp = { ...bannerData.value[index] }
    bannerData.value[index] = { ...bannerData.value[index + 1] }
    bannerData.value[index + 1] = temp
    // 这里可以调用后端API更新排序
    saveBanner()
  }
}

// 修改状态
const handleStatusChange = (index: number) => {
  saveBanner()
}

// 预览图片
const handlePreview = (url: string) => {
  window.open(url, '_blank')
}

// 编辑banner
const handleEdit = (index: number) => {
  editIndex.value = index
  dialogType.value = 'edit'
  dialogVisible.value = true
  formData.value = { ...temp, ...bannerData.value[index] }
}

// 删除banner
const handleDelete = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该banner吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // 这里可以调用删除API
    bannerData.value.splice(index, 1)
    saveBanner()
  } catch (error) {
    // 用户取消删除
  }
}

// 图片上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
  console.log(response)
  formData.value.coverImage = response.data // 假设返回的数据中有 url 字段
}

// 打开新增弹框
const handleAdd = () => {
  dialogVisible.value = true
  formData.value = { ...temp, sort: bannerData.value.length + 1 }
}

// 提交表单
const handleSubmit = async () => {
  // 这里可以添加表单验证
  const obj = {
    ...formData.value,
    updatedName: userStore.userInfo.username,
    updatedTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  // 调用新增 API
  if (dialogType.value === 'add') {
    bannerData.value.push(obj)
  } else {
    bannerData.value[editIndex.value] = obj
  }
  saveBanner()
  dialogVisible.value = false
}




</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
}

.banner-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.banner-uploader:hover {
  border-color: var(--el-color-primary);
}

.upload-preview {
  width: 200px;
  height: 120px;
  object-fit: cover;
  display: block;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-upload) {
  width: 200px;
}

.container {
  padding: 24px;
}

.banner-card {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.banner-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.banner-image-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  background-color: #f8f9fa;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.banner-image-wrapper:hover .image-overlay {
  opacity: 1;
}

.banner-image-wrapper:hover .banner-image {
  transform: scale(1.05);
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-icon {
  cursor: pointer;
  font-size: 18px;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.action-icon.delete:hover {
  background: rgba(245, 108, 108, 0.7);
}

.banner-info {
  padding: 16px 20px;
}

.banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.banner-sort {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.sort-actions {
  display: flex;
  gap: 4px;
}

.sort-icon {
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: #409EFF;
  font-size: 16px;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-icon:hover {
  background-color: #ecf5ff;
  transform: scale(1.1);
}

.sort-icon.disabled {
  cursor: not-allowed;
  color: #C0C4CC;
  transform: none;
}

.sort-icon.disabled:hover {
  background-color: transparent;
  transform: none;
}

.sort-text {
  font-size: 14px;
  color: #606266;
  margin-left: 4px;
}

.banner-editor {
  font-size: 13px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-time {
  color: #999;
}

.banner-status-switch {
  :deep(.el-switch__label) {
    color: #666;
  }
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
}

:deep(.el-switch__core) {
  border-color: var(--el-color-danger);
  background-color: var(--el-color-danger);
}

/* 跑马灯样式 */
.marquee-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  border: 2px solid #667eea;
}

.marquee-content {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  animation: marquee 20s linear infinite;
  white-space: nowrap;
}

.marquee-icon {
  font-size: 18px;
  margin-right: 10px;
  color: #ffd700;
  animation: pulse 2s ease-in-out infinite;
}

.marquee-text {
  letter-spacing: 0.5px;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}
</style>