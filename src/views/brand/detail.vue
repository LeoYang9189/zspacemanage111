<template>
  <div v-if="form" class="brand-detail-page">
    <el-card class="brand-card">
      <el-form :model="form" ref="formRef" label-width="110px" class="brand-form">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="品牌名称" required>
              <el-input v-model="form.brandName" maxlength="50" show-word-limit placeholder="请输入品牌名称" />
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="form.subProductName" maxlength="35" show-word-limit placeholder="请输入标题，最多35个字符" />
            </el-form-item>
            <el-form-item label="品牌介绍">
              <el-input v-model="form.brandBlurb" type="textarea" maxlength="150" show-word-limit
                :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入品牌介绍，最多150个字符" />
            </el-form-item>
            <el-form-item label="图册链接">
              <el-input v-model="form.albumLink" placeholder="请输入完整的网址，例如：https://www.example.com" />
            </el-form-item>
            <el-form-item label="品牌官网链接">
              <el-input v-model="form.officialWebsiteLink" placeholder="请输入完整的网址，例如：https://www.example.com" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="product-content-section">
      <div class="section-header">
        <span class="section-title">品牌内容</span>
      </div>
      <el-divider />
      <div class="content-editor-block">
        <div class="content-editor-title">品牌详细内容</div>
        <editor v-model="form.content" :height="400" />
        <div class="content-editor-tip">
          <el-icon>
            <InfoFilled />
          </el-icon>
          支持富文本编辑，可插入图片、设置文字格式等
        </div>
      </div>
    </el-card>

    <!-- 吸底操作栏 -->
    <div class="footer-bar">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import { getBrandDetail, saveBrand } from '@/api/brand'
import useAppStore from '@/stores/modules/app'
import editor from '@/components/editor/index.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const config = appStore.config

const formRef = ref()
const form = ref({
  brandName: '',
  subProductName: '',
  brandBlurb: '',
  albumLink: '',
  officialWebsiteLink: '',
  content: ''
})

const isEdit = ref(false)
const brandId = ref('')

onMounted(() => {
  const routeId = route.params.id as string
  const queryId = route.query.id as string
  const type = route.query.type as string
  
  // 如果是新增模式
  if (routeId === 'add' || type === 'add') {
    isEdit.value = false
    brandId.value = ''
  } else {
    // 编辑模式，优先使用params中的id，然后是query中的id
    brandId.value = routeId || queryId
    if (brandId.value) {
      isEdit.value = true
      getBrandDetailData()
    }
  }
})

const getBrandDetailData = async () => {
  try {
    const { data } = await getBrandDetail(brandId.value)
    if (data) {
      form.value = {
        brandName: data.brandName || '',
        subProductName: data.subProductName || '',
        brandBlurb: data.brandBlurb || '',
        albumLink: data.albumLink || '',
        officialWebsiteLink: data.officialWebsiteLink || '',
        content: data.content || ''
      }
    }
  } catch (error) {
    console.error('获取品牌详情失败:', error)
    ElMessage.error('获取品牌详情失败')
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const params = {
      ...form.value,
      id: isEdit.value ? brandId.value : undefined
    }
    
    await saveBrand(params)
    ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
    router.back()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.brand-detail-page {
  padding: 32px 0 120px 0;
  /* 底部留白，防止被footer遮挡 */
  background: #f5f6fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand-card,
.product-content-section {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.07);
  background: #fff;
  border: none;
  padding: 0;
  transition: box-shadow 0.2s;
}

.brand-card:hover,
.product-content-section:hover {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.13);
}

.brand-form {
  padding: 32px 32px 0 32px;
}

.product-content-section {
  padding: 0 32px 32px 32px;
}

.section-header {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 8px 0;
  padding-top: 28px;
  letter-spacing: 1px;
}

.section-title {
  margin-right: 14px;
}

.content-editor-block {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 28px;
  margin-top: 18px;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.03);
  border: 1.5px dashed #e5e6eb;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.content-editor-block:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
  border-color: #409eff;
}

.content-editor-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
}

.content-editor-tip {
  color: #909399;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
}

.footer-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  background: #fff;
  box-shadow: 0 -2px 16px 0 rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 16px 48px 16px 0;
  z-index: 100;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 900px) {
  .footer-bar {
    padding-right: 16px;
    padding-left: 0;
  }
}
</style>
