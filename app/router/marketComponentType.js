module.exports = app => {
	const { router, controller } = app
	const marketComponentType = controller.marketComponentType
	const checkLogin = app.middleware.checkLogin()
	const prefix = '/market/componentType/'
	router.post(`${prefix}create`, checkLogin, marketComponentType.create)
	router.post(`${prefix}detail`, checkLogin, marketComponentType.detail)
	router.post(`${prefix}destroy`, checkLogin, marketComponentType.destroy)
	router.post(`${prefix}restore`, checkLogin, marketComponentType.restore)
	router.post(`${prefix}update`, checkLogin, marketComponentType.update)
	router.post(`${prefix}levelList`, checkLogin, marketComponentType.levelList)
	router.post(`${prefix}level`, marketComponentType.level)
}
