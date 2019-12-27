/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
excel_help   = require('../helper/excel.help.js'),
_mongo       = mongoose.model('buyproduct');

module.exports = {
	getAll(page = 1, size = 1, sort = 'CreateTime|asc', callback) {
		_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = _mongo.find({})
			query.populate({
				path     : 'city',
				model    : 'store'
			})
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
	getPhone(phone) {
		return new Promise((resolve, reject) => {
			_mongo.findOne({phone})
			.exec((err, buyproduct) => resolve(buyproduct))
		});
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
			_mongo.findOne({number : model.number, phone : model.phone})
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
	},
	del(_id) {
		return new Promise((resolve, reject) => {
			_mongo.findOne({_id})
			.exec((err, buyproduct) => {
				console.log('buyproduct', buyproduct)
				
				if(!buyproduct) reject('注册信息不存在');
				else {
					buyproduct.remove(err => {
						console.log('error', err);
						if(err) return reject()
						else resolve();
					});
				}
			})
		})
	},
	toExcel(callback) {
		_mongo.find({})
		.sort({CreateTime : -1})
		.exec((err, buyproducts) => {
			var cols = [
			{caption: 'Date', type:'string', width:500},
			{caption: 'WeChat order no.', type:'string', width:500},
			{caption: 'Name (sold to party)', type:'string', width:500},
			{caption: 'Street + house number (sold to party)', type:'string', width:500},
			{caption: 'City (sold to party)', type:'string', width:500},
			{caption: 'Name (ship to party)', type:'string', width:200},
			{caption: 'Phone (ship to party)', type:'string', width:200},
			{caption: 'Product', type:'string', width:200},
			{caption: 'Quantity', type:'string', width:100},
			{caption: 'Serial no. (QR code)', type:'string', width:100}
			];
			const excels = buyproducts.map((buyproduct) => {
				let item = [
					moment(buyproduct.CreateTime).format('YYYY-MM-DD hh:mm:ss'),
					buyproduct._id,
					buyproduct.phone,
					buyproduct.person.address,
					buyproduct.person.city,
					buyproduct.person.name,
					buyproduct.phone,
					'',
					'',
					buyproduct.number
				];
				return item;
			});
			console.log(excels)
			excel_help.toExcel('Replacement_order', cols, excels, (err, url) => {
				callback(url)
			});
		})
	}
}

	
