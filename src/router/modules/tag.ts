export default [
  {
    path: '/operation',
    children: [
      {
        path: 'tag/list',
        component: () => import('@/views/tag/index.vue'),
        name: 'TagList',
        meta: {
          title: '标签管理',
          icon: 'el-icon-price-tag',
          activeMenu: '/operation/tag/list',
          isMenu: true,
          perms: 'operation:tag:list',
        },
      },
    ],
  },
]