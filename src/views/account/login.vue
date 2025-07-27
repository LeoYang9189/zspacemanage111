<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="background-decoration">
      <div class="decoration-circle decoration-circle-1"></div>
      <div class="decoration-circle decoration-circle-2"></div>
      <div class="decoration-circle decoration-circle-3"></div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="login-content">
      <!-- 左侧设计展示区 -->
      <div class="design-showcase">
        <div class="showcase-content">
          <div class="furniture-elements">
            <div class="furniture-item furniture-sofa">
              <div class="sofa-back"></div>
              <div class="sofa-seat"></div>
              <div class="sofa-arm sofa-arm-left"></div>
              <div class="sofa-arm sofa-arm-right"></div>
            </div>
            <div class="furniture-item furniture-table">
              <div class="table-top"></div>
              <div class="table-leg table-leg-1"></div>
              <div class="table-leg table-leg-2"></div>
              <div class="table-leg table-leg-3"></div>
              <div class="table-leg table-leg-4"></div>
            </div>
            <div class="furniture-item furniture-plant">
              <div class="plant-pot"></div>
              <div class="plant-stem"></div>
              <div class="plant-leaf plant-leaf-1"></div>
              <div class="plant-leaf plant-leaf-2"></div>
              <div class="plant-leaf plant-leaf-3"></div>
            </div>
          </div>
          <div class="showcase-text">
            <h2>高端家居设计</h2>
            <p>打造您的理想生活空间</p>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录表单 -->
      <div class="login-form-container">
        <div class="login-form-wrapper">
          <!-- Logo和标题 -->
          <div class="brand-section">
            <div class="logo-container">
              <div class="logo">
                <img src="@/assets/images/logo.png" alt="Z SPACE+" class="logo-image" />
              </div>
            </div>
            <p class="brand-subtitle">全球家居软装一站式服务平台</p>
            <p class="admin-subtitle">管理后台</p>
          </div>
          
          <!-- 登录表单 -->
          <div class="form-section">
            <el-form ref="formRef" :model="formData" size="large" :rules="rules" class="login-form">
              <el-form-item prop="username">
                <el-input
                  v-model.trim="formData.username"
                  placeholder="请输入账号"
                  @keyup.enter="handleEnter"
                  class="form-input"
                >
                  <template #prepend>
                    <icon name="el-icon-User" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="pwd">
                <el-input
                  ref="passwordRef"
                  v-model="formData.pwd"
                  show-password
                  placeholder="请输入密码"
                  @keyup.enter="handleLogin"
                  class="form-input"
                >
                  <template #prepend>
                    <icon name="el-icon-Lock" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="verificationCode">
                <el-input
                  v-model.trim="formData.verificationCode"
                  placeholder="请输入验证码"
                  @keyup.enter="handleEnter"
                  class="form-input"
                >
                  <template #append>
                    <img class="verification-img" :src="vImg" @click="getVImg" />
                  </template>
                </el-input>
              </el-form-item>
              
              <div class="form-options">
                <el-checkbox v-model="remAccount" label="记住账号" class="remember-checkbox"></el-checkbox>
              </div>
              
              <el-button
                type="primary"
                size="large"
                :loading="isLock"
                @click="lockLogin"
                class="login-button"
              >
                登录
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    
    <layout-footer />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
import type { InputInstance, FormInstance } from 'element-plus'
import LayoutFooter from '@/layout/components/footer.vue'
import useAppStore from '@/stores/modules/app'
import useUserStore from '@/stores/modules/user'
import cache from '@/utils/cache'
import { getVerifyImages } from '@/api/app'
import { ACCOUNT_KEY } from '@/enums/cacheEnums'
import { PageEnum } from '@/enums/pageEnum'
import { useLockFn } from '@/hooks/useLockFn'
import { tryCatch } from '@/utils/util'
const passwordRef = shallowRef<InputInstance>()
const formRef = shallowRef<FormInstance>()
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const remAccount = ref(false)
const config = computed(() => appStore.config)
const formData = reactive({
  username: '',
  pwd: '',
  verificationCode: '',
})
const rules = {
  username: [
    {
      required: true,
      message: '请输入账号',
      trigger: ['blur'],
    },
  ],
  pwd: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur'],
    },
  ],
  verificationCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['blur'],
    },
  ],
}

// 获取验证码图片
const vImg = ref('')
const getVImg = async () => {
  const [err, res] = await tryCatch(getVerifyImages)
  if (err) return
  vImg.value = res.verifyImages
}
getVImg()

// 回车按键监听
const handleEnter = () => {
  if (!formData.pwd) {
    return passwordRef.value?.focus()
  }
  handleLogin()
}
// 登录处理
const handleLogin = async () => {
  await formRef.value?.validate()
  // 记住账号，缓存
  cache.set(ACCOUNT_KEY, {
    remember: remAccount.value,
    username: remAccount.value ? formData.username : '',
  })
  console.warn(formData)

  await userStore.login(formData)
  const {
    query: { redirect },
  } = route
  const path = typeof redirect === 'string' ? redirect : PageEnum.INDEX
  router.push(path)
}
const { isLock, lockFn: lockLogin } = useLockFn(handleLogin)

