/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('cart');

module.exports = {
	get(member, callback) {
		_mongo.findOne({member})
		.populate({
			path     : 'cart_item.product',
			model    : 'product'
		})
		.exec((err, cart) => {
			if(cart) callback(cart)
			else {
				cart = new _mongo({member})
				cart.save(err => {
					callback(cart)
				})
			}
		})
	},
	add(member, item) {
		return new Promise((resolve, reject) => {
			this.get(member, (cart) => {
				let cart_item = cart.cart_item.find(val => {
					return val.product._id == item.product && val.selected == item.selected
				})
				// 已经存在的商品
				if(cart_item > -1) cart_item.number += item.number;
				else cart.cart_item.push(item);

				cart.save(err => {
					if(err) reject(err);
					else resolve(cart);
				})
			})
		})
	},
	selectCart(member, arr) {
		return new Promise((resolve, reject) => {
			this.get(member, (cart) => {
				let total = 0, items = [];
				// 获取购物车付款项
				// 计算价格
				console.log('cart.cart_item', cart.cart_item)
				console.log('arr', arr)
				cart.cart_item.filter(val => {
					const v = arr.find(item => item.toString() == val._id.toString())
					
					if(typeof v == 'undefined') return false;
					else {
						const product = val.product.item.find(p => val.selected.toString() == p._id.toString());
						if(product) {
							total += product.price * val.number;
							const model = {
								no     : product.product_no,
								_id    : product._id,
								name   : product.name,
								img    : product.img,
								price  : product.price,
								desc   : product.desc,
								number : val.number
							}
							items.push(model);
						}
						return true;
					}
				});
				resolve({total : total.toFixed(1), items});
			})
		})
	},
	update(member, item) {
		return new Promise((resolve, reject) => {
			this.get(member, (cart) => {
				let cart_item = cart.cart_item.find(val => val._id == item._id)
				// 已经存在的商品
				if(item.operation == 'add') cart_item.number += 1;
				else if(cart_item.number > 1) cart_item.number -= 1;
				cart.save(err => {
					if(err) reject(err);
					else resolve(cart);
				})
			})
		})
	},
	remove(member, item_id) {
		return new Promise((resolve, reject) => {
			this.get(member, (cart) => {
				let cart_item_index = cart.cart_item.findIndex(val => val._id == item_id)
				cart.cart_item.splice(cart_item_index, 1);
				cart.save(err => {
					if(err) reject(err);
					else resolve(cart);
				})
			})
		})
	}
}

	
