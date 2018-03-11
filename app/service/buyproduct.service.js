/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('buyproduct');

module.exports = {
	getAll(page = 1, size = 1, sort = 'CreateTime|asc', callback) {
		_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = _mongo.find({})
			query.limit(size)
			query.skip(start)
			if(sort && sort != '') {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, buyproduct) => callback(buyproduct, count));
		})
	},
	getByNumber(buy_number, callback) {
		_mongo.findOne({number : buy_number})
		.exec((err, buyproduct) => callback(buyproduct))
	},
	// 获取用户
	getBuyProduct(page = 1, size = 1, sort = 'subscribe_time|asc', callback) {
		let q = {};
		_mongo.count(q)
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = _mongo.find(q)
			query.limit(size)
			query.skip(start)
			if(sort && sort != '') {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, buys) => {
				return callback(buys, count)
			})
		})
	},
	post(model) {
		return new Promise((resolve, reject) => {
			_mongo.findOne({number : model.number})
			.exec((err, buyproduct) => {
				if(buyproduct) {
					reject('Has been registered')
				} else {
					model  = new _mongo(model);
					model.save(err => {
						if(err) return reject({err})
						resolve({buyproduct : model});
					})
				}
			})
		})
	}
}

	
