import request from "@/utils/request";

// 配置
export function getConfig() {
  return request.get({ url: "/common/index/config" });
}

// 工作台主页
export function getWorkbench() {
  return request.get({ url: "/common/index/console" });
}

// 获取验证图片
export function getVerifyImages() {
  return request.get({ url: "/bk/auth/getVerifyImages" });
}

// 产品分类（卡片列表的侧边栏）
export function getProductCategory(params: any) {
  return request.get({ url: "/bk/page/pageConfiguration", params });
}

// 上传文件
export function uploadFile(file: any) {
  return request.post({ url: "/common/album/albumAdd", data: { file } });
}
