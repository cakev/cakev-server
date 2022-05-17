module.exports = app => {
	const { router, controller } = app
	const checkLogin = app.middleware.checkLogin()
	const prefix = '/user/'
	const route = controller['user']
	router.post(`${prefix}create`, checkLogin, route['index'].create)
	router.post(`${prefix}update`, checkLogin, route['index'].update)
	router.post(`${prefix}detail-by-cookie`, checkLogin,route['login'].detailByCookie)
	router.post(`${prefix}login-by-cookie`, route['login'].loginByCookie)
	router.post(`${prefix}logout-by-cookie`, route['login'].logoutByCookie)
}
