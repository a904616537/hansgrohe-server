/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: order mongoose
 */

'use strict';

var mongoose   = require('mongoose'),
Schema         = mongoose.Schema,
// 订单中的商品
Item_Schema = new Schema({
	no     : { type : String, default : '' },
	name   : { type : String, default : '' },
	img    : { type : String, default : '' },
	desc   : { type : String, default : '' },
	number : { type : Number, default: 1},     // 数量
	price  : { type : Number, set: v => Number(v).toFixed(2)},   // 购买时的单价
}),
_Schema = new Schema({
	_id          : { type: String, required: true},
	member       : { type: Schema.Types.ObjectId, ref: 'member'},
	total        : { type: Number, default: 0, min: 0, set: v => Number(v).toFixed(2) },//总价
	freight      : { type: Number, default: 0, min: 0, set: v => Number(v).toFixed(2) },//运费
	status       : { type: Number, default: 0 }, // 订单状态，0: 已下单但未付款,1: 已付款, 2: 已出货，3，已完成, 4：取消
	out_trade_no : String, // 支付单号
	paymentType  : String, // 支付宝／微信
	CreateTime   : { type: Date, default : Date.now },
	order_item   : [Item_Schema],
	message      : String,
	address      : {
		recipients : String,	// 收件人
		phone      : String,	// 电话
		address    : String,	// 地址
	}
});

_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.exec(callback)
	}
}

mongoose.model('order', _Schema, 'order');