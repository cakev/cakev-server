module.exports = app => {
	const { router, controller } = app
	const screenShare = controller.screenShare
	const checkLogin = app.middleware.checkLogin()
	const prefix = '/screenShare/'
	router.post(`${prefix}update`, checkLogin, screenShare.update)
	router.post(`${prefix}detail`, checkLogin, screenShare.detail)
	router.post(`${prefix}login`, screenShare.login)
	router.post(`${prefix}use`, screenShare.use)
}
