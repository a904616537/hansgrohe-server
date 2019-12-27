/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('store');

module.exports = {
	get(_id) {
		return _mongo.findOne({_id}).exec();
	},
	getList() {
		return _mongo.find().exec();
	},
	install(model) {
		const mongo = new _mongo(model);
		return mongo.save();
	},
	update(model) {
		return _mongo.update({_id : model._id}, model).exec();
	},
	remove(_id) {
		return _mongo.remove({_id}).exec();
	}
}

	
