module.exports = app => {
	const user = require('./router/user')
	const screen = require('./router/screen')
	const screenShare = require('./router/screenShare')
	const upload = require('./router/upload')
	const marketComponent = require('./router/marketComponent')
	const marketComponentType = require('./router/marketComponentType')
	const secretKey = require('./router/secretKey')

	user(app)
	screen(app)
	screenShare(app)
	upload(app)
	marketComponent(app)
	marketComponentType(app)
	secretKey(app)
}
