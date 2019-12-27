/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
moment      = require('moment'),
jwt         = require('jwt-simple'),
_service    = require('../service/store.service'),
help        = require('../helper/page.help.js'),
router      = express.Router();



router.route('/')
.get((req, res) => {
	_service.getList()
	.then(result => {
		res.send({data : result});
	})
	.catch(err => {
		console.log('error', err)
		res.send().status(500);
	});
})
.post((req, res, next) => {
	const model = req.body;
	const fun = model._id?_service.update : _service.install;
	
	fun(model).then(result => {
		res.send({status : true});
	})
	.catch(err => {
		console.log('error', err)
		res.send().status(500);
	});
})
.put((req, res) => {
	const model = req.body;
	_service.update(model)
	.then(result => {
		res.send({status : true});
	})
	.catch(err => {
		console.log('error', err)
		res.send().status(500);
	});
})
.delete((req, res) => {
	const {_id} = req.query;
	_service.remove(_id)
	.then(result => {
		res.send({status : true});
	})
	.catch(err => {
		console.log('error', err)
		res.send().status(500);
	});
})


module.exports = app => {
	app.use('/store', router);
}