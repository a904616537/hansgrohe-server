/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
_service    = require('../service/product.service'),
help        = require('../helper/page.help.js'),
router      = express.Router();


router.route('/')
.get((req, res) => {
	let { page, per_page, sort } = req.query;
	page     = parseInt(page);
	per_page = parseInt(per_page);

	_service.getProduct(page, per_page, sort, (admins, count) => {
		let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/product');
		res.send({data: admins, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
	});
})
.post((req, res) => {
	req.body.item = JSON.parse(req.body.item)
	_service.post(req.body)
	.then(result => res.send(result))
	.catch(err => res.status(500).send())
})
.put((req, res) => {

	req.body.item = JSON.parse(req.body.item)
	console.log('req.body', req.body)
	_service.update(req.body)
	.then(result => res.send(result))
	.catch(err => res.status(500).send())
})
.delete((req, res) => {
	const {_id} = req.body;
	_service.delete(_id)
	.then(result => res.send({}))
	.catch(err => res.status(500).send({}))
})

router.route('/:id')
.get((req, res) => {
	const {id} = req.params;
	_service.getById(id, result => {
		res.send(result)
	})
})


module.exports = app => {
	app.use('/product', router);
}