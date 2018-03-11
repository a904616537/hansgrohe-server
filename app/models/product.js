/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: product mongoose
 */

'use strict';

const mongoose = require('mongoose'),
Schema         = mongoose.Schema,
Item_Schema    = new Schema({
	name  : { type : String, default : '' },
	img   : { type : String, default : '' },
	price : { type : Number, default : 0, min : 0, set : v => Number(v).toFixed(2) },
	desc  : { type : String, default : '' }
}),
_Schema = new Schema({
	item       : [Item_Schema],							// 商品项
	product_no : { type : String, required : true},
	surface    : { type : String, default : '' },		// 表层材料
	lack       : { type : Boolean, default : false },	// 缺货
	hide       : { type : Boolean, default : false },	// 下架
	content    : { type : String, default : '' },		// 内容
	order      : { type : Number, default : 10 },
	CreateTime : { type : Date, default : Date.now }
});

_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

_Schema.statics = {
	findById(_id, callback) {
		return this.findOne({_id})
		.exec((err, product) => callback(product))
	},
}

mongoose.model('product', _Schema, 'product');