export default [{
    path: '/company/info',
    component: () => import('@/views/company/index.vue'),
    name: 'CompanyInfo',
    meta: {
        title: '公司信息管理',
        icon: 'el-icon-office-building',
        activeMenu: '/company/info',
        isMenu: true,
        perms: 'company:info'
    },
}]