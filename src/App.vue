<script setup lang="ts">
import { useDark, useWindowSize, useThrottleFn } from '@vueuse/core'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import useAppStore from './stores/modules/app'
import useSettingStore from './stores/modules/setting'
import { ScreenEnum } from './enums/appEnums'
const appStore = useAppStore()
const settingStore = useSettingStore()
const elConfig = {
  zIndex: 3000,
  locale: zhCn,
}
const isDark = useDark()
onMounted(async () => {
  //设置主题色
  settingStore.setTheme(isDark.value)
  // 获取配置
  // const data: any = await appStore.getConfig()
  // 设置网站logo
  // let favicon: HTMLLinkElement = document.querySelector('link[rel="icon"]')!
  // if (favicon) {
  //   favicon.href = data.webFavicon
  //   return
  // }
  // favicon = document.createElement('link')
  // favicon.rel = 'icon'
  // favicon.href = data.webFavicon
  // document.head.appendChild(favicon)
})

const { width } = useWindowSize()
watch(
  width,
  useThrottleFn((value) => {
    if (value > ScreenEnum.SM) {
      appStore.setMobile(false)
      appStore.toggleCollapsed(false)
    } else {
      appStore.setMobile(true)
      appStore.toggleCollapsed(true)
    }
    if (value < ScreenEnum.MD) {
      appStore.toggleCollapsed(true)
    }
  }),
  {
    immediate: true,
  },
)
console.log(import.meta.env)
</script>

<template>
  <el-config-provider :locale="elConfig.locale" :z-index="elConfig.zIndex">
    <router-view />
  </el-config-provider>
</template>

<style></style>
