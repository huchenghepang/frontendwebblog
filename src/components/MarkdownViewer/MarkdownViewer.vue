<template>
    <TableOfContents :toc="tableOfContents" />

    <div class="markdown-header">
        <h1 class="markdown-title">
            {{ articleInfo.title }}
        </h1>
        <div class="markdown-datetime">
            <span>创建时间：{{ articleInfo.datetime }} | </span>
            <span>编辑时间：{{ articleInfo.editTimeDays }}天前 |</span>
            <span>阅读量：{{ articleInfo.reading }}</span>
        </div>
    </div>
    <div v-if="htmlContent" class="markdown-content" v-html="htmlContent" />
    <!-- 默认插槽 -->
    <slot>
        <div v-if="!htmlContent" class="markdown-content">
            <div class="loading" style="width: 200px; display: flex; text-align: center; margin: 80px auto 0">
                <h3>加载中...</h3>
            </div>
        </div>
    </slot>
    <FloatingBall :is-alway-show="true"
        style="background-color: blanchedalmond; margin-top: 300px; margin-bottom: 50px">
        <button @click="backToTop">
            回到顶部
        </button>
    </FloatingBall>
    <FloatingBall class="ball-showhidden-toggle" style="margin-top: 400px">
        <button @click="onShowDir">
            显示
        </button>
        <button @click="onHiddenDir">
            隐藏
        </button>
    </FloatingBall>
    <Carousel :images="images" :is-open="isOpen" @close="closeCarousel" />
</template>

