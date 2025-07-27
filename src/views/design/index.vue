<template>
  <div>
    <!-- 跑马灯提示 -->
    <div class="marquee-tip-container">
      <div class="marquee-tip-content">
        <el-icon class="marquee-tip-icon">
          <InfoFilled />
        </el-icon>
        <div class="marquee-tip-text">此处用于设置首页的设计严选模块中的轮播图和对应的文字</div>
      </div>
    </div>
    
    <el-card class="!border-none mt-4" shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          <span>新增轮播图</span>
        </el-button>
      </div>
      <div class="container">
        <el-row :gutter="30">
          <el-col v-for="(designItem, index) in designData" :key="designItem.id" :span="8">
            <el-card class="design-card">
              <div class="design-image-wrapper">
                <img :src="designItem.image" :alt="designItem.productName" class="design-image">
                <div class="image-overlay">
                  <div class="action-buttons">
                    <el-icon class="action-icon" @click="handlePreview(designItem.image)">
                      <View />
                    </el-icon>
                    <el-icon class="action-icon" @click="handleEdit(designItem)">
                      <Edit />
                    </el-icon>
                    <el-icon class="action-icon delete" @click="handleDelete(designItem.id)">
                      <Delete />
                    </el-icon>
                  </div>
                </div>
              </div>
              <div class="design-info">
                <div class="design-header">
                  <div class="design-sort">
                    <div class="sort-actions">
                      <el-icon class="sort-icon" :class="{ 'disabled': index === designData.length - 1 }"
                        @click="handleMoveDown(index)">
                        <SortDown />
                      </el-icon>
                      <el-icon class="sort-icon" :class="{ 'disabled': index === 0 }" @click="handleMoveUp(index)">
                        <SortUp />
                      </el-icon>
                    </div>
                    <span class="sort-text">排序: {{ designItem.sort }}</span>
                  </div>
                  <el-switch v-model="designItem.status" active-text="已上架" inactive-text="已下架" inline-prompt
                     active-color="#13ce66" inactive-color="#ff4949" class="design-status-switch"
                     @change="handleStatusChange(designItem)" />
                </div>
                <div class="design-editor">
                  <span>最后编辑: {{ designItem.updateUser }}</span>
                  <span class="edit-time">{{ designItem.updateTime }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 新增轮播图弹框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增轮播图' : '编辑轮播图'" width="500px"
      :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="图片">
          <el-upload class="design-uploader" :action="`${config.baseUrl}/admin/common/upload`" :show-file-list="false"
            :on-success="handleUploadSuccess" accept="image/*">
            <img v-if="formData.image" :src="formData.image" class="upload-preview" />
            <el-icon v-else class="upload-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="formData.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="formData.brand" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="设计师">
          <el-input v-model="formData.designer" placeholder="请输入设计师名称" />
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

<script lang="ts" setup name="designSelection">
import dayjs from 'dayjs'
import type { UploadProps } from 'element-plus'
import { cloneDeep } from 'lodash';
import { getRoutePath } from '@/router'
import useUserStore from '@/stores/modules/user'
import { getPageConfiguration, savePageConfiguration } from '@/api/stock'
import { tryCatch } from "@/utils/util";
import { SortUp, SortDown, View, Edit, Delete, Plus, InfoFilled } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import config from '@/config'

// 导入示例图片
import img1 from '@/assets/images/111.png'
import img2 from '@/assets/images/222.png'
import img3 from '@/assets/images/333.png'

interface DesignItem {
  id: number
  productName: string
  brand: string
  designer: string
  image: string
  sort: number
  status: boolean
  createTime: string
  updateTime: string
  createUser: string
  updateUser: string
}

const temp: DesignItem = {
  id: 0,
  productName: '',
  brand: '',
  designer: '',
  image: '',
  sort: 0,
  status: true,
  createTime: '',
  updateTime: '',
  createUser: '',
  updateUser: ''
}

const userStore = useUserStore()
const designData = ref<DesignItem[]>([
  {
    id: 1,
    productName: '创意兔子摆件',
    brand: '北欧风尚',
    designer: '张艺凡',
    image: img1,
    sort: 1,
    status: true,
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00',
    createUser: 'admin',
    updateUser: 'admin'
  },
  {
    id: 2,
    productName: '现代简约吊灯',
    brand: '极简生活',
    designer: '李明轩',
    image: img2,
    sort: 2,
    status: true,
    createTime: '2024-01-16 14:20:00',
    updateTime: '2024-01-16 14:20:00',
    createUser: 'admin',
    updateUser: 'admin'
  },
  {
    id: 3,
    productName: '绿色大猩猩雕塑',
    brand: '艺术空间',
    designer: '王思雨',
    image: img3,
    sort: 3,
    status: false,
    createTime: '2024-01-17 09:15:00',
    updateTime: '2024-01-17 09:15:00',
    createUser: 'admin',
    updateUser: 'admin'
  }
])
const dialogVisible = ref(false)
const formData = ref<DesignItem>({ ...temp })
const dialogType = ref<'add' | 'edit'>('add')
const editIndex = ref(-1)

const getDesignData = async () => {
  const [err, res] = await tryCatch(getPageConfiguration, {
    pageCode: 'DesignSelection'
  })
  // 只有当API返回有效数据时才更新，否则保留示例数据
  if (!err && res && Array.isArray(res) && res.length > 0) {
    designData.value = res
  }
  // 如果API返回空数据或出错，保留当前的示例数据
}
getDesignData()

const saveDesign = async () => {
  const [err, res] = await tryCatch(savePageConfiguration, designData.value)
}

// 向上移动排序
const handleMoveUp = (index: number) => {
  if (index > 0) {
    const temp = { ...designData.value[index] }
    designData.value[index] = { ...designData.value[index - 1] }
    designData.value[index - 1] = temp
    saveDesign()
  }
}

// 向下移动排序
const handleMoveDown = (index: number) => {
  if (index < designData.value.length - 1) {
    const temp = { ...designData.value[index] }
    designData.value[index] = { ...designData.value[index + 1] }
    designData.value[index + 1] = temp
    saveDesign()
  }
}

// 修改状态
const handleStatusChange = (item: DesignItem) => {
  const statusText = item.status ? '已上架' : '已下架'
  ElMessage.success(`状态已更新为${statusText}`)
  saveDesign()
}

// 预览图片
const handlePreview = (url: string) => {
  window.open(url, '_blank')
}

// 编辑设计
const handleEdit = (item: DesignItem) => {
  editIndex.value = designData.value.findIndex(d => d.id === item.id)
  dialogType.value = 'edit'
  dialogVisible.value = true
  formData.value = { ...item }
}

// 删除设计
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该设计作品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const index = designData.value.findIndex(item => item.id === id)
    if (index > -1) {
      designData.value.splice(index, 1)
      saveDesign()
      ElMessage.success('删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 排序变更
const handleSortChange = (item: DesignItem) => {
  ElMessage.success('排序已更新')
  saveDesign()
}

// 图片上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
  console.log(response)
  formData.value.image = response.data
}

// 打开新增弹框
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = { ...temp }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  const obj = {
    ...formData.value,
    updateUser: userStore.userInfo.username,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  if (dialogType.value === 'add') {
    obj.id = Date.now() // 生成唯一ID
    obj.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    obj.createUser = userStore.userInfo.username
    obj.sort = designData.value.length + 1
    designData.value.push(obj)
  } else {
    designData.value[editIndex.value] = obj
  }
  saveDesign()
  dialogVisible.value = false
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
}

.design-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.design-uploader:hover {
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

.design-card {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.design-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.design-image-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  background-color: #f8f9fa;
  overflow: hidden;
}

.design-image {
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

.design-image-wrapper:hover .image-overlay {
  opacity: 1;
}

.design-image-wrapper:hover .design-image {
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

.design-info {
  padding: 16px 20px;
}

.design-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.design-sort {
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

.design-editor {
  font-size: 13px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-time {
  color: #999;
}

.design-status-switch {
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
.marquee-tip-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  overflow: hidden;
  position: relative;
}

.marquee-tip-content {
  display: flex;
  align-items: center;
  animation: marquee 20s linear infinite, pulse 2s ease-in-out infinite alternate;
  white-space: nowrap;
}

.marquee-tip-icon {
  color: #ffd700;
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

.marquee-tip-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
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
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>