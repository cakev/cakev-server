module.exports = app => {
	const { router, controller } = app
	const upload = controller.upload
	const prefix = '/upload/'
	router.post(`${prefix}file`, upload.file)
}
