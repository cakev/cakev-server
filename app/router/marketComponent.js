module.exports = app => {
	const { router, controller } = app
	const marketComponent = controller.marketComponent
	const checkLogin = app.middleware.checkLogin()
	const prefix = '/market/component/'
	router.post(`${prefix}list`, checkLogin, marketComponent.list)
	router.post(`${prefix}checkList`, checkLogin, marketComponent.checkList)
	router.post(`${prefix}recycleList`, checkLogin, marketComponent.recycleList)
	router.post(
		`${prefix}versionUpdateList`,
		checkLogin,
		marketComponent.versionUpdateList,
	)
	router.post(
		`${prefix}checkHistoryList`,
		checkLogin,
		marketComponent.checkHistoryList,
	)
	router.post(`${prefix}typeList`, marketComponent.typeList)
	router.post(`${prefix}create`, marketComponent.create)
	router.post(`${prefix}detail`, marketComponent.detail)
	router.post(`${prefix}destroy`, checkLogin, marketComponent.destroy)
	router.post(`${prefix}restore`, checkLogin, marketComponent.restore)
	router.post(
		`${prefix}checkSuccess`,
		checkLogin,
		marketComponent.checkSuccess,
	)
	router.post(`${prefix}checkError`, checkLogin, marketComponent.checkError)
	router.post(`${prefix}version`, marketComponent.version)
	router.post(`${prefix}update`, checkLogin, marketComponent.update)
	router.post(`${prefix}use`, marketComponent.use)
	router.post(`${prefix}useList`, marketComponent.useList)
}
