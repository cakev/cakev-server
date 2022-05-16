module.exports = () => {
	return async function (ctx, next) {
		if (ctx.cookies.get('cakev', { encrypt: true })) {
			await next()
		} else {
			ctx.body = {
				code: 401,
				data: '',
				success: false,
				msg: '未登录',
			}
		}
	}
}
