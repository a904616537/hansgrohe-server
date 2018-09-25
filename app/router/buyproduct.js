/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
_service    = require('../service/buyproduct.service'),
help        = require('../helper/page.help.js'),
router      = express.Router();

router.route('/')
.get((req, res, next) => {
	let { page, per_page, sort } = req.query;
	page     = parseInt(page);
	per_page = parseInt(per_page);

	_service.getAll(page, per_page, sort, (buyproduct, count) => {
		let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/buyproduct');
		res.send({data: buyproduct, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
	});
})
.post((req, res, next) => {
	const {body} = req;
	console.log('body', body)

	_service.post(body)
	.then((doc) => res.send(doc))
	.catch(err => res.status(500).send(err))
})
.delete((req, res) => {
	const {_id} = req.query;
	console.log('删除记录', _id)

	_service.del(_id)
	.then((doc) => res.send('删除成功！'))
	.catch(err => res.status(500).send(err))
})

router.route('/excel')
.get((req, res, next) => {
	_service.toExcel((result) => {
		res.send({result});
	});
})

module.exports = app => {
	app.use('/buyproduct', router);
}