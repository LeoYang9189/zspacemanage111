<template>
  <div class="company-info-page">
    <div class="content-container">
      <!-- 自定义字段区域 -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="section-header">
            <h3>公司信息字段</h3>
            <p>可自定义设置公司相关信息内容</p>
          </div>
        </template>
        
        <div class="custom-fields">
          <div v-for="(field, index) in customFields" :key="index" class="field-item">
            <div class="field-header">
              <span class="field-number">字段{{ index + 1 }}</span>
            </div>
            <div class="field-content">
              <el-form-item label="标题">
                <el-input 
                  v-model="field.title" 
                  placeholder="请输入标题"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="内容">
                <el-input 
                  v-model="field.content" 
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 展厅实景图区域 -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="section-header">
            <h3>展厅实景图</h3>
            <p>最多可以上传9张展厅实景图片</p>
          </div>
        </template>
        
        <div class="gallery-upload">
          <el-upload
            v-model:file-list="galleryImages"
            :action="`${config.baseUrl}/admin/common/upload`"
            list-type="picture-card"
            :on-preview="handleGalleryPreview"
            :on-remove="handleGalleryRemove"
            :before-upload="beforeImageUpload"
            :limit="9"
            :on-exceed="handleGalleryExceed"
          >
            <el-icon class="avatar-uploader-icon">
              <Plus />
            </el-icon>
            <template #tip>
              <div class="el-upload__tip">
                支持 jpg/png 格式，单张图片不超过2MB，最多上传9张
              </div>
            </template>
          </el-upload>
        </div>
      </el-card>

      <!-- 社媒二维码区域 -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="section-header">
            <h3>社媒二维码</h3>
            <p>最多可以添加10个社媒二维码</p>
          </div>
        </template>
        
        <div class="qrcode-section">
          <div v-for="(qrcode, index) in qrcodeList" :key="index" class="qrcode-item">
            <div class="qrcode-header">
              <span class="qrcode-title">二维码{{ index + 1 }}</span>
              <el-button 
                v-if="qrcodeList.length > 1" 
                type="danger" 
                size="small" 
                text
                @click="removeQrcode(index)"
              >
                删除
              </el-button>
            </div>
            <div class="qrcode-content">
              <el-form-item label="二维码名称">
                <el-input 
                  v-model="qrcode.name" 
                  placeholder="请输入二维码名称"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="二维码图片">
                <el-upload
                  v-model:file-list="qrcode.fileList"
                  :action="`${config.baseUrl}/admin/common/upload`"
                  list-type="picture-card"
                  :limit="1"
                  :on-preview="handleQrcodePreview"
                  :before-upload="beforeImageUpload"
                  :on-success="(response) => handleQrcodeSuccess(response, index)"
                >
                  <el-icon class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>
              </el-form-item>
            </div>
          </div>
          
          <div class="add-qrcode" v-if="qrcodeList.length < 10">
            <el-button type="primary" @click="addQrcode" :icon="Plus">
              添加二维码
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 联系信息区域 -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="section-header">
            <h3>联系信息</h3>
            <p>公司联系电话、邮箱和地址信息</p>
          </div>
        </template>
        
        <div class="contact-info">
          <el-form :model="contactInfo" label-width="100px">
            <el-form-item label="联系电话">
              <el-input 
                v-model="contactInfo.phone" 
                placeholder="请输入联系电话"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item label="邮箱地址">
              <el-input 
                v-model="contactInfo.email" 
                placeholder="请输入邮箱地址"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input 
                v-model="contactInfo.address" 
                type="textarea"
                :rows="3"
                placeholder="请输入公司地址"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="handleSave" :loading="saving">
          保存设置
        </el-button>
        <el-button size="large" @click="handleReset">
          重置
        </el-button>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="60%">
      <img :src="previewImageUrl" alt="预览图片" style="width: 100%; height: auto;" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="companyInfo">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import config from '@/config'
import feedback from '@/utils/feedback'

// 自定义字段数据
const customFields = reactive([
  {
    title: '业务范围',
    content: 'ZSPACEPLUS是一家专注集合品牌的渠道运营商，致力于为广大从事进口家居产品销售的伙伴们提供全球进口家具、进口灯具、进口饰品、面料、墙纸、石材、饰面产品等咨询服务；'
  },
  {
    title: '创新服务',
    content: '持续发布世界各地的艺术家居新品，运用现代科技协助客户解决选品难及国际供应链周期长的问题；'
  },
  {
    title: '品牌体验',
    content: '同时ZSPACEPLUS展厅打造集合品牌的沉浸式体验，品味生活，培训教育服务，定制服务，追寻属于自己的LIFESTYLE。'
  },
  {
    title: '',
    content: ''
  }
])

// 展厅实景图
const galleryImages = ref<UploadUserFile[]>([])

// 社媒二维码列表
const qrcodeList = reactive([
  {
    name: '',
    fileList: [] as UploadUserFile[],
    url: ''
  }
])

