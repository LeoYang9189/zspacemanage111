<template>
  <div class="tag-management">
    <!-- 跑马灯提示 -->
    <div class="marquee-container">
      <div class="marquee-content">
        <el-icon class="marquee-icon">
          <InfoFilled />
        </el-icon>
        <span class="marquee-text">您可以在此页面配置可用于商品大类的标签，从而在维护商品信息的时候，可以选择多个标签，最终在设计严选库呈现</span>
      </div>
    </div>
    
    <el-card class="!border-none mt-4" shadow="never">
      <el-row :gutter="20" class="mb-4">
        <el-col :span="4">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入标签名称"
            clearable
            @keyup.enter="resetPage"
            @clear="resetPage"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="queryParams.category"
            placeholder="请选择适用大类"
            clearable
            @change="resetPage"
          >
            <el-option label="家具" value="家具" />
            <el-option label="灯具" value="灯具" />
            <el-option label="配饰" value="配饰" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择标签类型"
            clearable
            @change="resetPage"
          >
            <el-option label="功能标签" value="功能标签" />
            <el-option label="搭配标签" value="搭配标签" />
          </el-select>
        </el-col>
        <el-col :span="4">
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
        <el-col :span="8">
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
            新增标签
          </el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="pager.loading"
        :data="filteredTagList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="标签名称" prop="name" min-width="120" />
        <el-table-column label="标签颜色" prop="color" width="100">
          <template #default="{ row }">
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded mr-2"
                :style="{ backgroundColor: row.color }"
              ></div>
              <span>{{ row.color }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签类型" prop="type" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '功能标签' ? 'primary' : 'success'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="适用大类" prop="category" width="150">
          <template #default="{ row }">
            <template v-if="Array.isArray(row.category)">
              <el-tag 
                v-for="cat in row.category" 
                :key="cat" 
                type="info" 
                class="mr-1 mb-1"
                size="small"
              >
                {{ cat }}
              </el-tag>
            </template>
            <el-tag v-else type="info">{{ row.category }}</el-tag>
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
        <el-table-column label="操作" width="160" fixed="right">
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
        <pagination v-model="pager" @change="getLists" />
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
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入标签名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标签颜色" prop="color">
          <el-color-picker v-model="formData.color" />
        </el-form-item>
        <el-form-item label="标签类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择标签类型"
          >
            <el-option label="功能标签" value="功能标签" />
            <el-option label="搭配标签" value="搭配标签" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用大类" prop="category">
          <el-select
            v-model="formData.category"
            placeholder="请选择适用大类"
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option label="家具" value="家具" />
            <el-option label="灯具" value="灯具" />
            <el-option label="配饰" value="配饰" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, InfoFilled } from '@element-plus/icons-vue'
import { usePaging } from '@/hooks/usePaging'
import { getTagList, addTag, editTag, deleteTag } from '@/api/tag'
import popup from '@/components/popup/index.vue'
import pagination from '@/components/pagination/index.vue'

const formRef = ref()
const popupRef = ref()

// 查询参数
const queryParams = reactive({
  name: '',
  category: '',
  type: '',
  status: ''
})

