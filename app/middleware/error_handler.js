module.exports = () => {
	return async function (ctx, next) {
		try {
			await next()
		} catch (err) {
			ctx.app.emit('error', err, ctx)
			ctx.body = {
				code: 500,
				data: null,
				msg: '系统异常',
				success: false,
			}
			ctx.status = 200
		}
	}
}
