<template>
    <div>
        <!-- 跑马灯提示语 -->
        <div class="marquee-container">
            <div class="marquee-content">
                <el-icon class="marquee-icon"><InfoFilled /></el-icon>
                <span class="marquee-text">此页面用于维护品牌介绍的信息，可以维护画册网盘链接和品牌官网，内容区为富文本，可以直接复制小程序的长图之后粘贴进来</span>
            </div>
        </div>
        
        <el-card class="!border-none mt-4" shadow="never">
            <div class="flex justify-between mb-4">
                <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                    <el-form-item label="">
                        <el-input class="w-[280px]" placeholder="搜索品牌名称或标题"
                            v-model="queryParams.keyword" clearable @keyup.enter="resetPage" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetPage">查询</el-button>
                        <el-button @click="resetParams">重置</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="primary" @click="addBrand">新增品牌</el-button>
                </div>
            </div>

            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="ID" prop="id" min-width="120" />
                <el-table-column label="标题" prop="subProductName" min-width="120" />
                <el-table-column label="创建人" prop="createdName" min-width="100" />
                <el-table-column label="创建时间" prop="createdTime" min-width="100" />
                <el-table-column label="更新人" prop="updatedName" min-width="100" />
                <el-table-column label="更新时间" prop="updatedTime" min-width="120" />
                <el-table-column label="状态" prop="effectiveFlag" min-width="100">
                    <template #default="{ row }">
                        <el-switch v-model="row.effectiveFlag" active-text="上架" inactive-text="下架" inline-prompt
                            @change="(e) => handleChangeStatus(row, e)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['user:detail']" type="primary" link @click="go2BrandDetail(row)">
                            编辑
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
import { InfoFilled } from '@element-plus/icons-vue'
import { usePaging } from '@/hooks/usePaging'
import { tryCatch } from '@/utils/util'
import { getBrandList, getBrandDetail, saveBrand } from '@/api/brand'

const router = useRouter()

const queryParams = reactive({
    keyword: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getBrandList,
    params: queryParams
})

onActivated(async () => {
    getLists()
})

getLists()

const addBrand = () => {
    router.push({
        name: 'BrandDetail',
        params: {
            id: 'add'
        },
        query: {
            type: 'add'
        }
    })
}

const go2BrandDetail = (row: any) => {
    router.push({
        name: 'BrandDetail',
        params: {
            id: row.id
        },
    })
}

const handleChangeStatus = async (row: any, e: any) => {
    try {
        const detail = await getBrandDetail({ id: row.id })
        detail.effectiveFlag = e
        const [err, res] = await tryCatch(saveBrand, detail)
        if (err) {
            ElMessage.error(err.message)
            return
        }
        ElMessage.success('保存成功')
    } catch (error) {
        console.error('保存失败:', error)
    }
}
</script>

<style scoped>
/* 跑马灯容器样式 */
.marquee-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.marquee-content {
    display: flex;
    align-items: center;
    animation: marquee 20s linear infinite, pulse 2s ease-in-out infinite alternate;
    white-space: nowrap;
}

.marquee-icon {
    color: #ffd700;
    margin-right: 8px;
    font-size: 18px;
    animation: pulse 2s ease-in-out infinite alternate;
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
    0% {
        opacity: 0.8;
    }
    100% {
        opacity: 1;
    }
}
</style>