// Mock数据
const mockTagList = ref([
  // 功能标签 - 蓝色
  { id: 1, name: '室内款', color: '#409EFF', type: '功能标签', category: ['家具'], status: 1, createTime: '2024-01-01 10:00:00' },
  { id: 2, name: '可户外', color: '#409EFF', type: '功能标签', category: ['家具', '配饰'], status: 1, createTime: '2024-01-01 10:05:00' },
  { id: 3, name: '充电便携', color: '#409EFF', type: '功能标签', category: ['灯具'], status: 1, createTime: '2024-01-01 10:10:00' },
  { id: 4, name: '带灯光', color: '#409EFF', type: '功能标签', category: ['配饰'], status: 1, createTime: '2024-01-01 10:15:00' },
  // 搭配标签 - 绿色
  { id: 5, name: '挑空区', color: '#67C23A', type: '搭配标签', category: ['家具'], status: 1, createTime: '2024-01-01 10:20:00' },
  { id: 6, name: '楼梯区', color: '#67C23A', type: '搭配标签', category: ['家具'], status: 1, createTime: '2024-01-01 10:25:00' },
  { id: 7, name: '客厅区', color: '#67C23A', type: '搭配标签', category: ['家具', '灯具'], status: 1, createTime: '2024-01-01 10:30:00' },
  { id: 8, name: '餐厅区', color: '#67C23A', type: '搭配标签', category: ['家具'], status: 1, createTime: '2024-01-01 10:35:00' },
  { id: 9, name: '卧室区', color: '#67C23A', type: '搭配标签', category: ['家具', '灯具', '配饰'], status: 1, createTime: '2024-01-01 10:40:00' },
  { id: 10, name: '吧台区', color: '#67C23A', type: '搭配标签', category: ['配饰'], status: 1, createTime: '2024-01-01 10:45:00' },
  { id: 11, name: '户外区', color: '#67C23A', type: '搭配标签', category: ['家具'], status: 1, createTime: '2024-01-01 10:50:00' }
])

// 筛选后的标签列表
const filteredTagList = computed(() => {
  return mockTagList.value.filter(tag => {
    const nameMatch = !queryParams.name || tag.name.includes(queryParams.name)
    const categoryMatch = !queryParams.category || (Array.isArray(tag.category) ? tag.category.includes(queryParams.category) : tag.category === queryParams.category)
    const typeMatch = !queryParams.type || tag.type === queryParams.type
    const statusMatch = queryParams.status === '' || tag.status === Number(queryParams.status)
    return nameMatch && categoryMatch && typeMatch && statusMatch
  })
})

// 分页数据
const { pager, getLists, resetPage, resetParams } = usePaging({
  fetchFun: getTagList,
  params: queryParams
})

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  color: '#409EFF',
  type: '功能标签',
  category: ['家具'],
  status: 1
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 20, message: '标签名称长度在1到20个字符', trigger: 'blur' }
  ],
  color: [
    { required: true, message: '请选择标签颜色', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择标签类型', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择适用大类', trigger: 'change' }
  ]
}

// 弹窗标题
const popupTitle = ref('')
const mode = ref('add')

// 选中的行
const multipleSelection = ref<any[]>([])

// 获取列表数据
getLists()

// 重置表单
const resetFormData = () => {
  Object.assign(formData, {
    id: '',
    name: '',
    color: '#409EFF',
    type: '功能标签',
    category: ['家具'],
    status: 1
  })
}

// 新增
const handleAdd = () => {
  mode.value = 'add'
  popupTitle.value = '新增标签'
  resetFormData()
  popupRef.value?.open()
}

// 编辑
const handleEdit = (row: any) => {
  mode.value = 'edit'
  popupTitle.value = '编辑标签'
  Object.assign(formData, row)
  popupRef.value?.open()
}

// 删除
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个标签吗？', '提示', {
      type: 'warning'
    })
    await deleteTag({ id })
    ElMessage.success('删除成功')
    getLists()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 批量选择
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    if (mode.value === 'add') {
      await addTag(formData)
      ElMessage.success('新增成功')
    } else {
      await editTag(formData)
      ElMessage.success('编辑成功')
    }
    
    popupRef.value?.close()
    getLists()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('操作失败')
  }
}

// 关闭弹窗
const handleClose = () => {
  formRef.value?.resetFields()
  resetFormData()
}
</script>

<style lang="scss" scoped>
.tag-management {
  padding: 20px;
}

/* 跑马灯样式 */
.marquee-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  animation: marquee 20s linear infinite, pulse 2s ease-in-out infinite alternate;
}

.marquee-icon {
  font-size: 18px;
  color: #ffd700;
  animation: pulse 2s ease-in-out infinite alternate;
}

.marquee-text {
  white-space: nowrap;
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