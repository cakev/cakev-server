const Controller = require('../../core/base_controller')
const { v4 } = require('uuid')

/**
 * @controller ScreenController 大屏
 */
module.exports = class extends Controller {
	/**
	 * @summary 创建大屏【需要用户登录】
	 * @router post /screen/create
	 * @request body screen_create_request
	 * @response 200 response
	 */
	async create() {
		const { ctx } = this
		const {
			screenName,
			screenWidgets,
			screenWidgetsLays,
			screenScene,
			screenAvatar,
			screenVersion,
			screenLayoutMode,
			screenWidth,
			screenHeight,
			screenBackGroundColor,
			screenBackGroundImage,
			screenMainScene,
			screenDomain,
			screenHeaders,
			screenFilter,
		} = this.params
		const data = await ctx.model.Screen.create({
			screenName,
			screenVersion,
			screenLayoutMode,
			screenMainScene,
			screenFilter,
			screenWidth,
			screenDomain,
			screenHeaders,
			screenHeight,
			screenBackGroundColor,
			screenBackGroundImage,
			screenAvatar,
			screenScene,
			screenWidgets,
			screenWidgetsLays,
			screenOwner: this.user,
		})
		this.success({ data })
	}

	/**
	 * @summary 更新大屏【需要用户登录】
	 * @router post /screen/update
	 * @request body screen_update_request
	 * @response 200 response
	 */
	async update() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model.Screen.updateOne(
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
	 * @summary 删除大屏【需要用户登录】
	 * @router post /screen/destroy
	 * @request body screen_detail_request
	 * @response 200 response
	 */
	async destroy() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model.Screen.updateOne(
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
	 * @summary 恢复大屏【需要用户登录】
	 * @router post /screen/restore
	 * @request body screen_detail_request
	 * @response 200 response
	 */
	async restore() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model.Screen.updateOne(
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
	 * @summary 大屏详情【大屏未分享 需要用户登录/大屏已分享 不需要用户登录】
	 * @router post /screen/detail
	 * @request body screen_detail_request
	 * @response 200 response
	 */
	async detail() {
		const { ctx } = this
		const { screenId } = this.params
		let data = await ctx.model.Screen.findOne(
			{
				screenId,
				isDelete: false,
				screenOwner: this.user,
			},
			{
				__v: 0,
				_id: 0,
				deleteTime: 0,
				isDelete: 0,
				screenOwner: 0,
			},
		)
		if (data) {
			this.success({ data })
		} else {
			this.error({ msg: '用户未登录', code: 4001 })
		}
	}

	/**
	 * @summary 大屏分页列表【需要用户登录】
	 * @router post /screen/list
	 * @request body screen_list_request
	 * @response 200 response
	 */
	async list() {
		const { ctx } = this
		let search = Object.assign({}, this.params)
		delete search.pageSize
		delete search.pageNum
		if (search.screenName) {
			const reg = new RegExp(search.screenName, 'i')
			search.$or = [{ screenName: { $regex: reg } }]
			delete search.screenName
		}
		const list = await ctx.model.Screen.find(
			{
				isDelete: false,
				screenOwner: this.user,
				...search,
			},
			{
				__v: 0,
				_id: 0,
				screenWidgets: 0,
				deleteTime: 0,
				isDelete: 0,
				screenOwner: 0,
			},
		).sort({ sort: 1, createTime: 1 })
		const count = await ctx.model.Screen.count({
			isDelete: false,
			screenOwner: this.user,
			...search,
		})
		this.success({ data: { list, count } })
	}

	/**
	 * @summary 大屏外链列表
	 * @router post /screen/linkList
	 * @request body screen_detail_request
	 * @response 200 response
	 */
	async linkList() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model.Link.find(
			{
				isDelete: false,
				linkScreenId: screenId,
			},
			{
				__v: 0,
				_id: 0,
				deleteTime: 0,
				isDelete: 0,
				linkOwner: 0,
				createTime: 0,
				updateTime: 0,
				linkName: 0,
				sort: 0,
				linkScreenId: 0,
				linkId: 0,
			},
		).sort({ sort: 1, createTime: 1 })
		this.success({ data })
	}
}
