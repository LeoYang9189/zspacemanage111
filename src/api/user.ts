import request from '@/utils/request'

// 登录
export function login(params: Record<string, any>) {
    return request.post({ url: '/bk/auth/login', params })
}

// 退出登录
export function logout() {
    return request.post({ url: '/system/logout' })
}

// 用户信息
export function getUserInfo() {
    return request.get({ url: '/bk/user/me' })
}

// 编辑管理员信息
export function setUserInfo(params: any) {
    return request.post({ url: '/system/admin/upInfo', params })
}

