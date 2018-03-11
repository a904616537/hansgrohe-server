/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('product');

module.exports = {
	getProduct(page = 1, size = 1, sort = 'CreateTime|asc', callback) {
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
			query.exec((err, products) => callback(products, count));
		})
	},
	get(callback) {
		_mongo.find({})
		.exec((err, product) => callback(product))
	},
	getById(_id, callback) {
		_mongo.findOne({_id})
		.exec((err, product) => callback(product))
	},
	// 获取用户
	getAll(page = 1, size = 1, sort = 'CreateTime|asc', callback) {
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
			query.exec((err, products) => {
				return callback(products, count)
			})
		})
	},
	post(product) {
		return new Promise((resolve, reject) => {
			_mongo.create(product, (err, result) => {
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	update(product) {
		return new Promise((resolve, reject) => {
			const _id = product._id;
			delete product._id;
			_mongo.update({_id}, product, err => {
				if(err) return reject(err);
				resolve(product);
			})
		})
	},
	delete(_id) {
		return new Promise((resolve, reject) => {
			_mongo.findOne({_id})
			.exec((err, product) => {
				if(product) {
					product.remove((err) => {
						if(err) reject();
						else resolve();
					})
				} else resolve();
			})
		})	
	}
}

	
