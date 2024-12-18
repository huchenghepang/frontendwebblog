export function updateThemeBasedOnSystem() {
    if(!window.matchMedia) return 
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 判断当前系统主题模式
    if (darkModeQuery.matches) {
        // 如果系统是暗色模式
        document.documentElement.setAttribute('data-theme', 'dark');
        return true
    } else {
        // 如果系统是亮色模式
        document.documentElement.setAttribute('data-theme', 'light');
        return false
    }

/*     // 监听系统主题变化
    darkModeQuery.addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }); */
}
