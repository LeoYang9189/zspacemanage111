import request from "@/utils/request";

// 产品列表
export function getProductList(params: any) {
  return request.post({ url: "/bk/product/productList", params });
}

// 产品详情
export function getProductDetail(params: any) {
  return request.get({ url: "/bk/product/productDetail", params });
}

// 产品保存
export function saveProduct(params: any) {
  return request.post({ url: "/bk/product/save", params });
}

// 产品删除
export function deleteProduct(params: any) {
  return request.get({ url: "/bk/product/delete", params });
}

// 设计师列表
export function getDesignerList(params: any) {
  return request.post({ url: "/bk/product/designerList", params });
}

// 设计师保存
export function saveDesigner(params: any) {
  return request.post({ url: "/bk/product/saveDesigner", params });
}

// 页面配置
export function getPageConfiguration(params: any) {
  return request.get({ url: "/bk/page/pageConfiguration", params });
}

// 保存更新页面配置
export function savePageConfiguration(params: any) {
  return request.post({
    url: "/bk/page/saveConfiguration",
    params: { configuration: params, pageCode: "Banner" },
  });
}
