const path = require('path'),
fs         = require('fs'),
rootPath   = path.normalize(__dirname + '/..'),
env        = process.env.NODE_ENV || 'development',
port       = 8081

console.log('当前环境', env)

const config = {
	//开发者环境配置
	development: {
		root         : rootPath,
		port         : port,
		maxOrderTime : 1080,
		app          : {
			name : 'hansgrohe-test',
			local: 'http://localhost:' + port
		},
		mongo : 'mongodb://127.0.0.1/hansgrohe',
		main  : {
			languagePath : rootPath + '/language/'
		},
		cookie : {
			secret      : 'hansgrohe',
			sessionName : 'session'
		},
		yunpian : {
			apiKey  : '336622ee05a97de6b23b5c6a5a76e3f7'
		},
		wechat : {
			// Kain 的测试公众号
			appid          : 'wx06c82c3cbb012752',
			appsecret      : '0f7f047780e15e68308ed981c4f0bfed',
			token          : 'hansgrohe',
			encodingAESKey : 'qtsV9j2v5U5gUNLLOB9S5CEpTCrsXnoWVLvSx6umZwK',
			url            : 'http://filtration.hansgrohe.com.cn',
			oauth          : '/wechat/oauth/login',
			local          : '47.100.162.54',
			pay : {
				partnerKey : "C373DDCA1B97E59F7424553D36795A62",
				appId      : "wx06c82c3cbb012752",
				mchId      : "1493918942",
				notifyUrl  : "http://filtration.hansgrohe.com.cn/payment",
				pfx        : fs.readFileSync(rootPath + '/setting/apiclient_cert.p12')
			}
		}
	},
	// 线上产品配置
	production : {
		root         : rootPath,
		port         : port,
		maxOrderTime : 1080,
		app          : {
			name : 'robin-test',
			local: 'http://localhost:' + port
		},
		mongo : 'mongodb://127.0.0.1/robin',
		main  : {
			languagePath : rootPath + '/language/'
		},
		cookie : {
			secret      : 'robin',
			sessionName : 'session'
		},
		yunpian : {
			apiKey  : '336622ee05a97de6b23b5c6a5a76e3f7'
		},
		wechat : {
			appid          : 'wx06c82c3cbb012752',
			appsecret      : '0f7f047780e15e68308ed981c4f0bfed',
			token          : 'hansgrohe',
			encodingAESKey : 'qtsV9j2v5U5gUNLLOB9S5CEpTCrsXnoWVLvSx6umZwK',
			url            : 'http://filtration.hansgrohe.com.cn',
			oauth          : '/wechat/oauth/login',
			local          : '47.100.162.54',
			pay : {
				partnerKey : "C373DDCA1B97E59F7424553D36795A62",
				appId      : "wx06c82c3cbb012752",
				mchId      : "1493918942",
				notifyUrl  : "http://filtration.hansgrohe.com.cn/payment",
				pfx        : fs.readFileSync(rootPath + '/setting/apiclient_cert.p12')
			}
		}
	}
}

module.exports = config[env];
