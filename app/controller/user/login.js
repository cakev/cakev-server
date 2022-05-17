const Controller = require('../../core/base_controller')

module.exports = class extends Controller {
	/**
	 * @api {post} /user/detail-by-cookie 通过cookie用户详情
	 * @apiName userDetailByCookie
	 * @apiGroup user
	 * @apiUse response
	 */
	async detailByCookie() {
		const userId = this.user
		const data = await this.ctx.model['User'].findOne({ userId }, { _id: 0, __v: 0, isDelete: 0 })
		if (data) {
			const result = this.service['user'].formatResult(data)
			this.success({ data: result })
		} else {
			this.user = null
			this.error({ msg: '登录已过期' })
		}
	}

	/**
	 * @api {post} /user/login-by-cookie 通过cookie用户登录
	 * @apiName userLoginByCookie
	 * @apiGroup user
	 * @apiBody {String} userName 用户名
	 * @apiBody {String} password 密码
	 * @apiUse response
	 */
	async loginByCookie() {
		const { userName, password } = this.params
		const data = await this.ctx.model['User'].findOne(
			{
				userName,
				password: this.encrypt(password),
			},
			{ _id: 0, __v: 0, isDelete: 0 },
		)
		if (data) {
			this.user = data['userId']
			this.success({ data })
		} else {
			this.error({ msg: '用户名或密码错误' })
		}
	}

	/**
	 * @api {post} /user/logout-by-cookie 通过cookie用户登出
	 * @apiName userLogoutByCookie
	 * @apiGroup user
	 * @apiUse response
	 */
	async logoutByCookie() {
		this.user = null
		this.success({ msg: '退出成功' })
	}
}
