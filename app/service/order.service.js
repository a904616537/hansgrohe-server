/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
async        = require("async"),
_mongo       = mongoose.model('order'),
_server      = require('./buyproduct.service'),
excel_help   = require('../helper/excel.help.js'),
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
				_id        : data._id ? data._id : getId(),
				order_item : data.items,
				member     : member._id,
				total      : data.total,
				address    : data.address,
				message    : data.message
			});
			console.log('order model', order);
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
	},
	toExcel(callback) {
		_mongo.find({})
		.populate('member')
		.sort({CreateTime : -1})
		.exec((err, orders) => {
			var cols = [
			{caption: 'Date', type:'string'},
			{caption: 'WeChat order no.', type:'string'},
			{caption: 'Name (sold to party)', type:'string'},
			{caption: 'Street + house number (sold to party)', type:'string'},
			{caption: 'City(sold to party)', type:'string'},
			{caption: 'Name (ship to party)', type:'string'},
			{caption: 'Phone (ship to party)', type:'string'},
			{caption: 'Product', type:'string'},
			{caption: 'ProductID', type:'string'},
			{caption: 'Quantity', type:'string'},
			{caption: 'Serial no. (QR code)', type:'string'},
			{caption: 'Note', type:'string'},
			];
			
			let excels = [];
			async.each(orders, function(order, cb) {
				_server.getPhone(order.member.phone).then(buyproduct => {
					const result = order.order_item.map((item, index) => {
						
						let row = [
							moment(order.CreateTime).format('YYYY-MM-DD hh:mm:ss'),
							order._id,
							buyproduct.person.name,
							order.address.address,
							buyproduct.person.city,
							order.address.recipients,
							order.address.phone,
							item.name,
							item.no,
							`${item.number}`,
							buyproduct.number,
							order.message,
						];
						excels.push(row)
						return row;
					})
					cb();
				});
			}, function (err){
				// console.log('excels--------', excels)
				excel_help.toExcel('Replacement_order', cols, excels, (err, url) => {
					callback(url)
				});
			})
		})
	}
}

	