<script lang="ts" name="MarkdownViewer">
    import emitter from '@/utils/mitt'
    // import FloatingBall from "@/components/FloatingBall/FloatingBall.vue";
    import { ref, onMounted, watch } from 'vue'
    import MarkdownIt from 'markdown-it'
    import markdownItAnchor from 'markdown-it-anchor'
    import hljs from 'highlight.js' // 引入Highlight.js
    import 'highlight.js/styles/atom-one-dark.css'
    import javascript from 'highlight.js/lib/languages/javascript' // 引入 javascript 语言
    import powershell from 'highlight.js/lib/languages/powershell' // 引入 powershell 语言
    import python from 'highlight.js/lib/languages/python'; // Python 支持
    import java from 'highlight.js/lib/languages/java'; // Java 支持
    import sql from 'highlight.js/lib/languages/sql'; // SQL 支持
    import { v4 as uuidv4 } from 'uuid'
    import TableOfContents from '@/components/MarkdownViewer/TableOfContents/TableOfContents.vue'
    import { tasklist } from '@mdit/plugin-tasklist'
    import linkAttributes from 'markdown-it-link-attributes'
    import Carousel from '../Carousel/Carousel.vue'
    import markdownItContainer from 'markdown-it-container'
    import markdownItFootnote from 'markdown-it-footnote'
    import { ins } from "@mdit/plugin-ins";
    import { mark } from "@mdit/plugin-mark";

    // 注册需要的语言
    hljs.registerLanguage('python', python);
    hljs.registerLanguage('java', java);
    hljs.registerLanguage('sql', sql);
    hljs.registerLanguage('powershell', powershell) // 注册 语言
    hljs.registerLanguage('vue', javascript) // 注册 语言

    export default {
        components: {
            TableOfContents
        },
        props: {
            content: {
                type: [String] // 可以是文本、URL对象或文件对象
            },
            mdUrl: {
                type: String
            },
            file: {
                type: File
            },
            articleInfo: {
                type: Object,
                default: () => ({
                    title: '未知',
                    datetime: '2023-01-01', // 文章的创建日期
                    editTimeDays: 30, // 文章的编辑天数
                    reading: 0
                })
            }
        },

        setup(props) {
            // 监听content文本的变化 以处理不同的笔记信息
            const isOpen = ref(false)
            // 回到顶部
            const backToTop = () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
            const images = ref([])
            const htmlContent = ref('')
            const tableOfContents = ref([]);

            const options = {
                html: true, // true在源码中支持HTML标签 不安全因为XSS注入攻击
                linkify: false, // 设成 true 来自动转化像 URL 的文本成链接
                typographer: true, //设成 true 来启用某些语言中性的替换以及引号的美化（智能引号）
                breaks: false, //设成 true 来转化段落里的 \n 成 <br>
                xhtmlOut: false, // 设置成true给闭合的单标签添加‘/’
                langPrefix: 'language-', // 给围栏代码块的 CSS 语言类前缀。对拓展的高亮器来说很有用。
                highlight: (str, lang) => {

                    str = escapeHtml(str)
                    // 高亮函数
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return (`<pre class="hljs" style="position:relative"><span onClick="((event) => {const element = event.target.nextSibling;
                                const text = element.textContent || element.innerText;
                                if (!text) {
                                    console.warn('没有文本内容可复制');
                                    return false;
                                }
                                // 使用 Clipboard API 进行文本复制
                                navigator.clipboard.writeText(text).then(() => {
                                    // 添加已复制的类
                                    event.target.classList.add('copied');
                                    setTimeout(() => {
                                        event.target.classList.remove('copied');
                                    }, 3000);
                                }).catch(err => {
                                    console.error('复制失败:', err);
                                });
                                })(event)"
                            class="top-right-code-tag">${lang}</span><code class="code-container language-${lang}">` + hljs.highlight(str, { language: lang }).value.trim() + '</code></pre>')
                        } catch (error) {
                            console.error('高亮失败:', error)
                            return `<pre class="hljs"><code class="code-container">${str}</code></pre>`;
                        }
                    }
                    // 如果没有指定语言或高亮失败，默认降级为 plaintext
                    // console.warn(`未指定或不支持的语言：${lang}`);
                    return (`<pre class="hljs" style="position:relative"><span onClick="((event) => {const element = event.target.nextSibling;
                                const text = element.textContent || element.innerText;
                                if (!text) {
                                    console.warn('没有文本内容可复制');
                                    return false;
                                }
                                // 使用 Clipboard API 进行文本复制
                                navigator.clipboard.writeText(text).then(() => {
                                    // 添加已复制的类
                                    event.target.classList.add('copied');
                                    setTimeout(() => {
                                        event.target.classList.remove('copied');
                                    }, 3000);
                                }).catch(err => {
                                    console.error('复制失败:', err);
                                });
                                })(event)"
                            class="top-right-code-tag">plaintext</span><code class="code-container language-plaintext">` + str.trim() + '</code></pre>')
                }
            }

            // 安全转义 HTML，防止 XSS 攻击
            function escapeHtml(unsafe) {
                return unsafe
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            }

            // 当前的目录位置
            let currentDirectoryLevel = ref({ firstDir: 0, secondDir: 0, thirdDir: 0 })

            const generateTableOfContents = (markdown: string) => {
                // 更新 HTML 内容
                htmlContent.value = md.render(markdown)
            }

            const md = new MarkdownIt(options).use(markdownItAnchor, {
                slugify: (str) => uuidv4(),
                callback: (token, data) => {
                    const { slug, title } = data
                    const level = parseInt(token.tag.replace('#', '').split('')[1], 10)
                    const newItem = { id: slug, title, level, children: [], isOpen: false }

                    if (level === 1) {
                        // 一级目录直接添加
                        tableOfContents.value.push(newItem)
                        currentDirectoryLevel.value.firstDir++
                        currentDirectoryLevel.value.secondDir = 0
                        currentDirectoryLevel.value.thirdDir = 0
                    } else if (level === 2) {
                        // 检查并创建一级目录占位符
                        if (currentDirectoryLevel.value.firstDir === 0) {
                            const firstDirPlaceholder = {
                                id: uuidv4(),
                                title: undefined,
                                level: 1,
                                children: [],
                                isOpen: true
                            }
                            tableOfContents.value.push(firstDirPlaceholder)
                            currentDirectoryLevel.value.firstDir++
                        }
                        // 二级目录在一级目录中添加
                        const firstDir = tableOfContents.value[currentDirectoryLevel.value.firstDir - 1]
                        firstDir.children.push(newItem)
                        currentDirectoryLevel.value.secondDir++
                        currentDirectoryLevel.value.thirdDir = 0
                    } else if (level === 3) {
                        // 检查并创建一级目录占位符
                        if (currentDirectoryLevel.value.firstDir === 0) {
                            const firstDirPlaceholder = {
                                id: uuidv4(),
                                title: undefined,
                                level: 1,
                                children: [],
                                isOpen: true
                            }
                            tableOfContents.value.push(firstDirPlaceholder)
                            currentDirectoryLevel.value.firstDir++
                        }
                        // 检查并创建二级目录占位符
                        const firstDir = tableOfContents.value[currentDirectoryLevel.value.firstDir - 1]
                        if (
                            firstDir.children.length === 0 ||
                            !firstDir.children[currentDirectoryLevel.value.secondDir - 1]
                        ) {
                            const secondDirPlaceholder = {
                                id: uuidv4(),
                                title: undefined,
                                level: 2,
                                children: [],
                                isOpen: true
                            }
                            firstDir.children.push(secondDirPlaceholder)
                            currentDirectoryLevel.value.secondDir++
                        }
                        // 三级目录在二级目录中添加
                        const secondDir = firstDir.children[currentDirectoryLevel.value.secondDir - 1]
                        secondDir.children.push(newItem)
                        currentDirectoryLevel.value.thirdDir++
                    }
                }
            })

            /* 对标签的支持 */
            md.use(ins).use(mark);

            /* 提供任务列表支持 */
            md.use(tasklist, {
                label: {
                    checked: '[x]',
                    unchecked: '[ ]'
                }
            })


            /* 对表格的支持 */
            md.renderer.rules.table_open = () => {
                return '<table class="custom-table">';
            };

            // 重写链接的渲染规则
            md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
                // 获取当前链接的 token
                const token = tokens[idx];

                // 给链接添加自定义类名
                token.attrPush(['class', 'custom-link']);

                // 调用默认渲染方法
                return self.renderToken(tokens, idx, options);
            };

            //#region 引入自定义框
            md.use(markdownItContainer, 'warning', {
                validate: function (params) {
                    return params.trim().match(/^warning\s+(.*)$/);
                },
                render: function (tokens, idx) {
                    const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/);

                    if (tokens[idx].nesting === 1) {
                        // 开始标签，取参数作为标题
                        const title = m ? m[1] : '警告';
                        return `<div class="warning"><strong>${title}</strong>\n`;
                    } else {
                        // 结束标签
                        return '</div>\n';
                    }
                },
            }).use(markdownItContainer, 'tip', {
                validate: function (params) {
                    return params.trim().match(/^tip\s+(.*)$/);
                },
                render: function (tokens, idx) {
                    const m = tokens[idx].info.trim().match(/^tip\s+(.*)$/);
                    if (tokens[idx].nesting === 1) {
                        // 开始标签，取参数作为标题
                        const title = m ? m[1] : '提示';
                        return `<div class="tip"><strong>${title}</strong>\n`;
                    } else {
                        // 结束标签
                        return '</div>\n';
                    }
                },
            }).use(markdownItContainer, 'success', {
                validate: function (params) {
                    return params.trim().match(/^success\s+(.*)$/);
                },
                render: function (tokens, idx) {
                    const m = tokens[idx].info.trim().match(/^success\s+(.*)$/);
                    if (tokens[idx].nesting === 1) {
                        // 开始标签，取参数作为标题
                        const title = m ? m[1] : '成功';
                        return `<div class="success"><strong>${title}</strong>\n`;
                    } else {
                        // 结束标签
                        return '</div>\n';
                    }
                },
            }).use(markdownItContainer, 'info', {
                validate: function (params) {
                    return params.trim().match(/^info\s+(.*)$/);
                },
                render: function (tokens, idx) {
                    const m = tokens[idx].info.trim().match(/^info\s+(.*)$/);
                    if (tokens[idx].nesting === 1) {
                        // 开始标签，取参数作为标题
                        const title = m ? m[1] : '信息';
                        return `<div class="info"><strong>${title}</strong>\n`;
                    } else {
                        // 结束标签
                        return '</div>\n';
                    }
                },
            }).use(markdownItContainer, 'error', {
                validate: function (params) {
                    return params.trim().match(/^error\s+(.*)$/);
                },
                render: function (tokens, idx) {
                    const m = tokens[idx].info.trim().match(/^error\s+(.*)$/);
                    if (tokens[idx].nesting === 1) {
                        // 开始标签，取参数作为标题
                        const title = m ? m[1] : '错误';
                        return `<div class="error"><strong>${title}</strong>\n`;
                    } else {
                        // 结束标签
                        return '</div>\n';
                    }
                },
            });





            //#endregion

            //#region 引入脚注
            md.use(markdownItFootnote);
            //#endregion

            // 处理对于图片的外连接支持

            const localImagePath = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_BASE_URL_DOWNLOAD_PATH

            // 自定义规则
            md.renderer.rules.image = (tokens, idx, options, env, self) => {
                // 获取图片的URL和alt文本
                const src = tokens[idx].attrGet('src')
                const alt = tokens[idx].content || ''
                // 正则判断 是否是外部链接还是内部链接
                const isExternalLink = /^(https?:)?\/\//i
                if (!isExternalLink.test(src)) {
                    const localImageURL = localImagePath + src
                    images.value.push(localImageURL)
                    return `
                    <div class="note-image-container">
                                <img class="note-image" 
                                onload="((event)=>{
                                    event.target.classList.add('note-loaded')})(event)
                                "
                                onerror="((event)=>{
                                    event.target.classList.add('note-error')})(event)
                                "
                                onclick="((event)=>{self.globalOpenCarousel()})(event)"
                                src="${localImageURL}" alt="${alt}" loading="lazy" style="max-width: 100%;" />
                                <div class="note-loading-spinner"></div> <!-- loading 动画 -->
                    </div>`
                }

                images.value.push(src)
                // 如果是本地图片，添加 baseURL
                return `
                <div class="note-image-container">
                                <img class="note-image" 
                                onLoad="((event)=>{
                                    event.target.classList.add('note-loaded')})(event)
                                "
                                onerror="((event)=>{
                                    event.target.classList.add('note-error')})(event)
                                "
                                onclick="((event)=>{self.globalOpenCarousel()})(event)"
                                src="${src}" alt="${alt}" loading="lazy" style="max-width: 100%;" />
                                <div class="note-loading-spinner"></div> <!-- loading 动画 -->
                    </div>
                `
            }

            // 自定义渲染规则，过滤掉 <script> 标签和所有以 "on" 开头的事件属性
            md.renderer.rules.html_block = function (tokens, idx) {
                let content = tokens[idx].content

                // 1. 过滤掉 <script> 标签及其内容
                content = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')

                // 2. 过滤掉所有以 "on" 开头的事件属性
                content = content.replace(/\s*on\w+="[^"]*"/gi, '').replace(/\s*on\w+='\w*'/gi, '');
                return content
            }

            md.renderer.rules.html_inline = function (tokens, idx) {
                let content = tokens[idx].content

                // 1. 过滤掉 <script> 标签及其内容
                content = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')

                // 2. 过滤掉所有以 "on" 开头的事件属性
                content = content.replace(/\s*on\w+="[^"]*"/gi, '').replace(/\s*on\w+='\w*'/gi, '')

                return content
            }

            md.use(linkAttributes, {
                pattern: /^https?:\/\//, // 匹配 HTTP 链接
                attrs: {
                    target: '_blank',
                    rel: 'noopener' // 为了安全建议加上
                }
            })



            const fetchMarkdown = async (url: string) => {
                try {
                    const response = await fetch(url)
                    if (!response.ok) {
                        throw new Error('网络响应不是一个OK')
                    }
                    const text = await response.text()
                    generateTableOfContents(text) // 使用markdown-it进行转译
                } catch (error) {
                    console.error('获取Markdown失败:', error)
                }
            }

            const readLocalFile = (file) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    generateTableOfContents(event.target.result) // 使用markdown-it进行转译
                }
                reader.readAsText(file)
            }

            function handlerMatchMD(props) {
                if (props.content) {
                    // 如果是文本，直接转换
                    generateTableOfContents(props.content)
                } else if (props.mdUrl) {
                    // 如果是网络链接则请求资源
                    fetchMarkdown(props.mdUrl)
                } else if (props.file) {
                    // 如果是本地文件，读取并转换
                    readLocalFile(props.file)
                }
            }

            function openImage() {
                isOpen.value = true
            }
            function closeCarousel(data) {
                console.log(data)

                isOpen.value = false
            }
            onMounted(() => {
                handlerMatchMD(props)
                // hljs.highlightAll(); // 自动处理页面中所有代码块

                /* 挂载变量方法到全局 */
                if (!self.globalOpenCarousel) {
                    self.globalOpenCarousel = openImage
                }
            })

            watch(
                () => props.content,
                (newValue, oldValue) => {
                    tableOfContents.value = []
                    images.value = []
                    currentDirectoryLevel.value = { firstDir: 0, secondDir: 0, thirdDir: 0 }
                    if (props.content) {
                        // 如果是文本，直接转换
                        generateTableOfContents(newValue)
                    }
                }
            )
            watch(
                () => props.mdUrl,
                (newValue, oldValue) => {
                    tableOfContents.value = []
                    currentDirectoryLevel.value = { firstDir: 0, secondDir: 0, thirdDir: 0 }
                    fetchMarkdown(newValue)
                }
            )
            watch(
                () => props.file,
                (newValue, oldValue) => {
                    tableOfContents.value = []
                    currentDirectoryLevel.value = { firstDir: 0, secondDir: 0, thirdDir: 0 }
                    readLocalFile(newValue)
                }
            )

            const onShowDir = () => {
                emitter.emit('onShowHiddenDir', false)
            }
            // 隐藏目录

            const onHiddenDir = () => {
                emitter.emit('onShowHiddenDir', true)
            }

            const isShowBtn = ref(true)

            return {
                htmlContent,
                tableOfContents,
                handlerMatchMD,
                backToTop,
                onShowDir,
                onHiddenDir,
                isShowBtn,
                images,
                isOpen,
                openImage,
                closeCarousel,
                escapeHtml
            }
        }
    }
