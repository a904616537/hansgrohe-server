/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
Item_Schema  = new Schema({
	product    : { type : Schema.Types.ObjectId, ref : 'product'},
	selected   : { type : Schema.Types.ObjectId},
	number     : { type : Number, default : 0, min : 0},
	CreateTime : { type : Date, default : Date.now }
}),
_Schema  = new Schema({
	member     : { type : Schema.Types.ObjectId, ref : 'member'},
	cart_item  : [Item_Schema]
});


_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.exec(callback);
	}
}

mongoose.model('cart', _Schema, 'cart');