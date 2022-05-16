module.exports = app => {
	const { router, controller } = app
	const checkLogin = app.middleware.checkLogin()
	const prefix = '/screen/'
	const route = controller['screen']
	router.post(`${prefix}list`, checkLogin, route['index'].list)
	router.post(`${prefix}create`, checkLogin, route['index'].create)
	router.post(`${prefix}destroy`, checkLogin, route['index'].destroy)
	router.post(`${prefix}restore`, checkLogin, route['index'].restore)
	router.post(`${prefix}detail`, route['index'].detail)
	router.post(`${prefix}update`, checkLogin, route['index'].update)
	router.post(`${prefix}linkList`, route['index'].linkList)
}
