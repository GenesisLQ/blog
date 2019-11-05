/**
 * 个人中心，发表文章，查看文章
 */

var express = require('express')
var Article = require('../models/article')

var router = express()

router.get('/personal_home', function (req, res, next) {
	var user = req.session.user
	if (user) {
		Article.find({
			email: user.email
		}, function (err, result) {
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
				res.render('personal_home.html', {
					user: user,
					article: result,
					day: day
				})
			} else {
				next(err)
			}
		})
			.sort('-time')
	} else {
		res.redirect('/')
	}
})

router.get('/write', function (req, res) {
	if (req.session.user) {
		res.render('write.html', {
			user: req.session.user
		})
	} else {
	  res.redirect('/')
	}
})

router.get('/article_details', function (req, res, next) {
	Article.findById(req.query.id, function (err, result) {
		if (!err) {
			res.render('article-details.html', {
				user: req.session.user,
				article: result
			})
		} else {
			next(err)
		}
	})
})

router.post('/publish_article', function (req, res, next) {
	var body = req.body
	var user = req.session.user
	var article = new Article({
		email: user.email,
		title: body.title,
		content: body.content,
		author: user.nickname,
		description: body.description
	})
	article.save(function (err, result) {
		if (!err) {
			return res.status(200).json({
				res_code: 9, // 发表成功
				message: 'OK'
			})
		} else {
		  next(err)
		}
	})
})

return module.exports = router