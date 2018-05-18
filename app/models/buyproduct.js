/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 用户购买商品注册
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
buyproduct_Schema  = new Schema({
	user   : { type : Schema.Types.ObjectId, ref : 'user'},
	phone  : { type : String, required: true}, 	// 注册手机号码
	number : { type : String, default : '' },	// 注册产品代码
	person : {									// 联系用户
		name     : { type : String, default : '' },
		address  : { type : String, default : '' },
		postcode : { type : String, default : '' },
		province : { type : String, default : '' },
		city     : { type : String, default : '' },
	},
	setdate    : { type : Date, default : Date.now},
	size       : Number,
	water      : Number,
	life       : Number,
	subdealer  : String,	// 分销商code
	changedate : { type : Date, default : Date.now},
	CreateTime : { type : Date, default : Date.now }
});


buyproduct_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

buyproduct_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.exec(callback);
	}
}

mongoose.model('buyproduct', buyproduct_Schema, 'buyproduct');