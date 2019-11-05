/**
 *  用户集合
 */

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/blog')

var Schema = mongoose.Schema

var userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	nickname: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
	created_time: {
		type: Date,
		// 注意：这里默认值不能写 Date.now()，因为只要一调用 new Schema() 就会立即生成一个日期
		//      就变成固定值了，不加括号是为了当我们没有传递 create_time 的值的时候，mongoose
		//      就会自动调用 default 方法，相当于调用了 Date.now()，等到那时候才生成日期
		default: Date.now
	},
	last_modified_time: {
		type: Date,
		default: Date.now
	},
	avatar: { // 头像
		type: String,
		default: '/public/img/avatar-default.png' // 默认头像
  },
  biography: { // 简介
    type: String,
    default: ''
  },
  birthday: {
    type: Date,
	  default: null
  },
  status: { // 用户权限
    type: Number,
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    enum: [0, 1, 2],
    default: 0
  }
})

var User = mongoose.model('User', userSchema)

return module.exports = User