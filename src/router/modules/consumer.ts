

export default {
    path: '/consumer/list',
    component: () => import('@/views/consumer/index.vue'),
    name: 'ConsumerList',
    meta: {
        title: '客户管理',
        icon: 'el-icon-user',
        activeMenu: '/consumer',
        isMenu: true,

    }
}