// 联系信息
const contactInfo = reactive({
  phone: '021-61259481',
  email: 'info@zspaceplus.com',
  address: '上海市嘉定区娄塘路988弄\n慧创园视界南写字楼1号5号1-2层'
})

// 其他状态
const saving = ref(false)
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 图片上传前验证
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!['image/png', 'image/jpeg'].includes(rawFile.type)) {
    ElMessage.error('请上传 PNG 或 JPG 格式的图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

// 展厅图片预览
const handleGalleryPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewImageUrl.value = uploadFile.url!
  previewVisible.value = true
}

// 展厅图片删除
const handleGalleryRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log('删除图片:', uploadFile)
}

// 展厅图片超出限制
const handleGalleryExceed = () => {
  ElMessage.warning('最多只能上传9张展厅实景图')
}

// 二维码图片预览
const handleQrcodePreview: UploadProps['onPreview'] = (uploadFile) => {
  previewImageUrl.value = uploadFile.url!
  previewVisible.value = true
}

// 二维码上传成功
const handleQrcodeSuccess = (response: any, index: number) => {
  qrcodeList[index].url = response.data
}

// 添加二维码
const addQrcode = () => {
  if (qrcodeList.length < 10) {
    qrcodeList.push({
      name: '',
      fileList: [],
      url: ''
    })
  }
}

// 删除二维码
const removeQrcode = (index: number) => {
  ElMessageBox.confirm('确定要删除这个二维码吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    qrcodeList.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 保存设置
const handleSave = async () => {
  saving.value = true
  try {
    // 这里应该调用API保存数据
    // const data = {
    //   customFields: customFields,
    //   galleryImages: galleryImages.value.map(img => img.response?.data || img.url),
    //   qrcodeList: qrcodeList.map(qr => ({
    //     name: qr.name,
    //     url: qr.url
    //   })),
    //   contactInfo: contactInfo
    // }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    feedback.msgSuccess('保存成功')
  } catch (error) {
    feedback.msgError('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 重置设置
const handleReset = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置自定义字段
    customFields[0].title = '业务范围'
    customFields[0].content = 'ZSPACEPLUS是一家专注集合品牌的渠道运营商，致力于为广大从事进口家居产品销售的伙伴们提供全球进口家具、进口灯具、进口饰品、面料、墙纸、石材、饰面产品等咨询服务；'
    customFields[1].title = '创新服务'
    customFields[1].content = '持续发布世界各地的艺术家居新品，运用现代科技协助客户解决选品难及国际供应链周期长的问题；'
    customFields[2].title = '品牌体验'
    customFields[2].content = '同时ZSPACEPLUS展厅打造集合品牌的沉浸式体验，品味生活，培训教育服务，定制服务，追寻属于自己的LIFESTYLE。'
    customFields[3].title = ''
    customFields[3].content = ''
    
    // 重置展厅图片
    galleryImages.value = []
    
    // 重置二维码
    qrcodeList.splice(0, qrcodeList.length, {
      name: '',
      fileList: [],
      url: ''
    })
    
    // 重置联系信息
    contactInfo.phone = '021-61259481'
    contactInfo.email = 'info@zspaceplus.com'
    contactInfo.address = '上海市嘉定区娄塘路988弄\n慧创园视界南写字楼1号5号1-2层'
    
    ElMessage.success('重置成功')
  }).catch(() => {
    // 取消重置
  })
}

// 页面加载时获取数据
onMounted(() => {
  // 这里可以调用API获取已保存的数据
  // loadCompanyInfo()
})
</script>

<style scoped>
.company-info-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-card {
  margin-bottom: 30px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* 自定义字段样式 */
.custom-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
}

.field-item {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafbfc;
}

.field-header {
  margin-bottom: 15px;
}

.field-number {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.field-content .el-form-item {
  margin-bottom: 15px;
}

/* 展厅图片样式 */
.gallery-upload {
  padding: 20px 0;
}

.gallery-upload :deep(.el-upload-list--picture-card) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 15px;
}

/* 二维码样式 */
.qrcode-section {
  padding: 20px 0;
}

.qrcode-item {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fafbfc;
}

.qrcode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.qrcode-title {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.qrcode-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: start;
}

.add-qrcode {
  text-align: center;
  padding: 20px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
}

/* 联系信息样式 */
.contact-info {
  padding: 20px 0;
}

.contact-info .el-form-item {
  margin-bottom: 20px;
}

/* 操作按钮样式 */
.action-buttons {
  text-align: center;
  padding: 30px 0;
}

.action-buttons .el-button {
  margin: 0 10px;
  padding: 12px 30px;
  font-size: 1rem;
}

/* 上传组件样式 */
:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
  transition: all 0.3s ease;
}

:deep(.el-upload--picture-card:hover) {
  border-color: #667eea;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-info-page {
    padding: 10px;
  }
  
  .custom-fields {
    grid-template-columns: 1fr;
  }
  
  .qrcode-content {
    grid-template-columns: 1fr;
  }
  
  .field-item,
  .qrcode-item {
    padding: 15px;
  }
}
</style>