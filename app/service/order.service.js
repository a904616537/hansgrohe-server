/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('order'),
cart_service = require('./cart.service');

const getId = () => {
	var str = "" + moment().unix(),
    pad = "000000000",
    _id = moment().format("YYYY") + moment().format("MM") + pad.substring(0, pad.length - str.length) + str;
    return _id;
}


module.exports = {
	// 获取订单
	getOrders(page = 1, size = 1, sort = 'CreateTime|desc', filter='', status, callback) {
		const reg = new RegExp(filter, 'i'),
		find      = status?{status}:{},
		seach     = [
					{ '_id': { $regex: reg }},
					{ 'address.recipients': { $regex: reg }},
					{ 'address.phone': { $regex: reg }}
				]
		_mongo.count(find)
		.or(seach)
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = _mongo.find(find)
			query.limit(size)
			query.skip(start)
			query.populate({
				path  : 'member',
				model : 'member'
			})
			query.or(seach)
			query.sort({CreateTime : -1})
			if(sort) {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, orders) => {
				return callback(orders, count)
			})
		})
	},
	getOrderMe(member, callback) {
		_mongo.find({member}, (err, order) => callback(order)).sort({CreateTime : -1});
	},
	getOrderCount(member, callback) {
		_mongo.count({member}, (err, count) => callback(count));
	},
	getOrder(member, _id, callback) {
		_mongo.findOne({_id, member}, (err, order) => callback(order));
	},
	post(member, data) {
		return new Promise((resolve, reject) => {
			// 创建订单
			const order = new _mongo({
				_id        : getId(),
				order_item : data.items,
				member     : member._id,
				total      : data.total,
				address    : data.address,
				message    : data.message
			});
			order.save(err => {
				if(err) reject();
				else {
					resolve(order);
					// 清除购物车项
					data.cart_item.forEach(val => {
						cart_service.remove(member, val)
						.then(result => console.log('clear cart item :', val))
					})
				}
			})
		})
	},
	UpdateStatus(_id, status) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, (err, order) => {
				order.status = status;
				order.save(err => {
					if(err) return reject(err);
					resolve(order);
				})
			});
		});
	}
}

	
