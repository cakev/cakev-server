const Controller = require('../../core/base_controller')

module.exports = class extends Controller {
	/**
	 * @api {post} /user/create 用户创建
	 * @apiName userCreate
	 * @apiGroup user
	 * @apiBody {String} username username
	 * @apiBody {String} realName 姓名
	 * @apiBody {String} mobile 手机号
	 * @apiBody {Number} station 岗位
	 * @apiBody {Number} pay 薪酬
	 * @apiBody {Number} sex 性别 男/女 1/2
	 * @apiBody {String} birthTime 出生日期
	 * @apiBody {String} nation 民族
	 * @apiBody {String} email E-mail
	 * @apiBody {Array} nativeAddress 籍贯
	 * @apiBody {String} nativeAddressDetail 籍贯-详细地址
	 * @apiBody {String} idCard 身份证
	 * @apiBody {String} school 毕业院校
	 * @apiBody {Number} marriage 婚姻情况 未婚/已婚/离异 1/2/3
	 * @apiBody {Boolean} alive 生命状态 在世/离世 true/false
	 * @apiBody {Boolean} quit 工作状态 在岗/离职 false/true
	 * @apiBody {Number} degree 文化水平 文盲/小学/初中/高中/大专/学士/硕士/博士
	 * @apiUse response
	 */
	async create() {
		const {
			username,
			employeeId,
			realName,
			mobile,
			station,
			sex,
			birthTime,
			marriage,
			nation,
			email,
			pay,
			nativeAddress,
			nativeAddressDetail,
			alive,
			idCard,
			quit,
			degree,
			school,
		} = this.params
		const result = {
			username,
			employeeId,
			realName,
			mobile,
			station,
			sex,
			birthTime,
			marriage,
			nation,
			email,
			pay,
			nativeAddress,
			nativeAddressDetail,
			alive,
			idCard,
			quit,
			degree,
			school,
		}
		const same = await this.ctx.model['User'].findOne({ username })
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
	 * @apiBody {String} username username
	 * @apiBody {String} employeeId 工号
	 * @apiBody {String} realName 姓名
	 * @apiBody {String} mobile 手机号
	 * @apiBody {Number} station 岗位
	 * @apiBody {Number} pay 薪酬
	 * @apiBody {Number} sex 性别 男/女 1/2
	 * @apiBody {String} birthTime 出生日期
	 * @apiBody {String} nation 民族
	 * @apiBody {String} email E-mail
	 * @apiBody {Array} nativeAddress 籍贯
	 * @apiBody {String} nativeAddressDetail 籍贯-详细地址
	 * @apiBody {String} idCard 身份证
	 * @apiBody {String} school 毕业院校
	 * @apiBody {Number} marriage 婚姻情况 未婚/已婚/离异 1/2/3
	 * @apiBody {Boolean} alive 生命状态 在世/离世 true/false
	 * @apiBody {Boolean} quit 工作状态 在岗/离职 false/true
	 * @apiBody {Number} degree 文化水平 文盲/小学/初中/高中/大专/学士/硕士/博士
	 * @apiUse response
	 */
	async update() {
		const {
			employeeId,
			username,
			realName,
			userId,
			mobile,
			station,
			sex,
			birthTime,
			marriage,
			nation,
			email,
			pay,
			nativeAddress,
			nativeAddressDetail,
			alive,
			idCard,
			quit,
			degree,
			school,
		} = this.params
		const note = await this.ctx.model['User'].findOneAndUpdate(
			{
				userId,
			},
			{
				realName,
				username,
				employeeId,
				mobile,
				station,
				sex,
				birthTime,
				marriage,
				nation,
				pay,
				email,
				nativeAddress,
				nativeAddressDetail,
				alive,
				idCard,
				quit,
				degree,
				school,
			},
		)
		if (note) {
			this.success({ msg: '更新成功' })
		} else {
			this.error({ msg: '更新失败' })
		}
	}
}
