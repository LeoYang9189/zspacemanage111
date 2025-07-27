<template>
    <div>
        <!-- 跑马灯提示 -->
        <div class="marquee-container">
            <div class="marquee-content">
                <el-icon class="marquee-icon">
                    <InfoFilled />
                </el-icon>
                <span class="marquee-text">在这个页面维护的商品详情，将会显示在 设计严选库的商品信息中，富文本输入框可以粘贴任意长图，或者设置丰富的文字格式或超链接</span>
            </div>
        </div>
        
        <el-card class="!border-none mt-4" shadow="never">
            <el-tabs v-model="queryParams.largeCategory" class="demo-tabs" @tab-change="handleChangeTab">
                <el-tab-pane v-for="(v, k) in categoryList" :key="k" :label="v" :name="v"></el-tab-pane>
            </el-tabs>

            <div class="space-y-4 mb-4">
                <!-- 筛选字段区域 -->
                <div class="grid grid-cols-4 gap-3 items-center">
                    <el-input 
                        :placeholder="`搜索${queryParams.largeCategory}名称或副标题`"
                        v-model="queryParams.like" 
                        clearable 
                        @keyup.enter="getLists" 
                    />
                    <el-select 
                        v-model="queryParams.categories" 
                        placeholder="品类" 
                        multiple 
                        collapse-tags 
                        collapse-tags-tooltip
                        clearable
                    >
                        <el-option
                            v-for="category in categoryOptions"
                            :key="category.value"
                            :label="category.label"
                            :value="category.value"
                        />
                    </el-select>
                    <el-select 
                        v-model="queryParams.functionalTags" 
                        placeholder="功能标签" 
                        multiple 
                        collapse-tags 
                        collapse-tags-tooltip
                        clearable
                    >
                        <el-option
                            v-for="tag in functionalTagOptions"
                            :key="tag.value"
                            :label="tag.label"
                            :value="tag.value"
                        />
                    </el-select>
                    <el-select 
                        v-model="queryParams.matchingTags" 
                        placeholder="搭配标签" 
                        multiple 
                        collapse-tags 
                        collapse-tags-tooltip
                        clearable
                    >
                        <el-option
                            v-for="tag in matchingTagOptions"
                            :key="tag.value"
                            :label="tag.label"
                            :value="tag.value"
                        />
                    </el-select>
                </div>
                <!-- 按钮区域 -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <el-button type="primary" @click="resetPage">查询</el-button>
                        <el-button @click="resetParams">重置</el-button>
                        <el-button type="success" @click="handleExport">导出</el-button>
                    </div>
                    <el-button type="primary" @click="addProduct">{{ `新增${queryParams.largeCategory}` }}</el-button>
                </div>
            </div>

            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="ID" prop="id" min-width="120" />
                <el-table-column label="主图" min-width="100">
                    <template #default="{ row }">
                        <el-avatar
                            v-if="Array.isArray(row.productCoverImageList) && row.productCoverImageList.length > 0"
                            :src="row.productCoverImageList[0]" :size="50" />
                    </template>
                </el-table-column>
                <el-table-column label="主标题" prop="productName" min-width="100" />
                <el-table-column label="副标题" prop="subProductName" min-width="120" />
                <el-table-column label="品类" min-width="120">
                    <template #default="{ row }">
                        <div v-if="row.categories && row.categories.length > 0">
                            <el-tag 
                                v-for="category in row.categories" 
                                :key="category" 
                                type="primary" 
                                size="small" 
                                class="mr-1 mb-1"
                            >
                                {{ getCategoryLabel(category) }}
                            </el-tag>
                        </div>
                        <span v-else class="text-gray-400">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="功能标签" prop="functionalTags" min-width="120">
                    <template #default="{ row }">
                        <div v-if="row.functionalTags && row.functionalTags.length > 0">
                            <el-tag
                                v-for="tag in row.functionalTags"
                                :key="tag"
                                type="success"
                                size="small"
                                class="mr-1 mb-1"
                            >
                                {{ getFunctionalTagLabel(tag) }}
                            </el-tag>
                        </div>
                        <span v-else class="text-gray-400">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="搭配标签" prop="matchingTags" min-width="120">
                    <template #default="{ row }">
                        <div v-if="row.matchingTags && row.matchingTags.length > 0">
                            <el-tag
                                v-for="tag in row.matchingTags"
                                :key="tag"
                                type="warning"
                                size="small"
                                class="mr-1 mb-1"
                            >
                                {{ getMatchingTagLabel(tag) }}
                            </el-tag>
                        </div>
                        <span v-else class="text-gray-400">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" prop="createdName" min-width="100" />
                <el-table-column label="创建时间" prop="createdTime" min-width="100" />
                <el-table-column label="更新人" prop="updatedName" min-width="100" />
                <el-table-column label="更新时间" prop="updatedTime" min-width="120" />
                <el-table-column label="状态" prop="effectiveFlag" min-width="100">
                    <template #default="{ row }">
                        <el-switch v-model="row.effectiveFlag" active-text="上架" inactive-text="下架" inline-prompt />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['user:detail']" type="primary" link @click="go2ProductDetail(row)">
                            编辑
                        </el-button>
                        <el-button  type="danger" link @click="deleteProduct(row)">
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
import { getProductList, deleteProduct as deleteProductApi } from '@/api/stock'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()

const queryParams = reactive({
    like: '',
    largeCategory: '',
    categories: [],
    functionalTags: [],
    matchingTags: []
})

