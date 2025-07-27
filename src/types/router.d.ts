declare module '@/router/modules/*' {
    import type { RouteRecordRaw } from 'vue-router'
    const routes: RouteRecordRaw[]
    export default routes
} 