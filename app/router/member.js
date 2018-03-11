/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
moment      = require('moment'),
jwt         = require('jwt-simple'),
_service    = require('../service/member.service'),
help        = require('../helper/page.help.js'),
router      = express.Router();



router.route('/')
.get((req, res) => {
	let { page, per_page, sort } = req.query;
	page     = parseInt(page);
	per_page = parseInt(per_page);

	_service.getMember(page, per_page, sort, (members, count) => {
		let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/member');
		res.send({data: members, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
	});
})
.post((req, res, next) => {
	const {phone} = req.body;
	_service.post(phone)
	.then(result => {
		const expires = moment().minutes(1).valueOf();
		const token = jwt.encode({
			iss : {user : result._id},
			exp : expires
		}, 'hansgrohe');
		res.send({token, user : result});
	})
	.catch(err => {
		console.error('err', err)
		res.status(500).send()
	})
})

router.route('/address')
.get((req, res) => {
	const member_id = req.session.user._id;
	res.send(req.session.user.address);
})
.put((req, res) => {
	const member = req.session.user;
	_service.updateAddress(member, req.body.index)
	.then(result => res.send(result))
	.catch(err => {
		console.error('error', err);
		res.status(500).send()
	})
})
.post((req, res) => {
	const member = req.session.user;
	_service.addAddress(member, req.body)
	.then(result => res.send(result))
	.catch(err => {
		console.error('error', err);
		res.status(500).send()
	})
})
.delete((req, res) => {
	const member = req.session.user;
	_service.delAddress(member, req.body.index)
	.then(result => res.send(result))
	.catch(err => {
		console.error('error', err);
		res.status(500).send()
	})	
})



module.exports = app => {
	app.use('/member', router);
}