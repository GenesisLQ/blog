/**
 *  文章集合
 */

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/blog')

var Schema = mongoose.Schema

var articleSchema = new Schema({
	email: { // 用户发文的邮箱
		type: String,
		required: true
	},
	title: { // 文章标题
		type: String,
		required: true
	},
	content: { // 文章内容
		type: String,
		required: true
	},
	description: { // 文章简介
		type: String,
		required: true
	},
	author: { // 文章作者
		type: String,
		default: '佚名'
	},
	time: { // 发文时间
		type: Date,
		default: Date.now
	},
	like: { // 点赞数
		type: Number,
		default: 0
	},
	dislike: { // 吐槽数
		type: Number,
		default: 0
	}
})

var Article = mongoose.model('Article', articleSchema)

return module.exports = Article