const Service = require('egg').Service

module.exports = class extends Service {
	async findById(userId) {
		const { ctx } = this
		const data = await ctx.model.User.findOne(
			{
				userId,
				isDelete: false,
			},
			{ __v: 0, _id: 0, password: 0, deleteTime: 0, isDelete: 0 },
		)
		return data
	}
	async findByAppKey(appKey) {
		const { ctx } = this
		const data = await ctx.model.SecretKey.findOne({
			appKey,
			isUsed: true,
		})
		return data
	}

	formatResult(data) {
		const result = JSON.parse(JSON.stringify(data))
		delete result.password
		return result
	}
}
