import request from '@/utils/request'

// 管理员列表
export function getManagerList(params: any) {
    return request.post({ url: '/bk/user/users', params })
}

// 管理员详情
export function getManagerDetail(params: any) {
    return request.get({ url: '/bk/user/detail', params })
}

// 管理员新增
export function managerAdd(params: any) {
    return request.post({ url: '/bk/user/addBkUser', params })
}

// 管理员编辑
export function managerEdit(params: any) {
    return request.post({ url: '/bk/user/updateBkUser', params })
}

// 管理员删除
export function managerDelete(params: any) {
    return request.get({ url: '/bk/user/deleteBkUser', params })
}
