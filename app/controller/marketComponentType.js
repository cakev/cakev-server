const Controller = require('../core/base_controller')
const { v4 } = require('uuid')
const pinyin4js = require('pinyin4js')
/**
 * @controller MarketComponentTypeController 组件市场-组件分类
 */
module.exports = class extends Controller {
	/**
	 * @summary 创建组件分类【需要用户登录】
	 * @router post /market/componentType/create
	 * @request body market_componentType_create_request
	 * @response 200 response
	 */
	async create() {
		const { ctx } = this
		const { componentTypeName, componentTypeParentId } = this.params
		const componentTypeEnName =
			pinyin4js.convertToPinyinString(
				componentTypeName,
				'',
				pinyin4js.FIRST_LETTER,
			) + Math.random().toString(36).replace('0.', '')
		const componentTypeId = v4()
		const user = await ctx.service.user.findById(this.user)
		if (user.userAdmin) {
			const same = await ctx.model.MarketComponentTypeCommon.findOne({
				$or: [{ componentTypeName, componentTypeEnName }],
			})
			if (same) {
				this.error({ msg: '当前组件分类名已被使用' })
			} else {
				const data = await ctx.model.MarketComponentTypeCommon.create({
					componentTypeId,
					componentTypeName,
					componentTypeEnName,
					componentTypeParentId,
				})
				this.success({ data })
			}
		} else {
			const same = await ctx.model.MarketComponentType.findOne({
				$or: [{ componentTypeName, componentTypeEnName }],
			})
			if (same) {
				this.error({ msg: '当前组件分类名已被使用' })
			} else {
				const data = await ctx.model.MarketComponentType.create({
					componentTypeId,
					componentTypeName,
					componentTypeEnName,
					componentTypeOwner: this.user,
				})
				this.success({ data })
			}
		}
	}

	/**
	 * @summary 更新组件分类【需要用户登录】
	 * @router post /market/componentType/update
	 * @request body market_componentType_update_request
	 * @response 200 response
	 */
	async update() {
		const { ctx } = this
		const { componentTypeId } = this.params
		const user = await ctx.service.user.findById(this.user)
		if (user.userAdmin) {
			const data = await ctx.model.MarketComponentTypeCommon.updateOne(
				{
					componentTypeId,
					isDelete: false,
				},
				{ ...this.params, updateTime: Date.now() },
			)
			if (data.ok) {
				this.success({ msg: '更新成功' })
			} else {
				this.error({ msg: '更新失败' })
			}
		} else {
			const data = await ctx.model.MarketComponentType.updateOne(
				{
					componentTypeId,
					isDelete: false,
					componentTypeOwner: this.user,
				},
				{ ...this.params, updateTime: Date.now() },
			)
			if (data.ok) {
				this.success({ msg: '更新成功' })
			} else {
				this.error({ msg: '更新失败' })
			}
		}
	}

	/**
	 * @summary 删除组件分类【需要用户登录】
	 * @router post /market/componentType/destroy
	 * @request body market_componentType_detail_request
	 * @response 200 response
	 */
	async destroy() {
		const { ctx } = this
		const { componentTypeId } = this.params
		const user = await ctx.service.user.findById(this.user)
		if (user.userAdmin) {
			const data = await ctx.model.MarketComponentTypeCommon.updateOne(
				{
					componentTypeId,
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
		} else {
			const data = await ctx.model.MarketComponentType.updateOne(
				{
					componentTypeId,
					isDelete: false,
					componentTypeOwner: this.user,
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
	}

	/**
	 * @summary 恢复组件分类【需要用户登录】
	 * @router post /market/componentType/restore
	 * @request body market_componentType_detail_request
	 * @response 200 response
	 */
	async restore() {
		const { ctx } = this
		const { componentTypeId } = this.params
		const user = await ctx.service.user.findById(this.user)
		if (user.userAdmin) {
			const data = await ctx.model.MarketComponentTypeCommon.updateOne(
				{
					componentTypeId,
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
		} else {
			const data = await ctx.model.MarketComponentType.updateOne(
				{
					componentTypeId,
					isDelete: true,
					componentTypeOwner: this.user,
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
	}

	/**
	 * @summary 组件分类详情【需要用户登录】
	 * @router post /market/componentType/detail
	 * @request body market_componentType_detail_request
	 * @response 200 response
	 */
	async detail() {
		const { ctx } = this
		const { componentTypeId } = this.params
		const user = await ctx.service.user.findById(this.user)
		if (user.userAdmin) {
			const data = await ctx.model.MarketComponentTypeCommon.findOne(
				{
					componentTypeId,
					isDelete: false,
				},
				{
					__v: 0,
					_id: 0,
					deleteTime: 0,
					isDelete: 0,
				},
			)
			this.success({ data })
		} else {
			const data = await ctx.model.MarketComponentType.findOne(
				{
					componentTypeId,
					isDelete: false,
					componentTypeOwner: this.user,
				},
				{
					__v: 0,
					_id: 0,
					componentTypeOwner: 0,
					deleteTime: 0,
					isDelete: 0,
				},
			)
			this.success({ data })
		}
	}

	/**
	 * @summary 组件分类分页列表【需要用户登录】
	 * @router post /market/componentType/levelList
	 * @request body market_componentType_level_request
	 * @response 200 response
	 */
	async levelList() {
		const { ctx } = this
		const { componentTypeParentId } = this.params
		let data
		const user = await ctx.service.user.findById(this.user)
		if (user.userAdmin) {
			data = await ctx.model.MarketComponentTypeCommon.find(
				{
					isDelete: false,
					componentTypeParentId,
				},
				{
					__v: 0,
					_id: 0,
					deleteTime: 0,
					isDelete: 0,
				},
			).sort({ sort: 1, createTime: 1 })
		} else {
			if (componentTypeParentId) {
				data = []
			} else {
				data = await ctx.model.MarketComponentType.find(
					{
						isDelete: false,
						componentTypeOwner: this.user,
					},
					{
						__v: 0,
						_id: 0,
						deleteTime: 0,
						isDelete: 0,
					},
				).sort({ sort: 1, createTime: 1 })
			}
		}
		this.success({ data })
	}

	/**
	 * @summary 组件分类所有列表按层级获取【不需要用户登录】
	 * @router post /market/componentType/level
	 * @request body market_componentType_level_request
	 * @response 200 response
	 */
	async level() {
		const { ctx } = this
		const { componentTypeParentId } = this.params
		let data
		if (!componentTypeParentId) {
			data = await ctx.model.MarketComponentTypeCommon.find(
				{
					isDelete: false,
					componentTypeParentId: null,
				},
				{
					__v: 0,
					_id: 0,
					deleteTime: 0,
					isDelete: 0,
				},
			).sort({ sort: 1, createTime: 1 })
			data = [
				...data,
				{
					componentTypeId: 'my',
					componentTypeName: '我的',
					componentTypeEnName: 'my',
				},
				{
					componentTypeId: 'collection',
					componentTypeName: '收藏',
					componentTypeEnName: 'collection',
				},
			]
		} else if (componentTypeParentId === 'my') {
			data = await ctx.model.MarketComponentType.find(
				{
					isDelete: false,
					componentTypeOwner: this.user,
				},
				{
					__v: 0,
					_id: 0,
					deleteTime: 0,
					isDelete: 0,
				},
			).sort({ sort: 1, createTime: 1 })
		} else if (componentTypeParentId === 'collection') {
			data = await ctx.model.CollectionComponentType.find(
				{
					isDelete: false,
					componentTypeOwner: this.user,
				},
				{
					__v: 0,
					_id: 0,
					deleteTime: 0,
					isDelete: 0,
				},
			).sort({ sort: 1, createTime: 1 })
		} else {
			data = await ctx.model.MarketComponentTypeCommon.find(
				{
					isDelete: false,
					componentTypeParentId,
				},
				{
					__v: 0,
					_id: 0,
					deleteTime: 0,
					isDelete: 0,
				},
			).sort({ sort: 1, createTime: 1 })
		}
		this.success({ data })
	}
}
