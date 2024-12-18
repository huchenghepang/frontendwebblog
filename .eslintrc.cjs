module.exports = {
  // 主要解析器设为 vue-eslint-parser，因为它支持解析 Vue 文件中的 TypeScript 代码
  parser: 'vue-eslint-parser',
  env: {
    "browser": true,         // 支持浏览器环境（如 `window` 对象）
    node: true,
    es2021: true,
  },
  parserOptions: {
    // 配置项目的 TypeScript 配置文件
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    extraFileExtensions: ['.vue'], // 明确告诉 ESLint 支持 .vue 文件
  },
  plugins: [
    'vue',                // 使用 Vue 插件
    '@typescript-eslint', // 使用 TypeScript 插件  
  ],
  extends: [
    // 'eslint:recommended',           // 使用推荐的 ESLint 规则
    'plugin:vue/vue3-recommended',  // Vue3 推荐规则
    'plugin:@typescript-eslint/recommended' // TypeScript 推荐规则
  ],
  rules: {
    // 自定义规则
    'indent': ['warn', 4], // 设置缩进为 4 个空格
    'vue/html-indent': ['warn', 4], // Vue 模板文件的缩进
    'vue/script-indent': ['off', 4, { 'baseIndent': 0 }], // Vue 脚本部分缩进
    "no-unused-vars": ["warn", { "vars": "all", "args": "none" }], // 禁止未使用的变量
    "vue/no-unused-vars": "off",  // 禁用 vue 的 unused-vars 规则
    'vue/no-unused-directives': 'off', // 禁止未使用的指令
    'vue/no-unused-components': 'off', // 禁止未使用的组件
    "semi": ["off", "always"],  // 强制每个语句后都有分号
    "vue/attribute-hyphenation": ["error", "never"],
    "vue/no-v-html": "off",
    "vue/max-attributes-per-line": ["error", { "singleline": 4, "multiline": 1 }],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/multiline-html-element-content-newline": ["off"],
    // 禁用 v-on 事件名称必须使用连字符的规则
    'vue/attribute-hyphenation': 'off',
    // 可能还需要禁用其他可能导致事件名检查的规则
    'vue/v-on-event-hyphenation': 'off',
  },
  overrides: [
    {
      files: ['/**/*.js'], //  .js 文件
      rules: {
        // 禁用该文件夹内的所有 ESLint 检查
        'no-unused-vars': 'off',
        'indent': 'off',
        // 其他规则可以继续关闭
      },
    },
    {
      files: ['*.vue'], // 针对 .vue 文件
      parserOptions: {
        parser: '@typescript-eslint/parser', // 在 vue 文件中解析 TypeScript 代码
      },
    },
    {
      files: ['*.ts', '*.tsx'], // 针对 .ts/.tsx 文件
      parser: '@typescript-eslint/parser', // 使用 @typescript-eslint/parser 解析 TypeScript
      rules: {
        // 针对 TypeScript 规则进行配置
        '@typescript-eslint/no-unused-vars': 'warn', // 开启 TypeScript 的 unused-vars 规则
        "@typescript-eslint/no-explicit-any": "off"

      },
    },
    {
      // 匹配 src/utils/uploadfile 目录下的所有 TypeScript 文件
      files: ['src/utils/uploadfile/**/*.ts', 'src/utils/uploadfile/**/*.tsx'],
      rules: {
        // 关闭 TypeScript 相关的检查
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // 可以添加更多你想关闭的规则
      },
    },
  ]
};