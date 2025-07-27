

export default [{
    path: '/manager/list',
    component: () => import('@/views/manager/index.vue'),
    name: 'ManagerList',
    meta: {
        title: '用户管理',
        icon: 'el-icon-user',
        activeMenu: '/manager/list',
        isMenu: true,
        perms: 'manager:list'
    },
}, {
    path: '/manager/detail',
    component: () => import('@/views/manager/detail.vue'),
    name: 'ManagerDetail',
    meta: {
        title: '用户详情',
        icon: 'el-icon-user',
        activeMenu: '/manager/list',
        isMenu: false,
        perms: 'manager:detail'
    }
}]
