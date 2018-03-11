/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('member');

module.exports = {
	get(phone, callback) {
		_mongo.findOne({phone})
		.exec((err, member) => callback(member))
	},
	// 获取管理员
	getMember(page = 1, size = 1, sort = 'CreateTime|asc', callback) {

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
			query.exec((err, members) => callback(members, count));
		})
	},
	getById(_id, callback) {
		_mongo.findOne({_id})
		.exec((err, member) => callback(member))
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
			query.exec((err, members) => {
				return callback(members, count)
			})
		})
	},
	post(phone) {
		return new Promise((resolve, reject) => {
			_mongo.findOne({phone})
			.exec((err, member) => {
				if(member) {
					resolve(member);
				} else {
					member  = new _mongo({phone});
					member.save(err => {
						if(err) return reject({err})
						resolve(member);
					})
				}
			})
		})
	},
	addAddress(member, address) {
		return new Promise((resolve, reject) => {
			if(address.index > -1) {
				member.address.splice(address.index, 1, address);
			} else {
				member.address.push(address);
			}
			member.save(err => {
				if(err) return reject({err})
				resolve(member);
			})
		})
	},
	updateAddress(member, index) {
		return new Promise((resolve, reject) => {
			member.def = index;
			member.save(err => {
				if(err) return reject({err})
				resolve(member);
			})
		})	
	},
	delAddress(member, index) {
		return new Promise((resolve, reject) => {
			member.address.splice(index, 1);
			member.save(err => {
				if(err) return reject({err})
				resolve(member);
			})
		})
	}
}

	
