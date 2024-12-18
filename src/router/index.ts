import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '../views/login/LoginView.vue';
import homeView from "../views/HomeView.vue";
import app from '@/main.ts'
import LayoutComponent from '@/layout/LayoutComponent.vue';
import { extractNestedField } from '@/utils/extract';
import { useUserStore } from '@/stores/modules/user';
import { useRoutesStore } from '@/stores/modules/routes';



// 需要登录的页面 都有meta：isLoginRequired
// 隐藏头部的页面 都有meta：hideHeader




/* 常量路由 */
const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/home',
        name: 'home',
        component: homeView,
        meta: {
            title: "首页"
        }
    },


    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            title: "登录注册"
        }
    },
    {
        path: "/chatroom",
        name: "chatroom",
        component: () => import('../views/chatroom/ChatroomView.vue'),
        meta: {
            isLoginRequired: true,
            title: "聊天室"
        }
    },
    {
        path: "/article",
        name: "article",
        component: () => import('../views/article/ArticleView.vue'),
        meta: {
            title: "文章"
        }
    },
    {
        path: "/about",
        name: "about",
        component: () => import('../views/aboutme/AboutView.vue'),
        meta: {
            title: "关于"
        }
    },
    {
        path: "/tag",
        name: "tag",
        component: () => import('../views/tag/TagView.vue'),
        meta: {
            title: "标签"
        }
    },
    {
        path: "/category",
        name: "category",
        component: () => import('../views/Category/CategoryView.vue'),
        meta: {
            title: "分类"
        }

    },
    {
        path: "/timelines",
        name: "timelines",
        component: () => import('../views/timeline/TimeLine.vue'),
        meta: {
            title: "时间线"
        }
    },
    {
        path: '/center',
        name: 'center',
        component: LayoutComponent,
        redirect: "/center/home",
        meta: {
            hideHeader: true,
            title: "个人中心",
            isLoginRequired:true
        },
        children: [
            {
                path: "home",
                name: "centerhome",
                component: () => import("@/views/MyCenter/HomeView/HomeView.vue"),
                meta: {
                    title: "主页"
                }
            },
        ],

    },
    {
        path: "/",
        redirect: '/home'
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/NoFindVIew/NoFindVIew.vue'),
        meta: { title: '404', hideHeader: true, }
    },
    {
        path: "/redirect",
        name: "redirect",
        component: () => import("@/views/LoadDynamicRoute/LoadDynamicRoute.vue"),
        meta: {
            hideHeader: true,
            
        }
    }

    ,
    {
        path: "/:pathMatch(.*)*",
        redirect: (to) => {
            return { path: "/redirect", query: { redirect: to.fullPath } };
        },
    },

]

const constantRoutesNames = extractNestedField(constantRoutes, 'name', 'children');

/* 动态路由 */
const dynaticRoutes: RouteRecordRaw[] = [
    {
        path: "permission",
        name: "permission",
        component: () => import("@/views/MyCenter/permission/PermissionView.vue"),
        meta: {
            title: "权限管理",
            permission: 'permission',
            icon:"icon-assignPermissions-o",
            isLoginRequired:true,
            keepAlive:true
        }
    },
    {
        path: "role",
        name: "role",
        component: () => import("@/views/MyCenter/RoleView/RoleView.vue"),
        meta: {
            title: "角色管理",
            permission: 'role',
            icon:"icon-menu_role",
            isLoginRequired:true,
            keepAlive:true
        }
    },
    {
        path: "user",
        name: "user",
        component: () => import("@/views/MyCenter/UserView/UserView.vue"),
        meta: {
            title: "用户管理",
            permission: 'user',
            icon:"icon-yonghu",
            isLoginRequired:true,
            keepAlive:true
        }
    },
    {
        path: "category",
        name: "categorycenter",
        component: () => import("@/views/MyCenter/CategoryAdminView/CategoryAdminView.vue"),
        meta: {
            title: "分类管理",
            permission: 'category',
            icon:"icon-fenlei1",
            isLoginRequired:true,
            keepAlive:true
        }
    },
    {
        path: "markdown",
        name: "markdown",
        component: () => import("@/views/MyCenter/MarkdownView/MarkdownView.vue"),
        meta: {
            permission: "article",
            title: "文章管理",
            icon:"icon-guanliwenzhang",
            isLoginRequired:true,
            keepAlive:true
        },
        redirect: "/center/markdown/notes",
        children: [
            {
                path: "edit/:noteId?/:fileId?",
                name: "editnote",
                component: () => import("@/views/MyCenter/MarkdownView/EditView/EditView.vue"),
                meta: {
                    title: "编辑文章",
                    permission: "article/edit",
                    icon:"icon-bianjiwenzhang_huaban",
                    isLoginRequired:true,
                    keepAlive:true,
                }
            },
            {
                path: "notes",
                name: "notes",
                component: () => import("@/views/MyCenter/MarkdownView/NotesView/NotesView.vue"),
                meta: {
                    title: "笔记管理",
                    hideHeader: true,
                    permission: "article/notes",
                    icon:"icon-wenzhang",
                    isLoginRequired:true,
                    keepAlive:true,
                }
            }
        ]

    },
    {
        path: "comment",
        name: "comment",
        component: () => import("@/views/MyCenter/MarkdownView/MarkdownView.vue"),
        meta: {
            permission: "comment",
            title: "评论管理",
            icon:"icon-wodepinglun",
            isLoginRequired:true,
            keepAlive:true,
            badgeName:"unAnsweredCoumt",
        },
        redirect: "/comment/my",
        children: [
            {
                path: "my",
                name: "mycomment",
                component: () => import("@/views/MyCenter/CommentView/MyCommentView.vue"),
                meta: {
                    title: "我的评论",
                    permission: "comment/my",
                    icon:"icon-wodepinglun1",
                    isLoginRequired:true,
                    keepAlive:true,
                    badgeName:"unAnsweredCoumt",
                }
            },
            {
                path: "manage",
                name: "managecomment",
                component: () => import("@/views/MyCenter/CommentView/ManageComment.vue"),
                meta: {
                    title: "管理评论",
                    permission: "comment/manage",
                    icon:"icon-pinglunguanli",
                    isLoginRequired:true,
                    keepAlive:true,
                    badgeName:"unReviewCount"
                }
            },
        ]

    },
    
]




