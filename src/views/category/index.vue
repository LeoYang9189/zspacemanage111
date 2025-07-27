<template>
  <div class="category-management">
    <!-- 跑马灯提示 -->
    <div class="marquee-container">
      <div class="marquee-content">
        <el-icon class="marquee-icon">
          <InfoFilled />
        </el-icon>
        <span class="marquee-text">您可以在此处自定义设置每个产品大类下的子品类，会同步用于库存维护，并展示在设计严选库的商品筛选页面</span>
      </div>
    </div>

    <el-card class="!border-none mt-4" shadow="never">
      <el-row :gutter="20" class="mb-4">
        <el-col :span="6">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入品类名称"
            clearable
            @keyup.enter="resetPage"
            @clear="resetPage"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="queryParams.parentCategory"
            placeholder="请选择主分类"
            clearable
            @change="resetPage"
          >
            <el-option label="全部" value="" />
            <el-option label="家具" value="家具" />
            <el-option label="灯具" value="灯具" />
            <el-option label="配饰" value="配饰" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            @change="resetPage"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="resetPage">
            <template #icon>
              <el-icon><Search /></el-icon>
            </template>
            搜索
          </el-button>
          <el-button @click="resetParams">重置</el-button>
          <el-button type="primary" @click="handleAdd">
            <template #icon>
              <el-icon><Plus /></el-icon>
            </template>
            新增品类
          </el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        :data="filteredCategoryList"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="品类名称" prop="name" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-icon class="mr-1 text-green-500">
                <Document />
              </el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="归属主分类" prop="parentCategory" width="120">
          <template #default="{ row }">
            <el-tag 
              :type="row.parentCategory === '家具' ? 'primary' : row.parentCategory === '灯具' ? 'success' : 'warning'"
            >
              {{ row.parentCategory }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredCategoryList.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <popup
      ref="popupRef"
      :title="popupTitle"
      :async="true"
      width="500px"
      @confirm="handleSubmit"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="归属主分类" prop="parentCategory">
          <el-select
            v-model="formData.parentCategory"
            placeholder="请选择归属主分类"
          >
            <el-option label="家具" value="家具" />
            <el-option label="灯具" value="灯具" />
            <el-option label="配饰" value="配饰" />
          </el-select>
        </el-form-item>
        <el-form-item label="品类名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入品类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入品类描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Document, InfoFilled } from '@element-plus/icons-vue'
import popup from '@/components/popup/index.vue'

const formRef = ref()
const popupRef = ref()

// 查询参数
const queryParams = reactive({
  name: '',
  parentCategory: '',
  status: ''
})

// 加载状态
const loading = ref(false)

// 分页参数
const currentPage = ref(1)
const pageSize = ref(20)

// Mock数据
const mockCategoryData = ref([
  // 家具类
  { id: 1, name: '沙发', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '椅类', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:31:00' },
  { id: 3, name: '桌类', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:32:00' },
  { id: 4, name: '柜类', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:33:00' },
  { id: 5, name: '床', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:34:00' },
  { id: 6, name: '屏风', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:35:00' },
  { id: 7, name: '置物架', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:36:00' },
  { id: 8, name: '推车', parentCategory: '家具', status: 1, createTime: '2024-01-15 10:37:00' },
  
  // 灯具类
  { id: 9, name: '吊灯', parentCategory: '灯具', status: 1, createTime: '2024-01-15 11:00:00' },
  { id: 10, name: '吸顶灯', parentCategory: '灯具', status: 1, createTime: '2024-01-15 11:01:00' },
  { id: 11, name: '壁灯', parentCategory: '灯具', status: 1, createTime: '2024-01-15 11:02:00' },
  { id: 12, name: '落地灯', parentCategory: '灯具', status: 1, createTime: '2024-01-15 11:03:00' },
  { id: 13, name: '台灯', parentCategory: '灯具', status: 1, createTime: '2024-01-15 11:04:00' },
  
  // 配饰类
  { id: 14, name: '镜子', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:00:00' },
  { id: 15, name: '钟', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:01:00' },
  { id: 16, name: '香薰蜡烛', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:02:00' },
  { id: 17, name: '相框', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:03:00' },
  { id: 18, name: '烟灰缸', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:04:00' },
  { id: 19, name: '摆件', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:05:00' },
  { id: 20, name: '雕塑', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:06:00' },
  { id: 21, name: '地毯', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:07:00' },
  { id: 22, name: '床垫', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:08:00' },
  { id: 23, name: '花瓶花盆', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:09:00' },
  { id: 24, name: '收纳用品', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:10:00' },
  { id: 25, name: '垃圾桶', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:11:00' },
  { id: 26, name: '托盘', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:12:00' },
  { id: 27, name: '挂画', parentCategory: '配饰', status: 1, createTime: '2024-01-15 12:13:00' }
])

// 过滤后的品类列表
const filteredCategoryList = computed(() => {
  let filtered = mockCategoryData.value

  // 按名称筛选
  if (queryParams.name) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(queryParams.name.toLowerCase())
    )
  }

  // 按主分类筛选
  if (queryParams.parentCategory) {
    filtered = filtered.filter(item => 
      item.parentCategory === queryParams.parentCategory
    )
  }

  // 按状态筛选
  if (queryParams.status !== '') {
    filtered = filtered.filter(item => 
      item.status === Number(queryParams.status)
    )
  }

  return filtered
})

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  parentCategory: '家具',
  status: 1,
  description: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入品类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '品类名称长度在1到50个字符', trigger: 'blur' }
  ],
  parentCategory: [
    { required: true, message: '请选择归属主分类', trigger: 'change' }
  ]
}

// 弹窗标题
const popupTitle = ref('')
const mode = ref('add')

// 选中的行
const multipleSelection = ref<any[]>([])

// 分页处理函数
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 重置查询参数
const resetParams = () => {
  Object.assign(queryParams, {
    name: '',
    parentCategory: '',
    status: ''
  })
}

// 重置页面（搜索）
const resetPage = () => {
  currentPage.value = 1
}

// 重置表单
const resetFormData = () => {
  Object.assign(formData, {
    id: '',
    name: '',
    parentCategory: '家具',
    status: 1,
    description: ''
  })
}

// 新增
const handleAdd = () => {
  resetFormData()
  mode.value = 'add'
  popupTitle.value = '新增品类'
  popupRef.value.open()
}

// 编辑
const handleEdit = (row: any) => {
  Object.assign(formData, row)
  mode.value = 'edit'
  popupTitle.value = '编辑品类'
  popupRef.value.open()
}

// 删除
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个品类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 从mock数据中删除
    const index = mockCategoryData.value.findIndex(item => item.id === id)
    if (index > -1) {
      mockCategoryData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    if (mode.value === 'edit') {
      // 编辑
      const index = mockCategoryData.value.findIndex(item => item.id === Number(formData.id))
      if (index > -1) {
        Object.assign(mockCategoryData.value[index], {
          name: formData.name,
          parentCategory: formData.parentCategory,
          status: formData.status,
          description: formData.description
        })
      }
      ElMessage.success('编辑成功')
    } else {
      // 新增
      const newId = Math.max(...mockCategoryData.value.map(item => item.id)) + 1
      mockCategoryData.value.push({
        id: newId,
        name: formData.name,
        parentCategory: formData.parentCategory,
        status: formData.status,
        createTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '-')
      })
      ElMessage.success('新增成功')
    }
    
    popupRef.value.close()
    return true
  } catch (error) {
    return false
  }
}

// 关闭弹窗
const handleClose = () => {
  resetFormData()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection
}
</script>

<style scoped>
.category-management {
  padding: 0;
}

/* 跑马灯样式 */
.marquee-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.15);
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
}

.marquee-icon {
  color: #ffd700;
  font-size: 18px;
  margin-right: 8px;
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

.marquee-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
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
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
</style>