import tooltipDirective from "@/hooks/tooltip/tooltipDirective"
import 'normalize.css/normalize.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
// 导入iconfont图标
import IconFont from "@/components/IconFont/IconFont.vue"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import CustomConfim from './components/CustomConfim'
import Message from './components/Message'
import onReachBottom from './hooks/onReachBottom'
import swipeDirective from './hooks/swipe/swipe'
import vSlideIn from './hooks/vSlideIn'

/* markdown编辑器 */
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

// highlightjs
import hljs from 'highlight.js';
// main.ts
// 如果只想导入css变量
import 'element-plus/theme-chalk/dark/css-vars.css'


VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
VMdEditor.use(createTodoListPlugin());




const app = createApp(App);

// 引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


// #region 注册全局变量 

//  $message 实例组件使用 const {proxy} = getCurrentInstance();proxy.$message调用
app.config.globalProperties.$message = Message
app.config.globalProperties.$customConfirm = CustomConfim
//#endregion

//#region  全局注册组件

app.component('Iconfont', IconFont)

//#endregion


//#region  全局注册自定义指令

// 提醒框指令
app.directive('tip', tooltipDirective);
// 滑动指令
app.directive('swipe',swipeDirective)
// 触底指令
app.directive('onReachBottom', onReachBottom);
// 向下滑动进入视口触发的动画指令  
app.directive('slideIn',vSlideIn)
//#endregion

//#region  挂载插件

app.use(pinia)
app.use(router)
app.use(VMdEditor);

//#endregion

app.mount('#app')
export default app


