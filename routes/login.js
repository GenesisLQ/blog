/**
 * 登录、注册、退出
 */

var express = require('express');
var md5 = require('blueimp-md5')
var User = require('../models/user')
var Article = require('../models/article')

var router = express()

router.get('/', function (req, res, next) {
	Article.find(function (err, result) {
		if (!err) {
			var day = []
			for (let i = 0; i < result.length; i++) {
				var time = result[i].time
				var year = time.getFullYear()
				var timeMonth = time.getMonth() + 1
				var month = timeMonth < 10 ? '0' + timeMonth : timeMonth
				var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
				day[i] = year + '-' + month + '-' + date
			}
			res.render('index.html', {
				user: req.session.user,
				articles: result,
				day: day
			})
		} else {
		  next(err)
		}
	})
		.sort('-time')
})

router.get('/login', function (req, res) {
	res.render('login.html')
})

router.get('/register', function (req, res) {
	res.render('register.html')
})

router.get('/logout', function (req, res) {
	//  清楚 session 数据
	delete req.session.user
	// 重定向到首页
	// a 链接默认是同步请求
	res.redirect('/')
})

router.get('/setting', function (req, res, next) {
	var user = req.session.user
	if (user) {
		User.findOne({email: user.email}, function (err, result) {
			if (!err) {
				var day = ''
				var bir = result.birthday
				if (bir !== null) {
					var year = bir.getFullYear()
					var birMonth = bir.getMonth() + 1
					var month = birMonth < 10 ? '0' + birMonth : birMonth
					var date = bir.getDate() < 10 ? '0' + bir.getDate() : bir.getDate()
					day = year + '-' + month + '-' + date
				}
				res.render('setting.html', {
					user: user,
					data: result,
					birthday: day
				})
			} else {
				next(err)
			}
		})
	} else {
	  res.redirect('/')
	}
})

/**
 * res_code 返回给客户端的响应码
 *          3   登录成功
 *          4   密码错误
 *          5   邮箱错误
 */
router.post('/login', function (req, res, next) {
	var body = req.body
	var promise = User.findOne({email: body.email}).exec()
	promise
		.then(function (data) {
			if (data) { // 查询 email 成功
				if (data.password === md5(md5(body.password))) { // 密码匹配
					// 将数据保存到 session 里
					req.session.user = data
					return res.status(200).json({
						res_code: 3,
						message: 'OK'
					})
				}
				// 密码匹配不成功
				return res.status(200).json({
					res_code: 4,
					message: 'Password error...'
				})
			}
			// data 为 null，证明查询 email 不成功
			return res.status(200).json({
				res_code: 5,
				message: 'Email error...'
			})
		}, function (err) { // 错误处理
			next(err)
		})
	// User.findOne({
	// 	email: body.email
	// }, function (err, result) {
	// 	if (!err) {
	// 		if (result) {
	// 			User.findOne({
	// 				email: body.email,
	// 				password: md5(md5(body.password))
	// 			}, function (err, result) {
	// 				if (!err) {
	// 					if (result) {
	// 						// 登录成功之后使用 session 记录用户
	// 						req.session.user = result
	// 						return res.status(200).json({
	// 							res_code: 3,
	// 							message: 'OK'
	// 						})
	// 					} else {
	// 						return res.status(200).json({
	// 							res_code: 4,
	// 							message: 'Password error...'
	// 						})
	// 					}
	// 				} else {
	// 					return res.status(500).json({
	// 						res_code: 500,
	// 						message: 'Server error...'
	// 					})
	// 				}
	// 			})
	// 		} else {
	// 			return res.status(200).json({
	// 				res_code: 5,
	// 				message: 'Email error...'
	// 			})
	// 		}
	// 	} else {
	// 		return res.status(500).json({
	// 			res_code: 500,
	// 			message: 'Server error...'
	// 		})
	// 	}
	// })
})

/**
 * res_code 返回给客户端的响应码
 *          0    注册成功
 *          1    邮箱已存在
 *          2    昵称已存在
 *         500   服务器正忙
 */
router.post('/register', function (req, res, next) {
	// 1. 获取表单数据
	// 2. 操作数据库
	// 3. 发送响应
	var body = req.body
	// 双重加密
	body.password = md5(md5(body.password))
	
	// 判断用户是否已存在
	User.findOne({
		$or: [  // 只要满足其中一个条件即可
			{email: body.email},
			{nickname: body.nickname}
		]
	}, function (err, result) {
		if (!err) { // 查询成功
			if (result === null) { // 如果没有匹配的数据就新增
				var user = new User({
					email: body.email,
					nickname: body.nickname,
					password: body.password
				})
				user.save(function (err) {
					if (!err) {
						// return res.status(200).send('注册成功')
						// 给客户端发送 json 数据
						// 客户端解析数据并展示到页面上
						// json 方法会自动把对象转成字符串发给客户端
						return res.status(200).json({
							res_code: 0,
							message: 'OK...'
						})
					} else { // 插入数据失败
						next(err)
					}
				})
			} else { // 判断邮箱或昵称已存在
				if (body.email === result.email) { // 判断邮箱
					return res.status(200).json({
						res_code: 1,
						message: 'Email already exist...'
					})
				} else if (body.nickname === result.nickname) { //判断昵称
					return res.status(200).json({
						res_code: 2,
						message: 'Nickname already exist...'
					})
				}
			}
		} else { // 查询失败
			next(err)
		}
	})
})

return module.exports = router