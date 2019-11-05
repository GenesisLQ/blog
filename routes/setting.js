/**
 * 修改个人信息、账号信息
 */

var express = require('express')
var md5 = require('blueimp-md5')
var multer = require('multer')
var upload = multer({dest: './public/upload/'}) // 这个目录是相对于当前项目的
var User = require('../models/user')
var Article = require('../models/article')

var router = express()

// 处理修改个人信息的 POST 请求
router.post('/modify_personal', upload.single('avatar'), function (req, res, next) {
	var body = req.body
	
	if (req.file) { // 如果有文件上传的信息，更新数据库的时候就要加上 avatar 字段
		User.updateOne({
			email: body.email
		}, {
			nickname: body.nickname,
			gender: body.gender,
			birthday: body.birthday,
			biography: body.biography,
			avatar: req.file.path
		}, function (err, result) {
			findByEmail(err, req, res, next, body)
		})
	} else { // 只修改表单提交的信息
		User.updateOne({
			email: body.email
		}, {
			nickname: body.nickname,
			gender: body.gender,
			birthday: body.birthday,
			biography: body.biography
		}, function (err, result) {
			findByEmail(err, req, res, next, body)
		})
	}
})

// 修改密码
router.post('/modify_pwd', function (req, res, next) {
	var body = req.body
	var user = req.session.user
	User.findOne({email: user.email}, function (err, result) {
		if (!err) {
			if (result.password === md5(md5(body.oldPwd))) {
				User.updateOne({email: user.email}, {password: md5(md5(body.newPwd))}, function (err, result) {
					if (!err) {
						return res.status(200).json({
							res_code: 7, // 7 修改成功
							messgae: 'OK'
						})
					} else {
						next(err)
					}
				})
			} else {
				return res.status(200).json({
					res_code: 8, // 8 原始密码不正确
					messgae: 'OldPassword error...'
				})
			}
		} else {
			next(err)
		}
	})
	delete req.session.user
})

// 注销
router.get('/written_off', function (req, res, next) {
	var user = req.session.user
	Article.deleteMany({email: user.email}, function (err) {
		if (err) {
			next(err)
		}
	})
	User.deleteOne({email: user.email}, function (err, result) {
		if (!err) {
			res.redirect('/register')
		} else {
			next(err)
		}
	})
})

/**
 * 通过邮箱查找信息
 * @param err 错误对象
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 * @param body 请求对象的请求体
 * @return 如果成功就返回一个 json 对象
 */
function findByEmail(err, req, res, next, body) {
	if (!err) {
		User.findOne({
			email: body.email
		}, function (err, result) {
			req.session.user = result
			res.status(200).json({
				res_code: 6, // 6 修改信息成功
				messgae: 'OK'
			})
		})
	} else {
		next(err)
	}
}

return module.exports = router

/**
 *
 */