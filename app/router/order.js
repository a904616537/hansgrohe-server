/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
moment      = require('moment'),
help        = require('../helper/page.help.js'),
_service    = require('../service/order.service'),
router      = express.Router();

router.route('/admin')
.get((req, res) => {
	let { page, per_page, sort, filter, status } = req.query;
	page     = parseInt(page);
	per_page = parseInt(per_page);

	_service.getOrders(page, per_page, sort, filter, status, (orders, count) => {
		let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/order');
		res.send({data: orders, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
	})
})
.put((req, res) => {
	const { _id, status } = req.body;

	_service.UpdateStatus(_id, status)
	.then(order => res.send({status : true, order}))
	.catch(err => res.send({status : false, err}))
})

router.route('/')
.get((req, res) => {
	const member = req.session.user._id;
	const {_id} = req.query;
	_service.getOrder(member, _id, order => res.send(order))
})
.post((req, res, next) => {
	const member = req.session.user;
	_service.post(member, req.body)
	.then(result => res.send(result._id))
	.catch(err => {
		console.error('err', err)
		res.status(500).send()
	})
})

router.route('/me')
.get((req, res) => {
	const member = req.session.user._id;
	_service.getOrderMe(member, orders => res.send(orders))
})

router.route('/count')
.get((req, res) => {
	const member = req.session.user._id;
	_service.getOrderCount(member, count => {
		res.send({count : count})
	})
})



module.exports = app => {
	app.use('/order', router);
}