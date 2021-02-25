// 这是项目生产环境需要用到的babel插件
const prodPlugins = []
// 如果是生产环境
if (process.env.NOD_NEV === "production") {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],

  plugins: [
    // 移除所有的console代码
    // "transform-remove-console",

    // 这么改了如果是开发阶段，就不会移除
    ...prodPlugins,

    // 懒加载：3步：安装依赖包，插件中导入，路由中箭头函数（注释是归类的，有用不要删）
    "@babel/plugin-syntax-dynamic-import"
  ]
}