module.exports = app => {
	const mongoose = app.mongoose
	const Schema = new mongoose.Schema({
		componentId: { type: String }, // 组件ID
		componentTitle: { type: String }, // 组件名
		componentAvatar: { type: String }, // 组件图片地址
		componentConfig: { type: Object }, // 组件配置
		componentJsUrl: { type: String }, // 组件js地址
		componentZipUrl: { type: String }, // 组件zip地址
		componentEnTitle: { type: String }, // 组件英文名
		componentVersion: { type: String }, // 组件版本号
		isCurrentVersion: { type: Boolean, default: false }, // 是否当前版本
		isCollection: { type: Boolean, default: false }, // 是否是收藏组件
		componentTypeId: { type: String }, // 组件类型id
		componentType: { type: String, default: 'BASICS' }, // 组件种类 基础 BASICS 地图 MAP 图表antv ANTV 图表Echarts ECHARTS
		componentOwner: { type: String }, // 组件所有者
		status: { type: String, default: 'PENDING' }, // 组件状态 审核中 PENDING 审核成功 SUCCESS 审核失败 ERROR
		remark: { type: String }, // 备注
		sort: { type: Number, default: 1 }, // 排序
		createTime: { type: Date, default: Date.now }, // 创建时间
		updateTime: { type: Date, default: Date.now }, // 更新时间
		deleteTime: { type: Date, default: null }, // 删除时间
		isDelete: { type: Boolean, default: false }, // 是否删除
	})

	return mongoose.model('MarketComponent', Schema)
}
