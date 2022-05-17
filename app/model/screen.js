module.exports = app => {
	const mongoose = app.mongoose
	const ObjectId = mongoose.Schema.ObjectId
	const Schema = new mongoose.Schema({
		screenId: { type: ObjectId, auto: true }, // 大屏ID
		screenName: { type: String, default: '未命名大屏' }, // 大屏名
		screenWidgets: { type: Object, default: {} }, // 大屏组件配置
		screenWidgetsLays: { type: Object, default: {} }, // 大屏组件配置
		screenScene: { type: Object, default: {} }, // 大屏场景配置
		screenAvatar: { type: String, default: '' }, // 大屏缩略图
		screenVersion: { type: String, default: '' }, // 大屏版本号
		screenLayoutMode: { type: String, default: 'full-size' }, // 大屏适配方式 full-size 充满页面 full-width 100%宽度 full-height 100%高度
		screenWidth: { type: Number, default: 1920 }, // 大屏宽度
		screenHeight: { type: Number, default: 1080 }, // 大屏高度
		screenBackGroundColor: { type: String, default: 'rgb(11,11,11)' }, // 大屏背景颜色
		screenBackGroundImage: { type: String, default: '' }, // 大屏背景图片
		screenMainScene: { type: [String, Number], default: 0 }, // 大屏首屏场景
		screenDomain: { type: String, default: '' }, // 大屏场景domain配置
		screenHeaders: { type: String, default: '{"Content-Type":"application/json"}' }, // 大屏场景headers配置
		screenFilter: {
			type: Object,
			default: {
				enable: false,
				grayscale: 0,
				opacity: 100,
				contrast: 0,
				brightness: 0,
				saturate: 0,
				hueRotate: 0,
			},
		}, // 大屏滤镜
		screenOwner: { type: ObjectId, ref: 'User' }, // 大屏所有者
		createTime: { type: Date, default: Date.now }, // 创建时间
		updateTime: { type: Date, default: Date.now }, // 更新时间
		isDelete: { type: Boolean, default: false }, // 是否删除
	})

	return mongoose.model('Screen', Schema)
}
