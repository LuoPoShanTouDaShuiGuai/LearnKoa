
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
npm i nodemon -D
```

-D参数表示安装在‘Dev’开发环境下

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

## 四、添加路由

### 1 安装 `koa-router`

```
npm i koa-router
```

开源文档 ：`https://github.com/ZijianHe/koa-router`

步骤:
导入包  var Router = require('koa-router');
实例化对象  var router = new Router();
编写路由   router.get
注册中间件  app.use(router.routes())

```
var Koa = require('koa');
var Router = require('koa-router');

var app = new Koa();
var router = new Router();

router.get('/', (ctx, next) => {
  // ctx.router available
});

app
  .use(router.routes())
  .use(router.allowedMethods());
```

### 2创建`src/router`目录, 编写`user.route.js`

```
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
  ctx.body = 'hello users'
})

module.exports = router
```

### 3 改写 main.js

```
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const userRouter = require('./router/user.route')

const app = new Koa()

app.use(userRouter.routes())

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 五、目录结构优化

### 1 将 http 服务和 app 业务拆分

创建`src/app/index.js`

```
const Koa = require('koa')

const userRouter = require('../router/user.route')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
```

改写`main.js`

```
const { APP_PORT } = require('./config/config.default')

const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

### 2 将路由和控制器拆分

路由: 解析 URL, 分布给控制器对应的方法

控制器: 处理不同的业务

改写`user.route.js`

```
const Router = require('koa-router')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 注册接口
router.post('/register', register)

// 登录接口
router.post('/login', login)

module.exports = router
```

创建`controller/user.controller.js`

```
class UserController {
  async register(ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

## 六、解析body

npm文档链接`https://www.npmjs.com/package/koa-body`

### 1.安装koa-body

```
npm i koa-body
```

### 2.注册中间件

在其他中间件之前写入

改写`app/index.js`

```
const Koa = require('koa')
const KoaBody = require('koa-body')

const userRouter = require('../router/user.route')

const app = new Koa()
// KoaBody 注册在其他中间件之前
app.use(KoaBody())
app.use(userRouter.routes())

module.exports = app 
```

### 3 解析请求数据

改写`user.controller.js`文件

```
const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    // 使用KOA-body后请求发送的数据在request.body中
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = ctx.request.body
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

### 4 拆分 service 层

service 层主要是做数据库处理

创建`src/service/user.service.js`

```
class UserService {
  async createUser(user_name, password) {
    // todo: 写入数据库
    return '写入数据库成功'
  }
}

module.exports = new UserService()
```