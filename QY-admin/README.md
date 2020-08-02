

#### 前端安装

1. 下载源码

    git clone https://gitee.com/liuge1988/kitty-ui.git

2. 编译代码

    进入项目根目录，执行 npm install, 下载和安装项目相关依赖包。

3. 启动系统

    执行 npm run dev 命令，启动项目，通过 http://localhost:8090 访问。

4. 项目打包

    执行 npm run build 命令，启动打包，完成之后会生成 dist 目录。

5. Mock 开关

    通过修改src/mock/index.js中的openMock变量，可以一键开启或关闭Mock功能。

6. 修改配置

    如果想自定义端口（默认是8090），可以修改 config/index.js 下的 port 属性。

    后台接口和备份服务器地址配置在 src/utils/global.js，如有修改请做相应变更。

