//  这是项目发布阶段需要用到的babel插件 
const prodPlugins = []
if(process.env.NODE_ENV ==='production'){
    // 如果是发布阶段就把发布阶段需要的插件放进数组 
    prodPlugins.push('transform-remove-console')

}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@babel/preset-env", { "modules": false }]
  ],
  plugins: [
    [
      "component",
      {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-chalk"
      }
    ],
    // 发布产品时候的插件数组 展开运算符
    ...prodPlugins ,
    // 路由懒加载插件
    "@babel/plugin-syntax-dynamic-import" 
  ]
}
