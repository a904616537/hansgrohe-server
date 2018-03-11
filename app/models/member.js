/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
address_Schema = new Schema({
	title      : String,	// 别称
	recipients : String,	// 收件人
	phone      : String,	// 电话
	address    : String		// 地址
}),
user_Schema  = new Schema({
	phone      : { type : String,  required : true },
	address    : [address_Schema],	// 地址簿
	def        : { type : Number, default : 0 },	// 默认选中地址
	CreateTime : { type : Date, default : Date.now }
});


user_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

user_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.exec(callback);
	}
}

mongoose.model('member', user_Schema, 'member');