export default [
  {
    path: '/operation',
    children: [
      {
        path: 'banner/list',
        component: () => import('@/views/banner/index.vue'),
        name: 'BannerList',
        meta: {
          title: 'banner管理',
          icon: 'el-icon-picture',
          activeMenu: '/operation/banner/list',
          isMenu: true,
          perms: 'operation:banner:list',
        },
      },
      {
        path: 'brand/list',
        component: () => import('@/views/brand/index.vue'),
        name: 'BrandList',
        meta: {
          title: '全球购管理',
          icon: 'el-icon-picture',
          activeMenu: '/operation/brand/list',
          isMenu: true,
          perms: 'operation:brand:list',
        },
      },
      {
        path: 'brand/detail/:id',
        component: () => import('@/views/brand/detail.vue'),
        name: 'BrandDetail',
        meta: {
          title: '全球购详情',
          icon: 'el-icon-picture',
          activeMenu: '/operation/brand/list',
          isMenu: false,
          perms: 'operation:brand:detail',
        },
      },
      {
        path: 'stock/list',
        component: () => import('@/views/stock/index.vue'),
        name: 'StockList',
        meta: {
          title: '库存管理',
          icon: 'el-icon-picture',
          activeMenu: '/operation/stock/list',
          isMenu: true,
          perms: 'operation:stock:list',
        },
      },
      {
        path: 'stock/detail/:category/:type',
        component: () => import('@/views/stock/detail.vue'),
        name: 'StockDetail',
        meta: {
          title: '库存详情',
          icon: 'el-icon-picture',
          activeMenu: '/operation/stock/list',
          isMenu: false,
          perms: 'operation:stock:detail',
        },
      },
      {
        path: 'clue/list',
        component: () => import('@/views/clue/index.vue'),
        name: 'ClueList',
        meta: {
          title: '线索管理',
          icon: 'el-icon-picture',
          activeMenu: '/operation/clue/list',
          isMenu: true,
          perms: 'operation:clue:list',
        },
      },
    ],
  },
]
