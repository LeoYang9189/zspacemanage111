import request from "@/utils/request";

// 标签列表
export function getTagList(params: any) {
  return request.post({ url: "/bk/tag/list", params });
}

// 标签详情
export function getTagDetail(params: any) {
  return request.get({ url: "/bk/tag/detail", params });
}

// 新增标签
export function addTag(params: any) {
  return request.post({ url: "/bk/tag/add", params });
}

// 编辑标签
export function editTag(params: any) {
  return request.post({ url: "/bk/tag/edit", params });
}

// 删除标签
export function deleteTag(params: any) {
  return request.post({ url: "/bk/tag/delete", params });
}

// 标签状态切换
export function toggleTagStatus(params: any) {
  return request.post({ url: "/bk/tag/status", params });
}