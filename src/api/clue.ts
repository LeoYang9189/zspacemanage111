import request from '@/utils/request'

// 线索列表
export function getClueList(params: any) {
  return request.post({ url: '/bk/contactUs/list', params })
}

// 线索详情
export function getClueDetail(params: any) {
  return request.get({ url: '/bk/contactUs/detail', params })
}

// 线索删除
export function deleteClueApi(params: any) {
  return request.get({ url: '/bk/contactUs/delete', params })
}
