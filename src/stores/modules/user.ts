import { defineStore } from "pinia"
import pinia from "@/stores";
import { reqGetUserInfo } from "@/api/user";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { createDynamicRoutes } from "@/router";
import { extractProNestedField } from "@/utils/extract";

export const useUserStore = defineStore("user", {
    state: () => {
        const jwtToken: string = localStorage.getItem("jwtToken") || "";
        const userInfo: UserInfo = getLocalStorage("userInfo") || {
            account: "",      // 用户账号
            avatar: "",      // 用户头像 URL
            currentRole: {
                roleId: "",
                roleName: ""
            },  // 当前角色
            email: "",   // 用户邮箱
            isLogin: false,     // 登录状态
            signature: '',    // 用户签名
            username: '',    // 用户名
            userId: "",       // 用户 ID
        };
        const currentRole: Role = getLocalStorage("currentRole") || {
            roleId: "",
            roleName: ""
        };
        const permissions: Permission[] = getLocalStorage("permissions") || [];
        const roles: roleType[] = getLocalStorage("roles") || []
        let isReqUserInfo = false; //是否正在请求用户信息 如果在的话 就不要再发请求了 这是为了避免重定向的时候请求两次路由

        return {
            jwtToken,
            userInfo,
            permissions,
            roles,
            currentRole,
            isReqUserInfo,
        }
    },
    actions: {
        login(token: string): void {
            // 根据登陆信息 处理得到JWT 保存JWT
            localStorage.setItem('jwtToken', token);
            this.jwtToken = token;
            nextTick()
            this.getUserInfo()
        },
        logout() {
            this.jwtToken = "";
            localStorage.removeItem('jwtToken');
            removeLocalStorage("currentRole");
            removeLocalStorage("permissions");
            removeLocalStorage("userInfo");
            removeLocalStorage("roles");
            ElMessage({ message: "登录失效，退出登录" });
            // 跳转到首页
            window.location.href = '/login'
        },
        getUserInfo: async function (tempdata: { type?: number, roleId?: number | null } = { type: 0 }) {
            if (this.isReqUserInfo) return;
            try {
                this.isReqUserInfo = true
                const oldPermission = this.permissions;
                /*  
                    type = 0 改变角色 初始 roleId
                */
                const reqData = {
                    type: tempdata.type,
                    roleId: tempdata.roleId || this.currentRole.roleId
                }
                const { code, data: { userInfo, token }, ErrorMessage } = await reqGetUserInfo(reqData)
                if (code == 200) {
                    /* 储存token */
                    localStorage.removeItem('jwtToken');
                    localStorage.setItem('jwtToken', token);
                    this.jwtToken = token;

                    const userData = userInfo as UserData;
                    this.userInfo.account = userData.account;
                    this.userInfo.avatar = userData.avatar;
                    this.userInfo.currentRole.roleId = userData?.currentRole?.roleId || null;
                    this.userInfo.currentRole.roleName = userData?.currentRole?.roleName || '';
                    this.userInfo.email = userData.email
                    this.userInfo.isLogin = userData.is_login == '1' ? true : false;
                    this.userInfo.signature = userData.signature
                    this.userInfo.userId = userData.user_id
                    this.userInfo.username = userData.username;
                    this.permissions = userData.permissions;
                    this.currentRole = userData.currentRole;
                    this.roles = userData.roles;

                    /* 储存基本信息到本地 */
                    setLocalStorage('currentRole', JSON.stringify(userData.currentRole));
                    setLocalStorage("userInfo", JSON.stringify(this.userInfo));
                    setLocalStorage("permissions", JSON.stringify(this.permissions));
                    setLocalStorage("roles", JSON.stringify(this.roles));

                    if (userData.permissions) {
                        await createDynamicRoutes(userData.permissions, oldPermission);
                    }
                } else {
                    this.logout()
                }
            } catch (error) {
                console.log(error);
                debugger;
                this.logout();
            } finally {
                this.isReqUserInfo = false
            }
        },
        /* 判断有无权限 */
        isHasButtonPermission(permission: string) {
            if (this.buttonPermission.includes(permission)) {
                return true
            } else {
                return false
            }
        }
    },
    getters: {
        isLogin(state) {
            return state.jwtToken ? true : false;
        },
        /* 按钮的权限 */
        buttonPermission(state) {
            return extractProNestedField(state.permissions, "type", "permissionName", type => type === "button", "children")
        }
    }
})

export function useUserStoreWithOut() {
    return useUserStore(pinia)
}