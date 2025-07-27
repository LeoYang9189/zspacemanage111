<template>
  <div>
    <el-card class="!border-none" shadow="never">
      <el-page-header
        :content="`${isAdd ? '新增' : '编辑'}${largeCategory}`"
        @back="$router.back()"
      />

      <el-tabs v-model="activeName" class="mt-4">
        <el-tab-pane label="基本信息" name="first">
          <el-form
            ref="baseFormRef"
            :model="formData"
            label-position="top"
            class="mt-4"
          >
            <div class="form-row">
            <el-form-item label="大类" style="width: 200px">
              <el-select v-model="formData.largeCategory" placeholder="请选择" disabled>
                <el-option
                    v-for="item in classificationData.largeCategory"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品类" style="width: 200px">
              <el-select 
                v-model="formData.categories" 
                placeholder="请选择品类" 
                multiple 
                collapse-tags 
                collapse-tags-tooltip
              >
                <el-option
                    v-for="category in categoryOptions"
                    :key="category.value"
                    :label="category.label"
                    :value="category.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌" style="width: 200px">
              <el-input v-model="formData.brand" placeholder="请输入品牌名称" />
            </el-form-item>
            <el-form-item label="状态" style="width: 200px">
              <el-select
                v-model="formData.status"
                placeholder="请选择状态"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            </div>
            <div class="form-row">
            <el-form-item label="功能标签" style="width: 200px">
              <el-select 
                v-model="formData.functionalTags" 
                placeholder="请选择功能标签" 
                multiple 
                collapse-tags 
                collapse-tags-tooltip
              >
                <el-option
                    v-for="tag in functionalTagOptions"
                    :key="tag.value"
                    :label="tag.label"
                    :value="tag.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="搭配标签" style="width: 200px">
              <el-select 
                v-model="formData.matchingTags" 
                placeholder="请选择搭配标签" 
                multiple 
                collapse-tags 
                collapse-tags-tooltip
              >
                <el-option
                    v-for="tag in matchingTagOptions"
                    :key="tag.value"
                    :label="tag.label"
                    :value="tag.value">
                </el-option>
              </el-select>
            </el-form-item>
            </div>
            <el-form-item label="主标题">
              <el-input
                v-model="formData.productName"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input
                v-model="formData.subProductName"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="商品说明">
              <el-input
                v-model="formData.productBlurb"
                type="textarea"
                :rows="4"
                :maxlength="150"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="小程序码">
              <el-upload
                class="avatar-uploader"
                :action="`${config.baseUrl}/admin/common/upload`"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="formData.qrcode"
                  class="w-80px h-80px avatar"
                  :src="formData.qrcode"
                />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="轮播主图">
              <el-upload
                v-model:file-list="formData.productCoverImageList"
                :action="`${config.baseUrl}/admin/common/upload`"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <el-icon class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>

              <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
            </el-form-item>
            <!-- 商品参数 -->
            <el-form-item label="产品材质">
              <el-input v-model="formData.productParameter.material" />
            </el-form-item>
            <el-form-item label="产品尺寸">
              <el-input v-model="formData.productParameter.size" />
            </el-form-item>
            <el-form-item label="产品颜色">
              <el-input v-model="formData.productParameter.color" />
            </el-form-item>
            <el-form-item label="产品光源">
              <el-input v-model="formData.productParameter.lightSource" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="产品介绍" name="second">
          <el-form
            ref="productFormRef"
            :model="productData"
            label-position="top"
            class="mt-4"
          >
            <el-form-item>
              <editor
                v-model="productData.productShow"
                :height="667"
                :width="1504"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="设计师介绍" name="third">
          <el-form
            ref="designerFormRef"
            :model="designerData"
            label-position="top"
            class="mt-4"
          >
            <el-form-item>
              <editor
                v-model="designerData.designer"
                :height="667"
                :width="1504"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="品牌介绍" name="fourth">
          <el-form
            ref="brandFormRef"
            :model="brandData"
            label-position="top"
            class="mt-4"
          >
            <el-form-item>
              <editor
                v-model="brandData.brandIntroduction"
                :height="667"
                :width="1504"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <div
      class="sticky bottom-0 left-0 right-0 bg-white p-4 flex justify-center"
    >
      <el-button @click="handleSave">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="consumerDetail">
import DOMPurify from 'dompurify'
import type { FormInstance, UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProductDetail, saveProduct, getPageConfiguration } from '@/api/stock'
import feedback from '@/utils/feedback'
import {
  ProductParameterMap,
  productParameterEnum,
  exchangeKeyAndValue,
} from '@/enums/appEnums'
import { tryCatch } from '@/utils/util'
import config from '@/config'
interface UploadResponse {
  data: string
}

const route = useRoute()
const activeName = ref('first')
const stockId = computed(() => route.query.id)
const largeCategory = computed(() => route.params.category)
const isAdd = computed(() => route.params.type === 'add')

// 品类选项 - 与列表页保持一致
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

// 功能标签选项 - 与列表页保持一致
const functionalTagOptions = ref([
    { label: '可户外', value: 'outdoor' },
    { label: '带灯光', value: 'with_light' },
    { label: '充电便携', value: 'portable' },
    { label: '室内款', value: 'indoor' }
])

