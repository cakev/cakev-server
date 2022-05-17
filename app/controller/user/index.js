const Controller = require('../../core/base_controller')

module.exports = class extends Controller {
	/**
	 * @api {post} /user/create 用户创建
	 * @apiName userCreate
	 * @apiGroup user
	 * @apiBody {String} userName userName
	 * @apiBody {String} userRealName 姓名
	 * @apiBody {Number} userAvatar 用户头像
	 * @apiBody {Number} userSex 性别 男/女 1/2
	 * @apiBody {String} password 密码
	 * @apiBody {String} email E-mail
	 * @apiBody {String} mobile 手机号
	 * @apiUse response
	 */
	async create() {
		const { userName, userRealName, userAvatar, userSex, password, email, mobile } = this.params
		const result = {
			userName,
			userRealName,
			userAvatar,
			userSex,
			password: this.encrypt(password),
			email,
			mobile,
		}
		const same = await this.ctx.model['User'].findOne({ userName })
		if (same) {
			this.error({ msg: '该用户名已被使用' })
		} else {
			await this.ctx.model['User'].create(result)
			this.success({ data: result })
		}
	}

	/**
	 * @api {post} /user/update 用户更新
	 * @apiName userUpdate
	 * @apiGroup user
	 * @apiBody {String} userId userId
	 * @apiBody {String} userName userName
	 * @apiBody {String} userRealName 姓名
	 * @apiBody {Number} userAvatar 用户头像
	 * @apiBody {Number} userSex 性别 男/女 1/2
	 * @apiBody {String} password 密码
	 * @apiBody {String} email E-mail
	 * @apiBody {String} mobile 手机号
	 * @apiUse response
	 */
	async update() {
		const { userId, userName, userRealName, userAvatar, userSex, password, email, mobile } = this.params
		const note = await this.ctx.model['User'].findOneAndUpdate(
			{
				userId,
			},
			{
				userName,
				userRealName,
				userAvatar,
				userSex,
				password,
				email,
				mobile,
			},
		)
		if (note) {
			this.success({ msg: '更新成功' })
		} else {
			this.error({ msg: '更新失败' })
		}
	}
}
