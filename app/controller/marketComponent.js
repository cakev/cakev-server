const Controller = require('../core/base_controller')
const { v4 } = require('uuid')

/**
 * @controller MarketComponentController 组件市场-组件
 */
module.exports = class extends Controller {
	/**
	 * @summary 创建组件【不需要用户登录】
	 * @router post /market/component/create
	 * @request body market_component_create_request
	 * @response 200 response
	 */
	async create() {
		const { ctx } = this
		const {
			componentTitle,
			componentEnTitle,
			componentVersion,
			componentJsUrl,
			componentZipUrl,
			componentConfig,
			appKey,
		} = this.params
		const user = await ctx.service.user.findByAppKey(appKey)
		if (user) {
			const componentId = v4()
			const same = await ctx.model.MarketComponent.findOne({
				componentEnTitle,
				componentVersion,
				$or: [{ status: 'PENDING' }, { status: 'SUCCESS' }],
				isDelete: false,
			})
			if (same) {
				this.error({
					msg: `当前${componentVersion}${componentEnTitle}组件已存在`,
				})
			} else {
				const data = await ctx.model.MarketComponent.create({
					componentId,
					componentTitle,
					componentEnTitle,
					componentVersion,
					componentJsUrl,
					componentZipUrl,
					componentConfig,
					componentOwner: user.userId,
				})
				this.success({ data })
			}
		} else {
			this.error({
				msg: 'appKey/appSecret 不正确或已停用',
			})
		}
	}

	/**
	 * @summary 更新组件【需要用户登录】
	 * @router post /market/component/update
	 * @request body market_component_update_request
	 * @response 200 response
	 */
	async update() {
		const { ctx } = this
		const { componentId, componentVersion, componentEnTitle } = this.params
		let data
		if (componentVersion) {
			const old = await ctx.model.MarketComponent.findOneAndUpdate(
				{
					componentEnTitle,
					isDelete: false,
					isCurrentVersion: true,
					componentOwner: this.user,
				},
				{
					isCurrentVersion: false,
					updateTime: Date.now(),
				},
			)
			data = await ctx.model.MarketComponent.updateOne(
				{
					componentEnTitle,
					componentVersion,
					isDelete: false,
					componentOwner: this.user,
				},
				{
					componentTypeId: old.componentTypeId,
					isCurrentVersion: true,
					updateTime: Date.now(),
				},
			)
		} else {
			data = await ctx.model.MarketComponent.updateOne(
				{
					componentId,
					isDelete: false,
					componentOwner: this.user,
				},
				{ ...this.params, updateTime: Date.now() },
			)
		}
		if (data.ok) {
			this.success({ msg: '更新成功' })
		} else {
			this.error({ msg: '更新失败' })
		}
	}

	/**
	 * @summary 审核成功组件【需要用户登录】
	 * @router post /market/component/checkSuccess
	 * @request body market_component_checkSuccess_request
	 * @response 200 response
	 */
	async checkSuccess() {
		const { ctx } = this
		const {
			componentId,
			componentAvatar,
			componentTypeId,
			componentEnTitle,
		} = this.params

		const count = await ctx.model.MarketComponent.count({
			componentEnTitle,
			isDelete: false,
			isCurrentVersion: true,
			componentOwner: this.user,
		})
		let data
		if (count) {
			// 更新组件 version
			data = await ctx.model.MarketComponent.updateOne(
				{
					componentId,
					isDelete: false,
					componentOwner: this.user,
				},
				{
					componentAvatar,
					componentTypeId,
					status: 'SUCCESS',
					updateTime: Date.now(),
				},
			)
		} else {
			// 第一次组件创建审核 version
			data = await ctx.model.MarketComponent.updateOne(
				{
					componentId,
					isDelete: false,
					componentOwner: this.user,
				},
				{
					componentAvatar,
					isCurrentVersion: true,
					componentTypeId,
					status: 'SUCCESS',
					updateTime: Date.now(),
				},
			)
		}

		if (data.ok) {
			this.success({ msg: '审核成功' })
		} else {
			this.error({ msg: '审核过程失败' })
		}
	}

	/**
	 * @summary 审核失败组件【需要用户登录】
	 * @router post /market/component/checkError
	 * @request body market_component_detail_request
	 * @response 200 response
	 */
	async checkError() {
		const { ctx } = this
		const { componentId } = this.params
		const data = await ctx.model.MarketComponent.updateOne(
			{
				componentId,
				status: 'PENDING',
				isDelete: false,
				componentOwner: this.user,
			},
			{
				status: 'ERROR',
				updateTime: Date.now(),
			},
		)
		if (data.ok) {
			this.success({ msg: '审核失败' })
		} else {
			this.error({ msg: '审核过程失败' })
		}
	}

	/**
	 * @summary 删除组件【需要用户登录】
	 * @router post /market/component/destroy
	 * @request body market_component_detail_request
	 * @response 200 response
	 */
	async destroy() {
		const { ctx } = this
		const { componentId, componentEnTitle } = this.params
		const data = await ctx.model.MarketComponent.updateOne(
			{
				componentId,
				isDelete: false,
				componentOwner: this.user,
			},
			{
				isDelete: true,
				isCurrentVersion: false,
				updateTime: Date.now(),
			},
		)
		if (componentEnTitle) {
			await ctx.model.MarketComponent.updateMany(
				{
					componentEnTitle,
					isDelete: false,
					componentOwner: this.user,
				},
				{
					isDelete: true,
					isCurrentVersion: false,
					updateTime: Date.now(),
				},
			)
		}
		if (data.ok) {
			this.success({ msg: '删除成功' })
		} else {
			this.error({ msg: '删除失败' })
		}
	}

	/**
	 * @summary 恢复组件【需要用户登录】
	 * @router post /market/component/restore
	 * @request body market_component_detail_request
	 * @response 200 response
	 */
	async restore() {
		const { ctx } = this
		const { componentId } = this.params
		const data = await ctx.model.MarketComponent.updateOne(
			{
				componentId,
				isDelete: true,
				componentOwner: this.user,
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
	 * @summary 组件详情【不需要用户登录】
	 * @router post /market/component/detail
	 * @request body market_component_detail_request
	 * @response 200 response
	 */
	async detail() {
		const { ctx } = this
		const { componentId } = this.params
		const data = await ctx.model.MarketComponent.findOne(
			{
				componentId,
				isDelete: false,
			},
			{
				__v: 0,
				_id: 0,
				componentOwner: 0,
				isDelete: 0,
			},
		)
		this.success({ data })
	}

	/**
	 * @summary 组件详情【不需要用户登录】
	 * @router post /market/component/use
	 * @request body market_component_use_request
	 * @response 200 response
	 */
	async use() {
		const { ctx } = this
		const { componentEnTitle, componentVersion } = this.params
		const data = await ctx.model.MarketComponent.findOne(
			{
				componentEnTitle,
				componentVersion,
				isDelete: false,
				$or: [{ status: 'PENDING' }, { status: 'SUCCESS' }],
			},
			{
				__v: 0,
				_id: 0,
				componentOwner: 0,
				isDelete: 0,
			},
		)
		this.success({ data })
	}

	/**
	 * @summary 组件详情【不需要用户登录】
	 * @router post /market/component/useList
	 * @request body market_component_useList_request
	 * @response 200 response
	 */
	async useList() {
		const { ctx } = this
		const { list } = this.params
		let p = []
		list.forEach(item => {
			p.push(
				new Promise(resolve => {
					ctx.model.MarketComponent.findOne(
						{
							componentEnTitle: item.componentEnTitle,
							componentVersion: item.componentVersion,
							isDelete: false,
							$or: [{ status: 'PENDING' }, { status: 'SUCCESS' }],
						},
						{
							__v: 0,
							_id: 0,
							componentOwner: 0,
							componentAvatar: 0,
							componentType: 0,
							componentTypeId: 0,
							createTime: 0,
							updateTime: 0,
							sort: 0,
							status: 0,
							isCurrentVersion: 0,
							isDelete: 0,
						},
					).then(data => {
						resolve(data)
					})
				}),
			)
		})
		const data = await Promise.all(p)
		this.success({ data })
	}

	/**
	 * @summary 组件所有已审核成功版本【不需要用户登录】
	 * @router post /market/component/version
	 * @request body market_component_version_request
	 * @response 200 response
	 */
	async version() {
		const { ctx } = this
		const { componentEnTitle } = this.params
		const data = await ctx.model.MarketComponent.find(
			{
				isDelete: false,
				componentEnTitle,
				status: 'SUCCESS',
			},
			{
				__v: 0,
				_id: 0,
				isDelete: 0,
				componentConfig: 0,
				componentAvatar: 0,
				componentJsUrl: 0,
				componentZipUrl: 0,
				componentOwner: 0,
				createTime: 0,
				updateTime: 0,
				componentTypeId: 0,
				sort: 0,
				status: 0,
				isCurrentVersion: 0,
			},
		).sort({ sort: 1, createTime: 1 })
		this.success({ data })
	}

	/**
	 * @summary 组件分页列表【需要用户登录】
	 * @router post /market/component/list
	 * @request body market_component_list_request
	 * @response 200 response
	 */
	async list() {
		const { ctx } = this
		const { pageSize = 10, pageNum = 1 } = this.params
		let search = Object.assign({}, this.params)
		let or = []
		let orderType = -1
		let orderKey = 'createTime'
		delete search.pageSize
		delete search.pageNum
		if (search.componentTitle) {
			const reg = new RegExp(search.componentTitle, 'i')
			or = [{ componentTitle: { $regex: reg } }]
			delete search.componentTitle
		}
		if (search.orderType === 'asc') orderType = 1
		if (search.orderKey) orderKey = search.orderKey
		delete search.orderType
		delete search.orderKey
		if (or.length > 0) {
			search.$and = [
				{
					$or: or,
				},
			]
		}

		const result = await ctx.model.MarketComponent.find(
			{
				isDelete: false,
				...search,
				componentOwner: this.user,
			},
			{
				__v: 0,
				_id: 0,
				isCurrentVersion: 0,
				componentConfig: 0,
				sort: 0,
				status: 0,
				isDelete: 0,
				componentOwner: 0,
			},
		)
			.sort({ [orderKey]: orderType })
			.skip((pageNum - 1) * pageSize)
			.limit(Number(pageSize))
		let data = JSON.parse(JSON.stringify(result))
		let p = []
		data.map(item => {
			if (item.componentTypeId) {
				p.push(
					new Promise(resolve => {
						ctx.model.MarketComponentType.findOne({
							isDelete: false,
							componentTypeId: item.componentTypeId,
						}).then(res => {
							item.componentTypeName = res
								? res.componentTypeName
								: ''
							if (!item.componentTypeName) {
								ctx.model.MarketComponentTypeCommon.findOne({
									isDelete: false,
									componentTypeId: item.componentTypeId,
								}).then(res => {
									item.componentTypeName = res
										? res.componentTypeName
										: ''
									resolve(1)
								})
							} else {
								resolve(1)
							}
						})
					}),
				)
			}
		})
		const count = await ctx.model.MarketComponent.count({
			isDelete: false,
			...search,
			componentOwner: this.user,
		})
		await Promise.all(p)
		this.success({ data: { list: data, count } })
	}

	/**
	 * @summary 组件待审核分页列表【需要用户登录】
	 * @router post /market/component/checkList
	 * @request body market_component_list_request
	 * @response 200 response
	 */
	async checkList() {
		const { ctx } = this
		const { pageSize = 10, pageNum = 1 } = this.params
		const data = await ctx.model.MarketComponent.find(
			{
				isDelete: false,
				status: 'PENDING',
				componentOwner: this.user,
			},
			{
				__v: 0,
				_id: 0,
				isCurrentVersion: 0,
				sort: 0,
				status: 0,
				isDelete: 0,
				componentOwner: 0,
			},
		)
			.sort({ createTime: -1 })
			.skip((pageNum - 1) * pageSize)
			.limit(Number(pageSize))
		const count = await ctx.model.MarketComponent.count({
			isDelete: false,
			status: 'PENDING',
			componentOwner: this.user,
		})
		this.success({ data: { list: data, count } })
	}

	/**
	 * @summary 组件分页已删除列表【需要用户登录】
	 * @router post /market/component/recycleList
	 * @request body market_component_list_request
	 * @response 200 response
	 */
	async recycleList() {
		const { ctx } = this
		const { pageSize = 10, pageNum = 1 } = this.params
		let search = Object.assign({}, this.params)
		let or = []
		delete search.pageSize
		delete search.pageNum
		if (search.componentTitle) {
			const reg = new RegExp(search.componentTitle, 'i')
			or = [{ componentTitle: { $regex: reg } }]
			delete search.componentTitle
		}
		if (or.length > 0) {
			search.$and = [
				{
					$or: or,
				},
			]
		}

		const data = await ctx.model.MarketComponent.find(
			{
				isDelete: true,
				...search,
				componentOwner: this.user,
			},
			{
				__v: 0,
				_id: 0,
				isCurrentVersion: 0,
				componentAvatar: 0,
				componentJsUrl: 0,
				componentZipUrl: 0,
				componentConfig: 0,
				createTime: 0,
				componentType: 0,
				updateTime: 0,
				sort: 0,
				status: 0,
				isDelete: 0,
				componentOwner: 0,
			},
		)
			.skip((pageNum - 1) * pageSize)
			.limit(Number(pageSize))
		const count = await ctx.model.MarketComponent.count({
			isDelete: true,
			...search,
			componentOwner: this.user,
		})
		this.success({ data: { list: data, count } })
	}

	/**
	 * @summary 组件审核历史分页【需要用户登录】
	 * @router post /market/component/checkHistoryList
	 * @request body market_component_list_request
	 * @response 200 response
	 */
	async checkHistoryList() {
		const { ctx } = this
		const { pageSize = 10, pageNum = 1 } = this.params
		let search = Object.assign({}, this.params)
		let or = [{ status: 'SUCCESS' }, { status: 'ERROR' }]
		delete search.pageSize
		delete search.pageNum
		if (search.componentTitle) {
			const reg = new RegExp(search.componentTitle, 'i')
			or = [{ componentTitle: { $regex: reg } }]
			delete search.componentTitle
		}
		if (or.length > 0) {
			search.$and = [
				{
					$or: or,
				},
			]
		}

		const data = await ctx.model.MarketComponent.find(
			{
				isDelete: false,
				...search,
				componentOwner: this.user,
			},
			{
				__v: 0,
				_id: 0,
				isCurrentVersion: 0,
				componentAvatar: 0,
				componentJsUrl: 0,
				componentZipUrl: 0,
				componentConfig: 0,
				createTime: 0,
				componentType: 0,
				sort: 0,
				isDelete: 0,
				componentOwner: 0,
			},
		)
			.sort({ updateTime: -1 })
			.skip((pageNum - 1) * pageSize)
			.limit(Number(pageSize))
		const count = await ctx.model.MarketComponent.count({
			isDelete: true,
			...search,
			componentOwner: this.user,
		})
		this.success({ data: { list: data, count } })
	}

	/**
	 * @summary 组件按类型分页列表【不需要用户登录】
	 * @router post /market/component/typeList
	 * @request body market_component_list_request
	 * @response 200 response
	 */
	async typeList() {
		const { ctx } = this
		const { pageSize = 10, pageNum = 1 } = this.params
		let search = Object.assign({}, this.params)
		delete search.pageSize
		delete search.pageNum
		const result = await ctx.model.MarketComponent.find(
			{
				isDelete: false,
				...search,
			},
			{
				__v: 0,
				_id: 0,
				isDelete: 0,
				sort: 0,
				status: 0,
				isCurrentVersion: 0,
				componentZipUrl: 0,
				componentJsUrl: 0,
				componentOwner: 0,
				createTime: 0,
				updateTime: 0,
			},
		)
			.sort({ componentEnTitle: 1 })
			.skip((pageNum - 1) * pageSize)
			.limit(Number(pageSize))
		let data = JSON.parse(JSON.stringify(result))
		data.map(item => {
			ctx.model.MarketComponentType.findOne({
				isDelete: false,
				componentTypeId: item.componentTypeId,
			}).then(res => {
				item.componentTypeName = res.componentTypeName
			})
		})
		const count = await ctx.model.MarketComponent.count({
			isDelete: false,
			...search,
		})
		this.success({ data: { list: data, count } })
	}

	/**
	 * @summary 组件待更新列表【需要用户登录】
	 * @router post /market/component/versionUpdateList
	 * @request body market_component_versionUpdateList_request
	 * @response 200 response
	 */
	async versionUpdateList() {
		const { ctx } = this
		const { components } = this.params
		let p = []
		components.forEach(item => {
			p.push(
				new Promise(resolve => {
					ctx.model.MarketComponent.findOne({
						componentEnTitle: item.componentEnTitle,
						isCurrentVersion: true,
						status: 'SUCCESS',
						isDelete: false,
					}).then(res => {
						if (res) {
							const version = this.versionToNum(
								res.componentVersion,
							)
							const version2 = this.versionToNum(
								item.componentVersion,
							)
							if (version > version2) {
								resolve({
									componentVersion: res.componentVersion,
									componentId: item.componentId,
									componentTitle: item.componentTitle,
								})
							} else {
								resolve(null)
							}
						} else {
							resolve(null)
						}
					})
				}),
			)
		})
		const result = await Promise.all(p)
		let data = []
		result.forEach(item => {
			if (item) {
				data.push(item)
			}
		})
		this.success({ data })
	}
}
