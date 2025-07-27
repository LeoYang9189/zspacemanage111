/**
 * 权限控制
 */

import NProgress from 'nprogress'
import router from './router'
import 'nprogress/nprogress.css'
import useUserStore from './stores/modules/user'
import { PageEnum } from './enums/pageEnum'
import useTabsStore from './stores/modules/multipleTabs'
import { clearAuthInfo } from './utils/auth'
import config from './config'

// NProgress配置
NProgress.configure({ showSpinner: false })

const loginPath = PageEnum.LOGIN
const defaultPath = PageEnum.INDEX
// 免登录白名单
const whiteList: string[] = [PageEnum.LOGIN, PageEnum.ERROR_403]
router.beforeEach(async (to, from, next) => {
    // 开始 Progress Bar
    NProgress.start()
    document.title = to.meta.title ?? config.title
    const userStore = useUserStore()

    // const tabsStore = useTabsStore()
    if (whiteList.includes(to.path)) {
        // 在免登录白名单，直接进入
        next()
    } else if (userStore.token) {
        // 获取用户信息
        const hasGetUserInfo = Object.keys(userStore.userInfo).length !== 0
        if (hasGetUserInfo) {
            if (to.path === loginPath) {
                next({ path: defaultPath })
            } else {
                next()
            }
        } else {
            try {
                await userStore.getUserInfo()
                // tabsStore.setRouteName(routeName!) 
                next({ ...to, replace: true })
            } catch (err) {
                clearAuthInfo()
                next({ path: loginPath, query: { redirect: to.fullPath } })
            }
        }
    } else {
        next({ path: loginPath, query: { redirect: to.fullPath } })
    }
})

router.afterEach(() => {
    NProgress.done()
})
