module.exports = app => {
	const mongoose = app.mongoose
	const ObjectId = mongoose.Schema.ObjectId
	const Schema = new mongoose.Schema(
		{
			screenId: { type: ObjectId, auto: true }, // 大屏ID
			screenName: { type: String }, // 大屏名
			screenHead: {}, // 外链
			screenWidgets: {}, // 大屏组件配置
			screenWidgetsLays: {}, // 大屏组件配置
			screenScene: {}, // 大屏场景配置
			screenAvatar: { type: String }, // 大屏缩略图
			screenVersion: { type: String }, // 大屏版本号
			screenLayoutMode: { type: String }, // 大屏适配方式 full-size 充满页面 full-width 100%宽度 full-height 100%高度
			screenWidth: { type: Number }, // 大屏宽度
			screenHeight: { type: Number }, // 大屏高度
			screenBackGroundColor: { type: String }, // 大屏背景颜色
			screenBackGroundImage: { type: String }, // 大屏背景图片
			screenMainScene: { type: String }, // 大屏首屏场景
			screenDomain: { type: String }, // 大屏场景domain配置
			screenHeaders: { type: String }, // 大屏场景headers配置
			screenFilter: {}, // 大屏滤镜
			screenOwner: { type: ObjectId, ref: 'User' }, // 大屏所有者
			createTime: { type: Date, default: Date.now }, // 创建时间
			updateTime: { type: Date, default: Date.now }, // 更新时间
			isDelete: { type: Boolean, default: false }, // 是否删除
		},
		{ minimize: false },
	)

	return mongoose.model('Screen', Schema)
}
