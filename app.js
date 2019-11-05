var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var loginRouter = require('./routes/login')
var settingRouter = require('./routes/setting')
var homeRouter = require('./routes/personal_home')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
// 配置模板引擎
app.engine('html', require('express-art-template'))
// 配置 body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// 配置 sexpress-ession
app.use(session({
	secret: 'keyboard cat', // 配置加密字符串，能够在原有的加密基础上再加上这个字符串拼接起来去加密
	resave: false,
	saveUninitialized: true // 无论是否使用 session，默认分配一个 cookie
}))

// 挂载路由
app.use(loginRouter)
app.use(settingRouter)
app.use(homeRouter)

// 配置处理 404 的中间件
app.use(function (req, res) {
  res.render('404.html')
})

// 配置一个全局错误处理的中间件
app.use(function (err, req, res, next) {
  res.status(500).json({
    res_code: 500,
    message: 'Server error...'
  })
})

app.listen(5000, function () {
	console.log('blog app is running...')
})
