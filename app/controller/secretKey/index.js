const Controller = require('../../core/base_controller')
const { v4 } = require('uuid')

module.exports = class extends Controller {
	/**
	 * @api {post} /secretKey/create 创建密钥
	 * @apiName secretKeyCreate
	 * @apiGroup secretKey
	 * @apiUse response
	 */
	async create() {
		const { ctx } = this
		const same = await this.ctx.model['SecretKey'].findOne({ userId: this.user })
		console.log(same)
		if (same) {
			this.error({ msg: '至多创建一个密钥' })
		} else {
			const appKey = v4().replace(/-/g, '')
			const appSecret = v4().replace(/-/g, '')
			const data = await ctx.model['SecretKey'].create({
				userId: this.user,
				appKey,
				appSecret,
			})
			this.success({ data })
		}
	}

	/**
	 * @api {post} /secretKey/all 当前用户所有密钥列表
	 * @apiName secretKeyAll
	 * @apiGroup secretKey
	 * @apiUse response
	 */
	async all() {
		const { ctx } = this
		const data = await ctx.model['SecretKey'].find(
			{
				userId: this.user,
				isDelete: false,
			},
			{
				__v: 0,
				_id: 0,
				isDelete: 0,
				userId: 0,
			},
		)
		this.success({ data })
	}

	/**
	 * @api {post} /secretKey/disabled 停用密钥
	 * @apiName secretKeyDisabled
	 * @apiGroup secretKey
	 * @apiBody {String} appKey appKey
	 * @apiBody {String} appSecret appSecret
	 * @apiUse response
	 */
	async disabled() {
		const { ctx } = this
		const { appKey, appSecret } = this.params
		const data = await ctx.model['SecretKey'].updateOne(
			{
				appKey,
				appSecret,
				userId: this.user,
				isDelete: false,
			},
			{
				enabled: false,
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
	 * @api {post} /secretKey/enabled 启用密钥
	 * @apiName secretKeyEnabled
	 * @apiGroup secretKey
	 * @apiBody {String} appKey appKey
	 * @apiBody {String} appSecret appSecret
	 * @apiUse response
	 */
	async enabled() {
		const { ctx } = this
		const { appKey, appSecret } = this.params
		const data = await ctx.model['SecretKey'].updateOne(
			{
				appKey,
				appSecret,
				userId: this.user,
				isDelete: false,
			},
			{
				enabled: true,
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
