
## 项目的初始化

### 1 npm初始化

```
npm init -y
```

生成`package.json`文件

- 记录项目的依赖
  
### 2 git初始化

```
git init 
```

生成'.git'隐藏文件夹 .git的本地仓库

### 创建ReadMe文件

## 二.搭建项目

### 1 安装Koa框架

```
npm i koa
```

### 2 编写最基础的app
 
创建`src/main.js`

```
const Koa = require('koa')

const app = new Koa()

// ctx即context
app.use((ctx,next) => {
    ctx.body = 'hello api'
})

app.listen(3000,()=>{
    console.log('server is running on http://localhost:3000')
})
```

### 3 测试

在终端，使用 `node src/main.js` 启动项目（但项目有更改得重启才行）

## 三、项目的基本优化

### 1 自动重启服务

安装`nodemon` 


```
npm i nodemon
```

编写`package.json`脚本

在`package.json`文件的`scripts`中添加一条规则`"dev" : "nodemon ./src/main.js"`

```
"scripts": {
    "dev" : "nodemon ./src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

说明：dev 指代开发环境  使用nodemon执行当前目录下src中的main.js文件

现在重启项目只需要在终端输入 `npm run dev` 即可,至此可以自动重启服务

### 2 读取配置文件

1.安装`dotenv`,读取根目录的`.env`文件，将配置文件写在`process.env`中

```
npm i dotenv
```

2.根目录下创建`.env`文件,其内容如下

```
APP_PORT=8000
```

3.创建`src/config/config.default.js`

通过dotenv工具读`.env`文件中的内容,并将其写入`process.env`并导出

```
const dotenv = require('dotenv')
dotenv.config()
// console.log(process.env.APP_PORT)
module.exports = process.env
```

4.改写main.js

```
const Koa = require('koa')

const {APP_PORT} = require('./config/config.default')

const app = new Koa()

app.use((ctx,next)=>{
    ctx.body = 'hello api'
})

app.listen(APP_PORT,()=>{
    console.log(`server is running on http://localhost:${APP_PORT}`)
})
```
