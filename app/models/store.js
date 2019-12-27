/**
* FileType js
* @Author: Kain·Shi <a904616537@outlook.com>
* @DateTime:    2019-07-22 11:00:26
* @Description
* @Flow 
*/

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
item_Schema = new Schema({
	name           : {type : String, required : true},
	shopId         : {type : String},
	distributorsId : {type : String},
	distributors   : {type : String},
	CreateTime     : { type : Date, default : Date.now }
}),
_Schema  = new Schema({
	name       : {type : String, required : true},
	cityId     : {type : String},
	items      : [item_Schema],
	CreateTime : { type : Date, default : Date.now }
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

mongoose.model('store', _Schema, 'store');