<template>
    <div>
        <!-- 跑马灯提示 -->
        <div class="marquee-tip">
            <div class="marquee-content">
                <el-icon class="marquee-icon">
                    <InfoFilled />
                </el-icon>
                <span class="marquee-text">此处用于给公司员工开设管理后台的登录账号密码，可以用于登录此后台管理系统</span>
            </div>
        </div>
        
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="用户信息">
                    <el-input class="w-[280px]" v-model="queryParams.phone" placeholder="用户名/姓名/手机号码" clearable
                        @keyup.enter="resetPage" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="ID" prop="id" min-width="50" />
                <el-table-column label="用户名" prop="username" min-width="100" />
                <el-table-column label="姓名" prop="nickname" min-width="120" />
                <el-table-column label="手机号码" prop="phone" min-width="100" />
                <el-table-column label="邮箱" prop="email" min-width="100" />
                <el-table-column label="角色" prop="userRole" min-width="100" />
                <el-table-column label="创建时间" prop="createdTime" min-width="120" />
                <el-table-column label="状态" prop="enableFlag" min-width="100">
                  <template #default="{ row }">
                    <el-switch v-model="row.enableFlag" active-text="启用" inactive-text="禁用" inline-prompt />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['user:detail']" type="primary" link>
                            <router-link :to="{
                                path: getRoutePath('manager:detail'),
                                query: {
                                    id: row.id
                                }
                            }">
                                详情
                            </router-link>
                        </el-button>
                        <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
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
import { InfoFilled } from '@element-plus/icons-vue'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'
import { getManagerList, managerDelete } from '@/api/manager'
import { tryCatch } from '@/utils/util'
import feedback from '@/utils/feedback'
const queryParams = reactive({
    backendUserFlag: 'true',
    username: '',
    nickname: '',
    phone: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getManagerList,
    params: queryParams
})
onActivated(() => {
    getLists()
})

getLists()

const handleDelete = async (id: string) => {
    await feedback.confirm('确定删除该用户吗？')

    const [err, res] = await tryCatch(managerDelete, {
        id
    })
    if (err) return
    feedback.msgSuccess(res.message)
    getLists()
}
</script>

<style scoped>
.marquee-tip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  position: relative;
  animation: pulse 3s ease-in-out infinite;
}

.marquee-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: marquee 22s linear infinite;
}

.marquee-icon {
  color: #ffd700;
  font-size: 18px;
  margin-right: 12px;
  animation: pulse 2s ease-in-out infinite;
}

.marquee-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
    opacity: 0.9;
    transform: scale(1.02);
  }
}
</style>
