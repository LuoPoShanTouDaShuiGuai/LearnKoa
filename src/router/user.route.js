/*引入路由的四步
    导入包  
    实例化对象  
    编写路由（然后导出）   
    注册中间件（在main.js中注册：app.use(router.routes())
*/
const Router = require('koa-router')

const {register,login} = require('../controller/user.controller')

// 前缀prefix
const router = new Router({prefix:'/users'})

// 注册接口
router.post('/register', register)
// 登录接口
router.post('/login', login)


// GET /users/ 即会把get中的路径于前缀拼接
// router .get('/', (ctx,next)=>{
//     ctx.body = 'hello users'
// })

// 导出
module.exports = router