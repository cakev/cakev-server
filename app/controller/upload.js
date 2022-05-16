const Controller = require('../core/base_controller')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mz-modules/mkdirp')
const pump = require('mz-modules/pump')

/**
 * @controller UploadController 上传
 */
module.exports = class extends Controller {
	/**
	 * @summary 单文件上传【不需要用户登录】
	 * @router post /upload/file
	 * @request formData file file 上传文件
	 * @request formData input library 上传指定目录
	 * @request formData input appKey AppKey
	 * @response 200 response
	 */
	async file() {
		const { ctx } = this
		const parts = ctx.multipart({ autoFields: true })
		let stream, saveDir
		while ((stream = await parts()) != null) {
			let fields = parts.field
			const fieldName = path.extname(stream.filename).toLowerCase()
			const uploadDir = path.join('app', 'public', 'upload') // 上传图片的目录
			let exists = await fs.exists(uploadDir, () => {})
			if (!exists) {
				await mkdirp(uploadDir)
			}
			const date = Date.now()
			const uploadFile = path.join(uploadDir, date + fieldName) // 返回图片保存的路径
			const writeStream = fs.createWriteStream(uploadFile)
			await pump(stream, writeStream)
			if (fields.library) {
				let moveDir
				if (this.user) {
					moveDir = path.join(uploadDir, this.user, fields.library)
				} else if (fields.appKey) {
					const user = await ctx.service.user.findByAppKey(
						fields.appKey,
					)
					moveDir = path.join(uploadDir, user.userId, fields.library)
				} else {
					moveDir = path.join(uploadDir, fields.library)
				}
				exists = await fs.exists(moveDir, () => {})
				if (!exists) {
					await mkdirp(moveDir)
				}
				const moveFile = path.join(moveDir, date + fieldName) // 返回图片保存的路径
				saveDir = '/node' + moveFile.slice(3).replace(/\\/g, '/')
				fs.rename(uploadFile, moveFile, () => {})
				this.success({
					data: { url: saveDir.replace('/public/upload', '') },
					msg: '文件上传成功',
				})
			} else {
				fs.unlink(uploadFile, () => {})
				this.error({ msg: '请指定上传目录' })
			}
		}
	}
}
