module.exports = app => {
	const mongoose = app.mongoose
	const Schema = new mongoose.Schema({
		screenId: { type: String }, // 大屏ID
		screenGuide: { type: Array, default: [] }, // 大屏参考线
		screenSharePassword: { type: String }, // 大屏分享密码
		screenShareType: { type: String }, // 大屏分享类型 ALL:公开分享 PASSWORD:密码分享 TIME:时效分享 NO:不分享
		screenShareTime: { type: Date }, // 大屏分享结束时间
		createTime: { type: Date, default: Date.now }, // 创建时间
		updateTime: { type: Date, default: Date.now }, // 更新时间
		deleteTime: { type: Date, default: null }, // 删除时间
		isDelete: { type: Boolean, default: false }, // 是否删除
	})

	return mongoose.model('ScreenShare', Schema)
}
