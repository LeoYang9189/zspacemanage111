<template>
  <div>
    <!-- 跑马灯提示 -->
    <div class="marquee-container">
      <div class="marquee-content">
        <el-icon class="marquee-icon">
          <InfoFilled />
        </el-icon>
        <span class="marquee-text">在首页联系我们模块，留下资料的客户的信息，将会显示在此处用于后续跟进</span>
      </div>
    </div>
    
    <el-card class="!border-none mt-4" shadow="never">
      <el-table size="large" v-loading="pager.loading" :data="pager.lists">
        <el-table-column label="联系人" prop="contactName" min-width="100">
        </el-table-column>
        <el-table-column
          label="公司名称"
          prop="corporateName"
          min-width="100"
        />
        <el-table-column label="手机" prop="phone" min-width="100" />
        <el-table-column label="邮箱" prop="email" min-width="100" />
        <el-table-column label="添加时间" prop="createdTime" min-width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link @click="deleteClue(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup name="consumerLists">
import { usePaging } from '@/hooks/usePaging'
import { getProductCategory } from '@/api/app'
import { tryCatch } from '@/utils/util'
import { getClueList, deleteClueApi } from '@/api/clue'
import { ElMessageBox } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()

const queryParams = reactive({
  like: '',
  largeCategory: '',
})
const activeTab = computed(() => queryParams.largeCategory)

const { pager, getLists, resetPage, resetParams } = usePaging({
  fetchFun: getClueList,
  params: queryParams,
})
onActivated(async () => {
  getLists()
})

getLists()

const deleteClue = async (row: any) => {
  await ElMessageBox.confirm('确定删除该线索吗？')
  const [err, res] = await tryCatch(deleteClueApi, { id: row.id })
  if (err) return
  ElMessage.success('删除成功')
  getLists()
}
</script>

<style scoped>
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
