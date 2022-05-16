module.exports = () => {
	return async function (ctx, next) {
		await next()
		if (ctx.status === 404 && !ctx.body) {
			const request = ctx.request
			const xRequestedWith = request.get('x-requested-with')
			const method = request.method.toUpperCase()
			const reg = ['XMLHttpRequest']
			if (reg.indexOf(xRequestedWith) !== -1 || method !== 'GET') {
				ctx.body = {
					code: 404,
					data: null,
					msg: '系统异常',
					success: false,
				}
			} else {
				ctx.status = 404
				ctx.body = {
					code: 404,
					data: null,
					msg: '系统异常',
					success: false,
				}
			}
		}
	}
}
