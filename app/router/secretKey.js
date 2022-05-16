module.exports = app => {
	const { router, controller } = app
	const checkLogin = app.middleware.checkLogin()
	const prefix = '/secretKey/'
	const route = controller['secretKey']
	router.post(`${prefix}create`, checkLogin, route['index'].create)
	router.post(`${prefix}all`, checkLogin, route['index'].all)
	router.post(`${prefix}disabled`, checkLogin, route['index'].disabled)
	router.post(`${prefix}enabled`, checkLogin, route['index'].enabled)
}