onMounted(() => {
  const value = cache.get(ACCOUNT_KEY)
  if (value?.remember) {
    remAccount.value = value.remember
    formData.username = value.username
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2d5a5a 0%, #1a3d3d 50%, #0f2626 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 背景装饰元素 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.decoration-circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation: float 6s ease-in-out infinite;
}

.decoration-circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

.decoration-circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 20%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 主要内容区域 */
.login-content {
  flex: 1;
  display: flex;
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}

/* 左侧设计展示区 */
.design-showcase {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
}

.showcase-content {
  text-align: center;
  color: white;
}

.furniture-elements {
  position: relative;
  width: 400px;
  height: 300px;
  margin: 0 auto 40px;
}

.furniture-item {
  position: absolute;
}

/* 沙发设计 */
.furniture-sofa {
  bottom: 80px;
  left: 50px;
  width: 120px;
  height: 60px;
}

.sofa-back {
  position: absolute;
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  border-radius: 8px 8px 0 0;
  top: 0;
}

.sofa-seat {
  position: absolute;
  width: 100%;
  height: 25px;
  background: linear-gradient(135deg, #CD853F, #DEB887);
  border-radius: 4px;
  bottom: 0;
}

.sofa-arm {
  position: absolute;
  width: 15px;
  height: 50px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  border-radius: 8px;
  top: 5px;
}

.sofa-arm-left { left: -10px; }
.sofa-arm-right { right: -10px; }

/* 桌子设计 */
.furniture-table {
  bottom: 40px;
  right: 80px;
  width: 80px;
  height: 50px;
}

.table-top {
  position: absolute;
  width: 100%;
  height: 8px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  border-radius: 4px;
  top: 0;
}

.table-leg {
  position: absolute;
  width: 4px;
  height: 42px;
  background: linear-gradient(135deg, #654321, #8B4513);
  border-radius: 2px;
  top: 8px;
}

.table-leg-1 { left: 5px; }
.table-leg-2 { right: 5px; }
.table-leg-3 { left: 5px; bottom: 0; top: auto; }
.table-leg-4 { right: 5px; bottom: 0; top: auto; }

/* 植物设计 */
.furniture-plant {
  top: 60px;
  right: 120px;
  width: 40px;
  height: 80px;
}

.plant-pot {
  position: absolute;
  width: 30px;
  height: 25px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  border-radius: 0 0 15px 15px;
  bottom: 0;
  left: 5px;
}

.plant-stem {
  position: absolute;
  width: 4px;
  height: 40px;
  background: linear-gradient(135deg, #228B22, #32CD32);
  border-radius: 2px;
  bottom: 25px;
  left: 18px;
}

.plant-leaf {
  position: absolute;
  width: 15px;
  height: 8px;
  background: linear-gradient(135deg, #228B22, #32CD32);
  border-radius: 50% 10px 50% 10px;
}

.plant-leaf-1 {
  top: 20px;
  left: 25px;
  transform: rotate(-30deg);
}

.plant-leaf-2 {
  top: 15px;
  left: 10px;
  transform: rotate(30deg);
}

.plant-leaf-3 {
  top: 10px;
  left: 18px;
  transform: rotate(0deg);
}

.showcase-text h2 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.showcase-text p {
  font-size: 1.2rem;
  opacity: 0.8;
  font-weight: 300;
}

/* 右侧登录表单 */
.login-form-container {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-form-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
}

/* Logo和品牌区域 */
.brand-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  margin-bottom: 32px;
}

.logo {
  display: inline-block;
  position: relative;
}

.logo-image {
  height: 60px;
  width: auto;
  max-width: 250px;
  filter: drop-shadow(0 2px 8px rgba(45, 90, 90, 0.3));
  transition: all 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 12px rgba(45, 90, 90, 0.4));
}

.brand-subtitle {
  font-size: 1.1rem;
  color: #2d5a5a;
  margin: 0 0 8px 0;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.admin-subtitle {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  font-weight: 400;
  opacity: 0.8;
}

/* 表单区域 */
.form-section {
  margin-top: 32px;
}

.login-form {
  width: 100%;
}

.form-input {
  margin-bottom: 20px;
}

.form-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(45, 90, 90, 0.1);
  border: 1px solid rgba(45, 90, 90, 0.2);
  transition: all 0.3s ease;
}

.form-input :deep(.el-input__wrapper:hover) {
  border-color: #2d5a5a;
  box-shadow: 0 4px 20px rgba(45, 90, 90, 0.15);
}

.form-input :deep(.el-input__wrapper.is-focus) {
  border-color: #2d5a5a;
  box-shadow: 0 0 0 2px rgba(45, 90, 90, 0.2);
}

.form-input :deep(.el-input-group__prepend) {
  background: linear-gradient(135deg, #2d5a5a, #1a3d3d);
  border: none;
  color: white;
  border-radius: 12px 0 0 12px;
}

.verification-img {
  width: 100px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
}

.form-options {
  margin: 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-checkbox :deep(.el-checkbox__label) {
  color: #666;
  font-size: 14px;
}

.remember-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #2d5a5a;
  border-color: #2d5a5a;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2d5a5a, #1a3d3d);
  border: none;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(45, 90, 90, 0.3);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(45, 90, 90, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
  }
  
  .design-showcase {
    display: none;
  }
  
  .login-form-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 20px;
  }
  
  .login-form-wrapper {
    padding: 32px 24px;
    border-radius: 16px;
  }
  
  .brand-title {
    font-size: 1.8rem;
  }
  
  .showcase-text h2 {
    font-size: 2rem;
  }
}

/* 动画效果 */
.login-form-wrapper {
  animation: slideInUp 0.6s ease-out;
}

.design-showcase {
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 家具元素动画 */
.furniture-item {
  animation: fadeInScale 1s ease-out;
}

.furniture-sofa {
  animation-delay: 0.2s;
}

.furniture-table {
  animation-delay: 0.4s;
}

.furniture-plant {
  animation-delay: 0.6s;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
