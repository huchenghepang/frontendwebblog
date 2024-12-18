import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { defineStore } from "pinia";



// 定义状态类型，setting 模块的状态
interface settingState {
    // 在此处添加状态的其他字段并为其定义类型
    // 示例：count: number;
    isShowNavBar: boolean;
    isShowUserInfo: boolean;
    isShowTagNavBar: boolean;
    globalTheme: boolean;
}

const useSettingStore = defineStore('settingStore', {
    state(): settingState {
        return {
            isShowNavBar: getLocalStorage("isShowNavBar") ?? true,
            isShowUserInfo: getLocalStorage("isShowUserInfo") ?? true,
            isShowTagNavBar: getLocalStorage("isShowTagNavBar") ?? true,
            globalTheme: getLocalStorage("globalTheme") ?? true
            // 在这里初始化其他状态字段
        };
    },
    actions: {
        // 在这里定义用于改变状态的actions
        changeTheme(value: boolean) {
            if (value) {
                document.documentElement.setAttribute('data-theme', 'dark');
                removeLocalStorage('notebook-background-color');
                setLocalStorage('globalTheme', 'true')
            } else {
                document.documentElement.removeAttribute('data-theme');
                setLocalStorage('globalTheme', 'false')
            }
        },

        /**
                 * 根据系统主题模式更新页面主题
                 * 如果系统主题为暗色模式，则将页面主题设置为暗色；否则设置为亮色
                 * @returns {boolean} 返回当前主题是否为暗色模式
                 */
        updateThemeBasedOnSystem() {
            // 如果浏览器不支持 matchMedia API，则直接返回
            if (!window.matchMedia) return
            // 创建一个 MediaQueryList 对象，用于检测系统是否偏好暗色主题
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // 判断当前系统主题模式
            if (darkModeQuery.matches) {
                // 如果系统是暗色模式
                this.changeTheme(true)
                return true
            } else {
                // 如果系统是亮色模式
                this.changeTheme(false)
                return false
            }
            /*      // 监听系统主题变化
                darkModeQuery.addEventListener('change', (e) => {
                    if (e.matches) {
                        document.documentElement.setAttribute('data-theme', 'dark');
                    } else {
                        document.documentElement.setAttribute('data-theme', 'light');
                    }
                }); */
        }
    },
    getters: {
        // 在这里定义获取状态的getters
    }
});

// setting 仓库 - 该仓库管理 setting 模块的状态
export default useSettingStore;