/* 添加路由的函数 */

// 动态添加路由到根路由的子路由
// 动态更新根路由的子路由


// 动态添加/移除路由到 'center' 路由下的子路由
export function updateDynamicRoutes(
    permissions: Permission[], // 权限列表
    dynamicRoutes: RouteRecordRaw[],// 动态路由
): RouteRecordRaw[] {

    // 根据权限动态生成路由
    const updatedCenterChildren = [] as RouteRecordRaw[];


    // 2. 添加符合权限的动态路由
    permissions.forEach(permission => {
        if (permission.type === "route") {
            const dynamicRoute = dynamicRoutes.find(route => route.meta?.permission === permission.permissionName);

            if (dynamicRoute) {
                // @ts-ignore
                const routeToAdd: RouteRecordRaw = { ...dynamicRoute };

                // 处理子路由
                if (dynamicRoute.children && dynamicRoute.children.length > 0) {
                    routeToAdd.children = [];
                    const childPermissions = permission.children || [];
                    childPermissions.forEach(childPermission => {
                        const childRoute = dynamicRoute.children?.find(
                            child => child.meta?.permission === childPermission.permissionName
                        );
                        if (childRoute) {
                            // @ts-ignore
                            (routeToAdd.children as RouteRecordRaw[]).push({ ...childRoute });
                        }
                    });
                }

                updatedCenterChildren.push(routeToAdd); // 添加符合权限的动态路由
            }
        }
    });

    // 3. 更新 'center' 路由的子路由为最新的符合权限的路由
    // @ts-ignore

    // 返回最新的动态路由
    return updatedCenterChildren
}


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        return {
            left: 0,
            top: 0
        }
    }
})


/* 监听权限的变化 */

const routesStore = useRoutesStore()

export async function createDynamicRoutes(newPermissions: Permission[], oldPermissions: Permission[]): void {
    // 比较新旧权限是否相同
    if (JSON.stringify(newPermissions) !== JSON.stringify(oldPermissions)) {
        // 等待 DOM 更新
        // 更新动态路由
        const routes = updateDynamicRoutes(newPermissions, dynaticRoutes);
        console.log("Updated Routes:", routes);
        const currentRouteNames: string[] = router.getRoutes().map(route => route.name);
        // 动态添加路由 如果不存在则添加
        routes.forEach((route) => {
            if (!currentRouteNames.includes(route.name)) {
                console.log(`添加路由: ${route.name}`);
                router.addRoute("center", route);
                routesStore.addRoute(route)
            }
        });
        // 如果不在这个路由中的则移除 但是不包括常量路由的

        // 获取现有的路由并筛选出不在新权限中的路由
        const currentRoutes = router.getRoutes();
        const newRouteNames = extractNestedField(routes, "name", "children")

        const newNames = [...constantRoutesNames, ...newRouteNames]
        const newNamesMap = Array.from(new Set(newNames));
        currentRoutes.forEach(route => {
            // 排除常量路由（例如：`home`, `login` 等），并移除不再需要的路由
            if (route.name && !newNamesMap.includes(route.name)) {
                console.log(`移除路由: ${route.name}`);
                router.removeRoute(route.name);
                routesStore.removeRoute(route)
            }
        });

    }
}

const userStore = useUserStore()

router.beforeEach(async (to, from, next) => {


    // 如果是需要登录的页面则跳转到登录页面
    if (to.meta.isLoginRequired && !userStore.isLogin) {
        app.config.globalProperties.$message({ text: "尚未登录", type: "warn" })
        next('/login');
    } else if (to.path === "/login" && userStore.isLogin) {
        // 不能跳转到登录页面
        app.config.globalProperties.$message({ text: "已经登录了，请退出登录后重试", type: "warn" });
        // 返回先前页面
        next(from.path)
    } else {
        if (to.path.startsWith("/center")) {
            if(to.name === "center" || to.name === "centerhome" ){
                routesStore.clearTags()
            }else{
                routesStore.addTag(to)
            }
            next()
        } else {

            next()
        }

    }
})

router.afterEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + "📍天空之城"
    }
})

export default router