</script>

<style lang="scss">



    /* 文章头部 */
    .markdown-header {
        display: flex;
        flex-direction: column;
        /* 垂直排列标题和日期 */
        align-items: center;
        /* 居中对齐 */
        margin: 20px 0;
        /* 外边距 */
    }

    .markdown-title {
        font-size: 3rem;
        /* 标题字体大小 */
        font-weight: bold;
        margin: 0;
        padding: 10px 0;
        text-align: center;
        color: #222;
        /* 主文本颜色 */
        background: linear-gradient(to right, #ff8c00, #ff0080);
        /* 渐变色 */
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
        /* 轻微阴影 */
    }

    .markdown-datetime {
        font-size: 1rem;
        /* 日期字体大小 */
        color: #666;
        /* 日期文字颜色 */
        background: #f1f1f1;
        /* 背景色 */
        padding: 5px 12px;
        border-radius: 8px;
        /* 圆角 */
        margin-top: 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        /* 轻微阴影效果 */
        font-style: italic;
        /* 斜体 */
    }

    .markdown-content {
        width: min($notebook-area-width, 60%);
        max-width: 1500px;
        padding: 10px 10px 10px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 10px;
        padding: 16px 32px 32px;
        font-size: 1rem;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
        line-height: 1.5;
        word-wrap: break-word;

        /* 行内代码块元素有背景阴影效果 */

        /* 选择所有行内代码 <code>，但排除在 <pre> 标签内的 <code> */
        code:not(pre code) {
            @include single_code_style();
        }

        &:first-child {
            margin-top: 0;
        }


        .custom-table {
            @include table_style();
        }


        p {
            padding: 0.4rem 0;
            margin-bottom: 1rem;
            @include ntb_ft_color();
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: "PT Serif", "Bitter", serif;
            // color: #2c3e50;
            mix-blend-mode: differenc;
            @include article_title_style();
        }

        h1,
        h2,
        h3 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }

        h4,
        h5,
        h6 {
            font-family: "PT Serif", "Bitter", serif;
            margin-top: 16px;
            margin-bottom: 8px;
        }

        h1 {
            color: #2c3e50;
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.25;
            padding-bottom: .3em;
            border-bottom: 1px solid #eaecef;
        }

        h2 {
            font-size: 1.5rem;
            padding-bottom: .3em;
            border-bottom: 1px solid #eaecef;
            color: #2c3e50;
        }

        h3 {
            font-size: 1.25em;
        }

        ol,
        ul {
            padding-left: 2rem;
            border-bottom: 1rem;
        }

        ul {
            list-style-type: disc;
        }

        li {
            @include ntb_ft_color();
        }

        // 分割线样式
        hr {
            height: .25em;
            margin: 24px 0;
            padding: 0;
            background-color: #e1e4e8;
            border: 0;
        }

        /* 自定义链接 */
        .custom-link {
            color: #17548d;
            text-decoration: underline;
        }
    }



    // 文本信息
    .top-right-code-tag {
        // 文字背景包裹
        background-color: rgba(59, 55, 55, 0.6);
        // 文字位置
        position: absolute;
        top: 10px;
        right: 25px;
        // 文字样式
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 3px;
        color: #838282;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.8);
        }
    }

    .hljs {
        width: 100%;
        // 水平居中
        margin: 0 auto;
        background-color: $code-background-color;
        overflow: auto !important;
        border-radius: 5px;
        padding: 10px;
        position: relative;

        .top-right-code-tag {
            position: absolute;
            top: 0;
            right: 0;
        }

        // 隐藏滚动条
        &::-webkit-scrollbar {
            height: 4px;
            background-color: #a83e3e;
        }

        /* 滚动条的轨道 */
        &::-webkit-scrollbar-track {
            background: #53c2f5;
            border-radius: 6px;
        }

        /* 滚动条中的滑块 */
        &::-webkit-scrollbar-thumb {
            background: #d48c8c;
            border-radius: 6px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: #e1f182;
        }

        // 代码区域颜色
        &.code-container {
            background-color: $code-background-color;
            border-radius: 5px;
            padding: 10px;
        }
    }

    .hljs:hover {
        .top-right-code-tag {
            color: transparent;

            &::after {
                background-color: #a83e3e !important;
                display: block;
                width: 100%;
                content: '复制';
                position: absolute;
                top: 0;
                left: 0;
                // 文字样式
                font-size: 12px;
                padding: 5px 0px;
                border-radius: 3px;
                color: #fafafa;
                font-weight: bold;
                cursor: pointer;
                text-align: center;
                transition: all 0.3s ease-in-out;
            }

            &.copied::after {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                content: '已复制' !important;
                font-size: 14px;
                transform: scaleY(1.1);
                text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
            }
        }
    }


    // 移动端显示宽度为屏幕宽度

    @media screen and (max-width: 768px) {
        .markdown-content {
            width: 100vw;
            box-sizing: border-box;
            padding: 10px;

            ol {
                padding-left: 10px;
            }

            .hljs {
                width: 100%;
                overflow: auto;
                padding: 4px;
                padding-left: 5px;

                // 隐藏滚动条
                &::-webkit-scrollbar {
                    display: none;
                }

                // 代码区域
                &.code-container {
                    width: 100%;
                }

                /* 禁止事件穿透 */
                &.code-container * {
                    pointer-events: none;
                }
            }
        }
    }

    // 笔记内图片的样式

    .note-image-container {
        position: relative;
        width: 100%;
        max-height: 800px; // 根据图片的实际高度调整
    }

    .note-image {
        max-width: 100%;
        max-height: 800px;
        display: block;
        object-fit: cover;
        margin-left: auto;
        margin-right: auto;
    }

    .note-loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: note-spin 2s linear infinite;
        display: block; // 默认显示
    }

    @keyframes note-spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    // 图片加载完成后隐藏 loading 动画
    .note-image.note-loaded+.note-loading-spinner {
        display: none;
    }

    // 图片加载失败时显示错误图标
    .note-image.note-error {
        background: url('/public/images/error-icon.png') no-repeat center center; // 错误图标
        // width: 100px;
        height: 100px;
        background-size: contain;
        display: block;

        &::before {
            content: '同学，无法找到图片你想要的图片：  ';
            color: #53c2f5;
        }
    }

    // 图片加载失败时同时隐藏loading动画
    .note-image.note-error+.note-loading-spinner {
        display: none;
    }

    /* 自定义容器效果 */
    .tip {
        border: 1px solid #2db7f5;
        background: #e6f7ff;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0 !important;

        p {
            margin-top: 5px;
            color: #000 !important;
        }

        @include filter_invert();
    }

    .tip strong {
        display: block;
        color: #247bd3;
        font-weight: bold;
        border-bottom: 1px dashed #332d2d;

        &::before {
            content: "📝";
            font-size: 1.5rem;
        }

        @include filter_invert();
    }

    .success {
        border: 1px solid #52c41a;
        background: #f6ffed;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0 !important;

        p {
            margin-top: 5px;
            color: #000 !important;
        }

        strong {
            display: block;
            color: #0a9956;
            font-weight: bold;
            border-bottom: 1px dashed #745858;

            &::before {
                content: "🎖️";
                font-size: 1.5rem;
            }
        }

        @include filter_invert();
    }


    .warning {
        border: 1px solid #faad14;
        background: #fff7e6;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0 !important;

        pre {
            margin-top: 5px !important;
        }

        strong {
            display: block;
            color: #c70a23;
            font-weight: bold;
            border-bottom: 1px dashed #745858;

            &::before {
                content: "⚠️";
                font-size: 1.5rem;
            }
        }

        @include filter_invert();
    }

    .info {
        border: 1px solid #1890ff;
        background: #e6f7ff;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0 !important;

        p {
            margin-top: 5px;
            color: #000 !important;
        }

        @include filter_invert();
    }

    .info strong {
        display: block;
        color: #6c9bc7;
        font-weight: bold;
        border-bottom: 1px dashed #745858;

        &::before {
            content: "🪧";
            font-size: 1.5rem;
        }

        @include filter_invert();
    }

    .error {
        border: 1px solid #ff4d4f;
        background: #fff1f0;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0 !important;

        p {
            margin-top: 5px;
            color: #000 !important;
        }

        @include filter_invert();
    }

    .error strong {
        display: block;
        color: #c70a23;
        font-weight: bold;
        border-bottom: 1px dashed #745858;

        &::before {
            content: "⛔";
            font-size: 1.5rem;
        }

        @include filter_invert();
    }
</style>
