module.exports = app => {
	const mongoose = app.mongoose
	const Schema = new mongoose.Schema({
		linkId: { type: String }, // 外链ID
		linkName: { type: String }, // 外链名
		linkUrl: { type: String }, // 外链链接
		linkType: { type: String, default: 'javascript' }, // 外链类型
		linkScreenId: { type: String }, // 外链名关联大屏
		linkOwner: { type: String }, // 外链所有者
		remark: { type: String }, // 备注
		sort: { type: Number, default: 1 }, // 排序
		createTime: { type: Date, default: Date.now }, // 创建时间
		updateTime: { type: Date, default: Date.now }, // 更新时间
		deleteTime: { type: Date, default: null }, // 删除时间
		isDelete: { type: Boolean, default: false }, // 是否删除
	})

	return mongoose.model('Link', Schema)
}
