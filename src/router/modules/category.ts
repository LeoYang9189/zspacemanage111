export default [
  {
    path: '/operation',
    children: [
      {
        path: 'category/list',
        component: () => import('@/views/category/index.vue'),
        name: 'CategoryList',
        meta: {
          title: '品类管理',
          icon: 'el-icon-menu',
          activeMenu: '/operation/category/list',
          isMenu: true,
          perms: 'operation:category:list',
        },
      },
    ],
  },
]