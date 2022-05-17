const Service = require('egg').Service

module.exports = class extends Service {
	async findById(userId) {
		const { ctx } = this
		return await ctx.model['User'].findOne(
			{
				userId,
				isDelete: false,
			},
			{ __v: 0, _id: 0, password: 0, isDelete: 0 },
		)
	}
	async findByAppKey(appKey) {
		const { ctx } = this
		return await ctx.model['SecretKey'].findOne({
			appKey,
			enabled: true,
		})
	}

	formatResult(data) {
		const result = JSON.parse(JSON.stringify(data))
		delete result.password
		delete result.userId
		delete result.isDelete
		delete result.__v
		delete result._id
		return result
	}
}
