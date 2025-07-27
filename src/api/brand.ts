import request from "@/utils/request";

// 品牌列表
export function getBrandList(params: any) {
  return request.post({ url: "/bk/brand/list", params });
}

// 品牌详情
export function getBrandDetail(params: any) {
  return request.get({ url: "/bk/brand/detail", params });
}

// 品牌保存
export function saveBrand(params: any) {
  return request.post({ url: "/bk/brand/save", params });
}

// 品牌删除
export function deleteBrand(params: any) {
  return request.get({ url: "/bk/brand/delete", params });
}
