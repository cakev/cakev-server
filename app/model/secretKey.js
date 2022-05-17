module.exports = app => {
	const mongoose = app.mongoose
	const ObjectId = mongoose.Schema.ObjectId
	const Schema = new mongoose.Schema({
		userId: { type: ObjectId, ref: 'User' }, // 用户ID
		appKey: { type: String }, // 用户AppKey
		appSecret: { type: String }, // 用户AppSecret
		remark: { type: String }, // 备注
		enabled: { type: Boolean, default: true }, // 在用/停用
		createTime: { type: Date, default: Date.now }, // 创建时间
		updateTime: { type: Date, default: Date.now }, // 更新时间
		isDelete: { type: Boolean, default: false }, // 是否删除
	})

	return mongoose.model('SecretKey', Schema)
}
