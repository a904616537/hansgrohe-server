/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
_service    = require('../service/cart.service'),
router      = express.Router();


router.route('/')
.get((req, res, next) => {
	const member_id = req.session.user._id;
	_service.get(member_id, cart => {
		res.send(cart);
	})
})
.post((req, res, next) => {
	const member_id = req.session.user._id;
	console.log('member_id', member_id)
	_service.add(member_id, req.body)
	.then(cart => {
		console.error('cart', cart)
		res.send(cart)
	})
	.catch(err => {
		console.error('error', err)
		res.status(500).send()
	})
})
.put((req, res) => {
	const member_id = req.session.user._id;
	console.log('req.body', req.body)
	_service.update(member_id, req.body)
	.then(cart => res.send(cart))
	.catch(err => res.status(500).send())
})
.delete((req, res) => {
	const member_id = req.session.user._id;
	const {_id} = req.query;
	_service.remove(member_id, _id)
	.then(cart => res.send(cart))
	.catch(err => res.status(500).send())
})

router.route('/checkout')
.post((req, res) => {
	const member = req.session.user;
	let {arr} = req.body;
	console.log('arr', arr)
	if(typeof arr == 'string') arr = [arr];
	_service.selectCart(member._id, arr)
	.then(cart => {
		const address = member.address.length > member.def?member.address[member.def] : {};
		cart.address = address;
		res.send(cart)
	})
	.catch(err => res.status(500).send())
})


module.exports = app => {
	app.use('/cart', router);
}