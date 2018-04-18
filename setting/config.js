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
			apiKey  : '20a4152a354eaea512a093e891e08639'
		},
		wechat : {
			// Kain 的测试公众号
			appid          : 'wx1020286e395af06c',
			appsecret      : 'd9353526d9ebe7093325b5d2de244af8',
			token          : 'KainTest',
			encodingAESKey : '',
			url            : 'http://testserver.eatisco.com',
			oauth          : '/wechat/oauth/login',
			local          : '106.14.94.210',
			pay : {
				partnerKey : "<partnerkey>",
				appId      : "<appid>",
				mchId      : "<mchid>",
				notifyUrl  : "<notifyurl>",
				// pfx        : fs.readFileSync(rootPath + '/setting/apiclient_cert.p12')
			}
		}
	},
	test: {
		root         : rootPath,
		port         : port,
		maxOrderTime : 1080,
		app          : {
			name : 'robin-test',
			local: 'http://localhost:' + port
		},
		mongo : 'mongodb://ec2-54-223-41-81.cn-north-1.compute.amazonaws.com.cn:27017/robin',
		main  : {
			languagePath : rootPath + '/language/'
		},
		cookie : {
			secret      : 'robin',
			sessionName : 'session'
		},
		yunpian : {
			apiKey  : '20a4152a354eaea512a093e891e08639'
		},
		wechat : {
			// Kain 的测试公众号
			appid          : 'wx1020286e395af06c',
			appsecret      : 'd9353526d9ebe7093325b5d2de244af8',
			token          : 'KainTest',
			encodingAESKey : '',
			url            : 'http://testserver.eatisco.com',
			oauth          : '/wechat/oauth/login',
			local : '106.14.94.210',
			pay : {
				partnerKey : "<partnerkey>",
				appId      : "<appid>",
				mchId      : "<mchid>",
				notifyUrl  : "<notifyurl>",
				// pfx        : fs.readFileSync(rootPath + '/setting/apiclient_cert.p12')
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
			apiKey  : '20a4152a354eaea512a093e891e08639'
		},
		wechat : {
			appid          : 'wx8085521f68620a15',
			appsecret      : 'a0eeddf8135a3a1ec2c1e76def2dbaac',
			token          : 'KainTest',
			encodingAESKey : 'eTEJgOjqVVAmEWfV0umQtvyxNgYzWvIK71YvmGdaGaJ',
			url            : 'http://testserver.eatisco.com',
			oauth          : '/wechat/oauth/login',
			local          : '106.14.94.210',
			pay : {
				partnerKey : "0CDAABDB348EABEEF271430112364BB8",
				appId      : "wx8085521f68620a15",
				mchId      : "1486224252",
				notifyUrl  : "http://server.eatisco.com/payment/wechat/notify",
				// pfx        : fs.readFileSync(rootPath + '/setting/apiclient_cert.p12')
			},
			open : {
				appid          : 'wx9b38d409f423b921',
				appsecret      : '72ede5fcc886ee383961175fd595569b',
			}
		}
	}
}

module.exports = config[env];
