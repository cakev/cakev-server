module.exports = app => {
	const { router, controller } = app
	const link = controller.link
	const checkLogin = app.middleware.checkLogin()
	const prefix = '/link/'
	router.post(`${prefix}list`, checkLogin, link.list)
	router.post(`${prefix}create`, checkLogin, link.create)
	router.post(`${prefix}destroy`, checkLogin, link.destroy)
	router.post(`${prefix}restore`, checkLogin, link.restore)
	router.post(`${prefix}detail`, link.detail)
	router.post(`${prefix}update`, checkLogin, link.update)
}
