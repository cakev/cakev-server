module.exports = app => {
	const mongoose = app.mongoose
	const ObjectId = mongoose.Schema.ObjectId
	const Schema = new mongoose.Schema({
		userId: { type: ObjectId, auto: true }, // 用户ID
		userName: { type: String }, // 用户名
		userRealName: { type: String }, // 用户真实姓名
		userAvatar: { type: String }, // 用户头像
		userSex: { type: Number, default: 1, enum: [1, 2] }, // 用户性别：男/女 1/2。
		password: { type: String }, // 密码
		email: { type: String }, // E-mail
		mobile: { type: String }, // 手机号
		remark: { type: String }, // 备注
		createTime: { type: Date, default: Date.now }, // 创建时间
		updateTime: { type: Date, default: Date.now }, // 更新时间
		isDelete: { type: Boolean, default: false }, // 是否删除
	})

	return mongoose.model('User', Schema)
}
