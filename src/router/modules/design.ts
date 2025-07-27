export default [{
    path: '/design/selection',
    component: () => import('@/views/design/index.vue'),
    name: 'DesignSelection',
    meta: {
        title: '设计严选管理',
        icon: 'el-icon-brush',
        activeMenu: '/design/selection',
        isMenu: true,
        perms: 'design:selection'
    },
}]