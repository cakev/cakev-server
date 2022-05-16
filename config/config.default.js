const path = require('path')

module.exports = appInfo => {
	const config = {}

	config.keys = appInfo.name + '_1491794325123_604'

	config.logger = {
		appLogName: 'app.log',
		coreLogName: 'core.log',
		agentLogName: 'agent.log',
		errorLogName: 'error.log',
	}

	config.middleware = ['errorHandler', 'notfoundHandler', 'gzip']

	config.security = {
		csrf: false,
	}

	config.multipart = {
		mode: 'stream',
		fileExtensions: ['.webm'],
	}

	config.cluster = {
		listen: {
			path: '',
			port: 7001,
			hostname: '0.0.0.0',
		},
	}

	config.cors = {
		origin: '*',
		allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
	}

	config.static = {
		dir: [path.join(appInfo.baseDir, 'app/public')],
		prefix: '/',
	}

	return config
}
