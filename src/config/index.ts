const config = {
  title: import.meta.env.VITE_APP_TITLE || "后台管理系统", //网站默认标题
  version: "1.3.3", //版本号
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://8.149.244.70:8080/",
  timeout: 10 * 1000, //请求超时时长
};

export default config;
