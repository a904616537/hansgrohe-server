/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description:  支付处理
 */

'use strict';

var express = require('express'),
router      = express.Router(),
moment      = require('moment'),
ip          = require('ip'),
wechat      = require('../../setting/config.js').wechat,
Payment     = require('wechat-pay').Payment;


const payinfo = wechat.pay;

const initConfig = {
	partnerKey : payinfo.partnerKey,
	appId      : payinfo.appId,
	mchId      : payinfo.mchId,
	notifyUrl  : payinfo.notifyUrl,		//微信商户平台API密钥 
	pfx        : payinfo.pfx,			//微信商户平台证书 
};

const payment = new Payment(initConfig);

router.route('/wechat')
.post((req, res) => {
	const user = req.session.user;
	const {order, total, open_id} = req.body;
	console.log(moment(), 'user wechat payment', user)
	console.log("openid", open_id)
	const body = {
		openid           : open_id,
		body             : 'Hansgrohe',
		out_trade_no     : order + '_' + Math.random().toString().substr(2, 10),
		total_fee        : parseInt(total) * 100,
		// total_fee        : 10,
		spbill_create_ip : ip.address(),
		trade_type       : 'JSAPI'
	};

	payment.getBrandWCPayRequestParams(body, (err, payargs) => {
		console.error('error', err)
		console.log('payargs', payargs)
		res.json(payargs);
	});
})

module.exports = app => {
	app.use('/payment', router);
}