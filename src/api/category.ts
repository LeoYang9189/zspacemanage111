import request from "@/utils/request";

// 品类列表
export function getCategoryList(params: any) {
  return request.post({ url: "/bk/category/list", params });
}

// 品类详情
export function getCategoryDetail(params: any) {
  return request.get({ url: "/bk/category/detail", params });
}

// 新增品类
export function addCategory(params: any) {
  return request.post({ url: "/bk/category/add", params });
}

// 编辑品类
export function editCategory(params: any) {
  return request.post({ url: "/bk/category/edit", params });
}

// 删除品类
export function deleteCategory(params: any) {
  return request.post({ url: "/bk/category/delete", params });
}

// 品类状态切换
export function toggleCategoryStatus(params: any) {
  return request.post({ url: "/bk/category/status", params });
}

// 获取主分类列表
export function getParentCategoryList(params: any) {
  return request.get({ url: "/bk/category/parent", params });
}