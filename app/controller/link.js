const Controller = require('../core/base_controller')
const { v4 } = require('uuid')

/**
 * @controller LinkController 外链
 */
module.exports = class extends Controller {
	/**
	 * @summary 创建外链【需要用户登录】
	 * @router post /link/create
	 * @request body link_create_request
	 * @response 200 response
	 */
	async create() {
		const { ctx } = this
		const { linkName, linkType, linkScreenId, linkUrl } = this.params
		const linkId = v4()
		const data = await ctx.model.Link.create({
			linkId,
			linkName,
			linkType,
			linkScreenId,
			linkUrl,
			linkOwner: this.user,
		})
		this.success({ data })
	}

	/**
	 * @summary 更新外链【需要用户登录】
	 * @router post /link/update
	 * @request body link_update_request
	 * @response 200 response
	 */
	async update() {
		const { ctx } = this
		const { linkId } = this.params
		const data = await ctx.model.Link.updateOne(
			{
				linkId,
				linkOwner: this.user,
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
	 * @summary 删除外链【需要用户登录】
	 * @router post /link/destroy
	 * @request body link_detail_request
	 * @response 200 response
	 */
	async destroy() {
		const { ctx } = this
		const { linkId } = this.params
		const data = await ctx.model.Link.updateOne(
			{
				linkId,
				linkOwner: this.user,
				isDelete: false,
			},
			{
				isDelete: true,
				deleteTime: Date.now(),
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
	 * @summary 恢复外链【需要用户登录】
	 * @router post /link/restore
	 * @request body link_detail_request
	 * @response 200 response
	 */
	async restore() {
		const { ctx } = this
		const { linkId } = this.params
		const data = await ctx.model.Link.updateOne(
			{
				linkId,
				linkOwner: this.user,
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
	 * @summary 外链详情
	 * @router post /link/detail
	 * @request body link_detail_request
	 * @response 200 response
	 */
	async detail() {
		const { ctx } = this
		const { linkId } = this.params
		let data = await ctx.model.Link.findOne(
			{
				linkId,
				isDelete: false,
			},
			{
				__v: 0,
				_id: 0,
				deleteTime: 0,
				isDelete: 0,
				linkOwner: 0,
			},
		)
		this.success({ data })
	}

	/**
	 * @summary 外链分页列表【需要用户登录】
	 * @router post /link/list
	 * @request body link_list_request
	 * @response 200 response
	 */
	async list() {
		const { ctx } = this
		const { pageSize = 10, pageNum = 1 } = this.params
		let search = Object.assign({}, this.params)
		delete search.pageSize
		delete search.pageNum
		if (search.linkName) {
			const reg = new RegExp(search.linkName, 'i')
			search.$or = [{ linkName: { $regex: reg } }]
			delete search.linkName
		}
		const result = await ctx.model.Link.find(
			{
				isDelete: false,
				linkOwner: this.user,
				...search,
			},
			{
				__v: 0,
				_id: 0,
				deleteTime: 0,
				isDelete: 0,
				linkOwner: 0,
			},
		)
			.sort({ sort: 1, createTime: 1 })
			.skip((pageNum - 1) * pageSize)
			.limit(Number(pageSize))
		let data = JSON.parse(JSON.stringify(result))
		let p = []
		data.forEach(item => {
			if (item.linkScreenId) {
				p.push(
					new Promise(resolve => {
						ctx.model.Screen.findOne({
							isDelete: false,
							screenId: item.linkScreenId,
						}).then(res => {
							item.linkScreenName = res.screenName
							resolve(1)
						})
					}),
				)
			}
		})
		const count = await ctx.model.Link.count({
			isDelete: false,
			linkOwner: this.user,
			...search,
		})
		await Promise.all(p)
		this.success({ data: { list: data, count } })
	}
}