// 搭配标签选项 - 与列表页保持一致
const matchingTagOptions = ref([
    { label: '挑空区', value: 'high_ceiling' },
    { label: '楼梯区', value: 'stair_area' },
    { label: '客厅区', value: 'living_room' },
    { label: '餐厅区', value: 'dining_room' },
    { label: '卧室区', value: 'bedroom' },
    { label: '吧台区', value: 'bar_area' },
    { label: '户外区', value: 'outdoor_area' }
])

// 状态选项
const statusOptions = ref([
    { label: '现货', value: 'in_stock' },
    { label: '在途', value: 'in_transit' },
    { label: '期货', value: 'futures' },
    { label: '特价', value: 'special_price' }
])

const formData = reactive({
  largeCategory: largeCategory.value || '',
  categories: [],
  functionalTags: [],
  matchingTags: [],
  brand: '',
  status: '',
  productName: '',
  subProductName: '',
  productBlurb: '',
  productImage: '',
  productCoverImageList: [],
  qrcode: '',
  productParameter: {
    [productParameterEnum.MATERIAL]: '',
    [productParameterEnum.SIZE]: '',
    [productParameterEnum.LIGHT_SOURCE]: '',
    [productParameterEnum.COLOR]: '',
  },
})

const designerData = reactive({
  designer: '',
})

const productData = reactive({
  productShow: '',
})

const brandData = reactive({
  brandIntroduction: '',
})

const classificationData = reactive({
  largeCategory: [],
  category: {},
  brand: {},
})

// 使用 computed 属性来动态计算当前大类下的子类别
const currentCategoryItems = computed(() => {
  if (formData.largeCategory && classificationData.category[formData.largeCategory]) {
    return classificationData.category[formData.largeCategory];
  }
  return [];
});
const currentBrandItems = computed(() => {
  if (formData.largeCategory && classificationData.brand[formData.largeCategory]) {
    return classificationData.brand[formData.largeCategory];
  }
  return [];
});

const baseFormRef = shallowRef<FormInstance>()
const designerFormRef = shallowRef<FormInstance>()
const productFormRef = shallowRef<FormInstance>()
const brandFormRef = shallowRef<FormInstance>()

const getClassification = async () => {
  const [err, data] = await tryCatch(getPageConfiguration, { pageCode: 'Classification' })
  if (err) return feedback.msgError(err.message)
  const {
    largeCategory,
    category,
    brand,
    ...others
  } = data
  classificationData.largeCategory = largeCategory
  classificationData.category = category
  classificationData.brand = brand
}

const getDetails = async () => {
  if (!stockId.value) return
  const [err, data] = await tryCatch(getProductDetail, {
    id: stockId.value,
  })
  if (err) return feedback.msgError(err.message)
  const {
    productCoverImageList,
    productParameter,
    designer,
    productShow,
    brandIntroduction,
    categories,
    functionalTags,
    matchingTags,
    status,
    ...others
  } = data
  // 处理产品封面图片列表
  formData.productCoverImageList = productCoverImageList.map((v: String) => ({
    name: v.split('/').pop(),
    url: v,
  }))
  // 处理属性
  const obj = {}
  const map = exchangeKeyAndValue(ProductParameterMap)
  Object.keys(productParameter).forEach((k) => {
    console.warn(map[k])

    if (map[k]) {
      obj[map[k]] = productParameter[k]
    }
  })
  formData.productParameter = obj
  // 处理设计师介绍
  designerData.designer = designer
  // 处理产品介绍
  productData.productShow = productShow
  // 处理品牌介绍
  brandData.brandIntroduction = brandIntroduction || ''
  // 处理新增的字段
  formData.categories = categories || []
  formData.functionalTags = functionalTags || []
  formData.matchingTags = matchingTags || []
  formData.status = status || ''

  Object.keys(formData).forEach((key) => {
    if (others[key] !== undefined) {
      formData[key] = others[key]
    }
  })
}

// 初始化时设置大类
onMounted(() => {
  if (isAdd.value && largeCategory.value) {
    formData.largeCategory = largeCategory.value
  }
})

getDetails()
getClassification()

// 保存产品信息
const handleSave = async () => {
  // 处理产品封面图片列表,将上传后的响应数据提取出来
  const mappedImages = formData.productCoverImageList.map(
    (v: UploadUserFile) => v.response?.data || v.url,
  )
  // 处理产品参数,将枚举key转换为中文名称
  const { productParameter } = formData
  const productParameterObj: Record<string, string> = {}
  Object.keys(productParameter).forEach((key) => {
    // 只保存有值的参数
    if (productParameter[key as keyof typeof productParameter]) {
      productParameterObj[
        ProductParameterMap[key as keyof typeof ProductParameterMap]
      ] = productParameter[key as keyof typeof productParameter]
    }
  })

  // 调用保存接口
  const [err, res] = await tryCatch(saveProduct, {
    id: stockId.value,
    largeCategory: formData.largeCategory,
    ...formData,
    productCoverImageList: mappedImages,
    ...designerData,
    ...productData,
    ...brandData,
    productParameter: productParameterObj,
  })
  if (err) return feedback.msgError(err.message)
  feedback.msgSuccess('编辑成功')
  // 重新获取详情
  getDetails()
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!['image/png', 'image/jpeg'].includes(rawFile.type)) {
    ElMessage.error('请上传png/jpg格式图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2MB')
    return false
  }
  return true
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  formData.qrcode = response.data
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
}

.form-row {
  display: flex;
  gap: 20px; /* 控制子项之间的间距 */
}
</style>