// 品类选项 - 按照用户要求的枚举值
const categoryOptions = ref([
    // 家具
    { label: '沙发', value: 'sofa' },
    { label: '椅类', value: 'chair' },
    { label: '桌类', value: 'table' },
    { label: '柜类', value: 'cabinet' },
    { label: '床', value: 'bed' },
    { label: '屏风', value: 'screen' },
    { label: '置物架', value: 'shelf' },
    { label: '推车', value: 'cart' },
    // 灯具
    { label: '吊灯', value: 'pendant_light' },
    { label: '吸顶灯', value: 'ceiling_light' },
    { label: '壁灯', value: 'wall_light' },
    { label: '落地灯', value: 'floor_lamp' },
    { label: '台灯', value: 'table_lamp' },
    // 配饰
    { label: '镜子', value: 'mirror' },
    { label: '钟', value: 'clock' },
    { label: '香薰蜡烛', value: 'candle' },
    { label: '相框', value: 'photo_frame' },
    { label: '烟灰缸', value: 'ashtray' },
    { label: '摆件', value: 'ornament' },
    { label: '雕塑', value: 'sculpture' },
    { label: '地毯', value: 'carpet' },
    { label: '床垫', value: 'mattress' },
    { label: '花瓶花盆', value: 'vase_pot' },
    { label: '收纳用品', value: 'storage' },
    { label: '垃圾桶', value: 'trash_can' },
    { label: '托盘', value: 'tray' },
    { label: '挂画', value: 'painting' }
])

// 功能标签选项 - 每一类下面都有
const functionalTagOptions = ref([
    { label: '可户外', value: 'outdoor' },
    { label: '带灯光', value: 'with_light' },
    { label: '充电便携', value: 'portable' },
    { label: '室内款', value: 'indoor' }
])

// 搭配标签选项
const matchingTagOptions = ref([
    { label: '挑空区', value: 'high_ceiling' },
    { label: '楼梯区', value: 'stair_area' },
    { label: '客厅区', value: 'living_room' },
    { label: '餐厅区', value: 'dining_room' },
    { label: '卧室区', value: 'bedroom' },
    { label: '吧台区', value: 'bar_area' },
    { label: '户外区', value: 'outdoor_area' }
])
const activeTab = computed(() => queryParams.largeCategory)

const categoryList = ref([])
const getCategory = async () => {
    const [err, res] = await tryCatch(getProductCategory, {
        pageCode: 'Classification'
    })
    if (err) return
    categoryList.value = res.largeCategory
    queryParams.largeCategory = res.largeCategory[0]
}
getCategory()

const { pager, getLists: originalGetLists, resetPage, resetParams } = usePaging({
    fetchFun: getProductList,
    params: queryParams
})

// 包装getLists方法，为数据添加品类和标签字段
const getLists = async () => {
    const result = await originalGetLists()
    // 为每个产品添加模拟的品类和标签数据
    if (pager.lists && pager.lists.length > 0) {
        pager.lists = pager.lists.map((item: any, index: number) => {
            // 模拟品类数据
            const categoryValues = ['sofa', 'pendant_light', 'mirror', 'chair', 'ceiling_light']
            const categories = [categoryValues[index % categoryValues.length]]
            
            // 模拟功能标签数据
            const functionalTagsList = [
                ['outdoor', 'with_light'],
                ['portable', 'indoor'],
                ['with_light', 'indoor'],
                ['outdoor', 'portable'],
                ['indoor']
            ]
            const functionalTags = functionalTagsList[index % functionalTagsList.length]
            
            // 模拟搭配标签数据
            const matchingTagsList = [
                ['living_room', 'dining_room'],
                ['bedroom', 'bar_area'],
                ['high_ceiling', 'stair_area'],
                ['outdoor_area'],
                ['living_room', 'bedroom']
            ]
            const matchingTags = matchingTagsList[index % matchingTagsList.length]
            
            return {
                ...item,
                categories: categories,
                functionalTags: functionalTags,
                matchingTags: matchingTags
            }
        })
    }
    return result
}
onActivated(async () => {
    getLists()
})

getLists()

const handleChangeTab = (tab: string | number) => {
    console.warn(tab)
    getLists()
}

const addProduct = () => {
    router.push({
        name: 'StockDetail',
        params: {
            category: activeTab.value,
            type: 'add'
        }
    })
}

const go2ProductDetail = (row: any) => {
    router.push({
        name: 'StockDetail',
        params: {
            category: activeTab.value,
            type: 'edit',
        },
        query: {
            id: row.id
        }
    })
}

const deleteProduct = (row: any) => {

}

// 导出功能
const handleExport = () => {
    ElMessageBox.alert(
        '测试环境暂无法导出，发布生产后您可以根据筛选条件导出库存列表',
        '提示',
        {
            confirmButtonText: '确定',
            type: 'info'
        }
    )
}

// 获取品类标签
const getCategoryLabel = (value: string) => {
    const category = categoryOptions.value.find(item => item.value === value)
    return category ? category.label : value
}

// 获取功能标签标签
const getFunctionalTagLabel = (value: string) => {
    const tag = functionalTagOptions.value.find(item => item.value === value)
    return tag ? tag.label : value
}

// 获取搭配标签标签
const getMatchingTagLabel = (value: string) => {
    const tag = matchingTagOptions.value.find(item => item.value === value)
    return tag ? tag.label : value
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
    animation: marquee 25s linear infinite, pulse 2s ease-in-out infinite alternate;
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
