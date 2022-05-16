module.exports = app => {
	const mongoose = app.mongoose
	const Schema = new mongoose.Schema({
		componentTypeId: { type: String }, // 组件类型id
		componentTypeName: { type: String }, // 组件类型名
		componentTypeEnName: { type: String }, // 组件类型英文名
		componentTypeParentId: { type: String, default: null }, // 组件类型父级id
		remark: { type: String }, // 备注
		sort: { type: Number, default: 1 }, // 排序
		createTime: { type: Date, default: Date.now }, // 创建时间
		updateTime: { type: Date, default: Date.now }, // 更新时间
		deleteTime: { type: Date, default: null }, // 删除时间
		isDelete: { type: Boolean, default: false }, // 是否删除
	})

	return mongoose.model('MarketComponentTypeCommon', Schema)
}
