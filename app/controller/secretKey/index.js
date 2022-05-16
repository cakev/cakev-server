const Controller = require('../core/base_controller')
const { v4 } = require('uuid')

/**
 * @controller SecretKeyController 密钥
 */
module.exports = class extends Controller {
	/**
	 * @summary 创建密钥【需要用户登录】
	 * @router post /secretKey/create
	 * @response 200 response
	 */
	async create() {
		const { ctx } = this
		let appKey = v4()
		appKey = appKey.replace(/-/g, '')
		let appSecret = v4()
		appSecret = appSecret.replace(/-/g, '')
		const data = await ctx.model.SecretKey.create({
			userId: this.user,
			appKey,
			appSecret,
		})
		this.success({ data })
	}

	/**
	 * @summary 当前用户所有密钥列表【需要用户登录】
	 * @router post /secretKey/all
	 * @response 200 response
	 */
	async all() {
		const { ctx } = this
		const data = await ctx.model.SecretKey.find(
			{
				userId: this.user,
				isDelete: false,
			},
			{
				__v: 0,
				_id: 0,
				deleteTime: 0,
				isDelete: 0,
			},
		)
		this.success({ data })
	}

	/**
	 * @summary 停用密钥【需要用户登录】
	 * @router post /secretKey/disabled
	 * @request body secretKey_detail_request
	 * @response 200 response
	 */
	async disabled() {
		const { ctx } = this
		const { appKey, appSecret } = this.params
		const data = await ctx.model.SecretKey.updateOne(
			{
				appKey,
				appSecret,
				userId: this.user,
				isDelete: false,
			},
			{
				isUsed: false,
				updateTime: Date.now(),
			},
		)
		if (data.ok) {
			this.success({ msg: '停用成功' })
		} else {
			this.error({ msg: '停用失败' })
		}
	}

	/**
	 * @summary 启用密钥【需要用户登录】
	 * @router post /secretKey/enabled
	 * @request body secretKey_detail_request
	 * @response 200 response
	 */
	async enabled() {
		const { ctx } = this
		const { appKey, appSecret } = this.params
		const data = await ctx.model.SecretKey.updateOne(
			{
				appKey,
				appSecret,
				userId: this.user,
				isDelete: false,
			},
			{
				isUsed: true,
				updateTime: Date.now(),
			},
		)
		if (data.ok) {
			this.success({ msg: '启用成功' })
		} else {
			this.error({ msg: '启用失败' })
		}
	}
}
