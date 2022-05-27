const Controller = require('../../core/base_controller')

module.exports = class extends Controller {
	/**
	 * @api {post} /screen/create 创建大屏
	 * @apiName screenCreate
	 * @apiGroup screen
	 * @apiUse response
	 */
	async create() {
		const { ctx } = this
		const data = await ctx.model['Screen'].create({
			screenName: '未命名大屏',
			screenHead: [],
			screenVersion: '',
			screenLayoutMode: 'full-size',
			screenMainScene: '0',
			screenFilter: {
				enable: false,
				grayscale: 0,
				opacity: 100,
				contrast: 0,
				brightness: 0,
				saturate: 0,
				hueRotate: 0,
			},
			screenWidth: 1920,
			screenDomain: '',
			screenHeaders: '{"Content-Type":"application/json"}',
			screenHeight: 1080,
			screenBackGroundColor: 'rgba(24, 27, 36,1)',
			screenBackGroundImage: '',
			screenAvatar: '',
			screenScene: {},
			screenWidgets: {},
			screenWidgetsLays: {},
			screenOwner: this.user,
		})
		this.success({ data })
	}

	/**
	 * @api {post} /screen/update 更新大屏
	 * @apiName screenUpdate
	 * @apiGroup screen
	 * @apiBody {String} screenId screenId
	 * @apiBody {String} screenName 大屏名
	 * @apiBody {Array}  screenHead 大屏外链
	 * @apiBody {Object} screenWidgets 大屏组件配置
	 * @apiBody {Object} screenWidgetsLays 大屏组件配置
	 * @apiBody {Object} screenScene 大屏场景配置
	 * @apiBody {String} screenAvatar 大屏缩略图
	 * @apiBody {String} screenVersion 大屏版本号
	 * @apiBody {String} screenLayoutMode 大屏适配方式 full-size 充满页面 full-width 100%宽度 full-height 100%高度
	 * @apiBody {Number} screenWidth 大屏宽度
	 * @apiBody {Number} screenHeight 大屏高度
	 * @apiBody {String} screenBackGroundColor 大屏背景颜色
	 * @apiBody {String} screenBackGroundImage 大屏背景图片
	 * @apiBody {String} screenMainScene 大屏首屏场景
	 * @apiBody {String} screenDomain 大屏场景domain配置
	 * @apiBody {String} screenHeaders 大屏场景headers配置
	 * @apiBody {Object} screenFilter 大屏滤镜
	 * @apiUse response
	 */
	async update() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model['Screen'].updateOne(
			{
				screenId,
				screenOwner: this.user,
				isDelete: false,
			},
			{ ...this.params, updateTime: Date.now() },
		)
		if (data.ok) {
			this.success({ msg: '更新成功' })
		} else {
			this.error({ msg: '更新失败' })
		}
	}

	/**
	 * @api {post} /screen/destroy 删除大屏
	 * @apiName screenDestroy
	 * @apiGroup screen
	 * @apiBody {String} screenId screenId
	 * @apiUse response
	 */
	async destroy() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model['Screen'].updateOne(
			{
				screenId,
				screenOwner: this.user,
				isDelete: false,
			},
			{
				isDelete: true,
				updateTime: Date.now(),
			},
		)
		if (data.ok) {
			this.success({ msg: '删除成功' })
		} else {
			this.error({ msg: '删除失败' })
		}
	}

	/**
	 * @api {post} /screen/restore 恢复大屏
	 * @apiName screenRestore
	 * @apiGroup screen
	 * @apiBody {String} screenId screenId
	 * @apiUse response
	 */
	async restore() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model['Screen'].updateOne(
			{
				screenId,
				screenOwner: this.user,
				isDelete: true,
			},
			{
				isDelete: false,
				updateTime: Date.now(),
			},
		)
		if (data.ok) {
			this.success({ msg: '恢复成功' })
		} else {
			this.error({ msg: '恢复失败' })
		}
	}

	/**
	 * @api {post} /screen/detail 大屏详情
	 * @apiName screenDetail
	 * @apiGroup screen
	 * @apiBody {String} screenId screenId
	 * @apiUse response
	 */
	async detail() {
		const { ctx } = this
		const { screenId } = this.params
		let data = await ctx.model['Screen'].findOne(
			{
				screenId,
				isDelete: false,
			},
			{
				__v: 0,
				_id: 0,
				isDelete: 0,
				screenOwner: 0,
			},
		)
		this.success({ data })
	}

	/**
	 * @api {post} /screen/all 大屏列表
	 * @apiName screenAll
	 * @apiGroup screen
	 * @apiBody {String} screenName 大屏名
	 * @apiUse response
	 */
	async all() {
		const { ctx } = this
		let search = Object.assign({}, this.params)
		if (search.screenName) {
			const reg = new RegExp(search.screenName, 'i')
			search.$or = [{ screenName: { $regex: reg } }]
			delete search.screenName
		}
		const list = await ctx.model['Screen']
			.find({
				isDelete: false,
				screenOwner: this.user,
				...search,
			})
			.sort({ createTime: 1 })
		const count = await ctx.model['Screen'].count({
			isDelete: false,
			screenOwner: this.user,
			...search,
		})
		this.success({ data: { list: this.ctx.service['screen'].formatResult(list), count } })
	}
}
