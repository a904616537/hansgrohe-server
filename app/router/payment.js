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
	const {order, total, open_id} = req.body;
	const body = {
		body             : 'Hansgrohe',
		attach           : '{"商品":"Hansgrohe"}',
		out_trade_no     : order + '_' + Math.random().toString().substr(2, 5),
		total_fee        : parseInt(total) * 100,
		spbill_create_ip : ip.address(),
		openid           : open_id,
		trade_type       : 'JSAPI'
	};
	console.log('initConfig', initConfig)
	console.log('body', body)
	payment.getBrandWCPayRequestParams(body, (err, payargs) => {
		console.log('payargs', payargs)
		res.json(payargs);
	});
})

module.exports = app => {
	app.use('/payment', router);
}