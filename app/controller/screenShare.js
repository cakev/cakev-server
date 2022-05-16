const Controller = require('../core/base_controller')
/**
 * @controller ScreenShareController 大屏编辑器配置
 */
module.exports = class extends Controller {
	/**
	 * @summary 创建或更新大屏编辑器配置【需要用户登录】
	 * @router post /screenShare/update
	 * @request body screenShare_update_request
	 * @response 200 response
	 */
	async update() {
		const { ctx } = this
		const {
			screenSharePassword,
			screenShareType,
			screenShareTime,
			screenGuide = [],
			screenId,
		} = this.params
		const self = await ctx.model.Screen.findOne({
			screenId,
			isDelete: false,
			screenOwner: this.user,
		})
		if (self) {
			const same = await ctx.model.ScreenShare.findOne({
				screenId,
				isDelete: false,
			})
			if (same) {
				await ctx.model.ScreenShare.updateOne(
					{
						screenId,
					},
					{
						screenSharePassword: this.encrypt(screenSharePassword),
						screenShareType,
						screenShareTime,
						screenGuide,
						updateTime: Date.now(),
					},
				)
			} else {
				await ctx.model.ScreenShare.create({
					screenId,
					screenSharePassword: this.encrypt(screenSharePassword),
					screenShareType,
					screenGuide,
					screenShareTime,
				})
			}
			this.success({
				data: {
					screenId,
					screenSharePassword,
					screenShareType,
					screenGuide,
					screenShareTime,
				},
				msg: '更新成功',
			})
		} else {
			this.error({ msg: '更新失败' })
		}
	}

	/**
	 * @summary 大屏编辑器配置详情【需要用户登录】
	 * @router post /screenShare/detail
	 * @request body screenShare_detail_request
	 * @response 200 response
	 */
	async detail() {
		const { ctx } = this
		const { screenId } = this.params
		const data = await ctx.model.ScreenShare.findOne(
			{
				screenId,
				isDelete: false,
			},
			{
				__v: 0,
				_id: 0,
				deleteTime: 0,
				isDelete: 0,
			},
		)
		if (data) {
			this.success({
				data: {
					screenId,
					screenGuide: data.screenGuide,
					screenSharePassword: this.decrypt(data.screenSharePassword),
					screenShareType: data.screenShareType,
					screenShareTime: data.screenShareTime,
				},
			})
		} else {
			this.success({
				data: {
					screenId,
					screenGuide: [],
					screenSharePassword: '',
					screenShareType: 'NO',
					screenShareTime: '',
				},
			})
		}
	}

	/**
	 * @summary 大屏分享链接进入时自动获取配置详情【不需要用户登录】
	 * @router post /screenShare/use
	 * @request body screenShare_detail_request
	 * @response 200 response
	 */
	async use() {
		const { ctx } = this
		const { screenId } = this.params
		const screenShare = await ctx.model.ScreenShare.findOne(
			{
				screenId,
				isDelete: false,
			},
			{
				__v: 0,
				_id: 0,
				deleteTime: 0,
				isDelete: 0,
			},
		)
		if (screenShare) {
			if (screenShare.screenShareType === 'ALL') {
				const data = await ctx.model.Screen.findOne({
					screenId: screenShare.screenId,
					isDelete: false,
				})
				this.success({
					data: {
						screenId,
						screenType: data.screenType,
						screenVersion: data.screenVersion,
						screenLayoutMode: data.screenLayoutMode,
						screenMainScene: data.screenMainScene,
						screenWidth: data.screenWidth,
						screenHeight: data.screenHeight,
						screenBackGroundColor: data.screenBackGroundColor,
						screenBackGroundImage: data.screenBackGroundImage,
						screenPlatform: data.screenPlatform,
						screenScene: data.screenScene,
						screenWidgets: data.screenWidgets,
						screenName: data.screenName,
						screenGuide: [],
						screenShareType: screenShare.screenShareType,
						screenShareTime: screenShare.screenShareTime,
					},
				})
			} else if (screenShare.screenShareType === 'TIME') {
				if (+new Date() < +new Date(screenShare.screenShareTime)) {
					const data = await ctx.model.Screen.findOne({
						screenId: screenShare.screenId,
						isDelete: false,
					})
					this.success({
						data: {
							screenId,
							screenType: data.screenType,
							screenVersion: data.screenVersion,
							screenLayoutMode: data.screenLayoutMode,
							screenMainScene: data.screenMainScene,
							screenWidth: data.screenWidth,
							screenHeight: data.screenHeight,
							screenBackGroundColor: data.screenBackGroundColor,
							screenBackGroundImage: data.screenBackGroundImage,
							screenPlatform: data.screenPlatform,
							screenScene: data.screenScene,
							screenWidgets: data.screenWidgets,
							screenName: data.screenName,
							screenGuide: [],
							screenShareType: screenShare.screenShareType,
							screenShareTime: screenShare.screenShareTime,
						},
					})
				} else {
					this.success({
						data: {
							screenGuide: [],
							screenShareType: screenShare.screenShareType,
							screenShareTime: screenShare.screenShareTime,
						},
						msg: '分享时效已过，请联系你的分享者',
					})
				}
			} else {
				this.success({
					data: {
						screenGuide: [],
						screenShareType: screenShare.screenShareType,
						screenShareTime: screenShare.screenShareTime,
					},
				})
			}
		} else {
			this.error()
		}
	}

	/**
	 * @summary 大屏分享密码登录【不需要用户登录】
	 * @router post /screenShare/login
	 * @request body screenShare_login_request
	 * @response 200 response
	 */
	async login() {
		const { ctx } = this
		const { screenId, screenSharePassword } = this.params
		const screenShare = await ctx.model.ScreenShare.findOne({
			screenId,
			isDelete: false,
			screenSharePassword: this.encrypt(screenSharePassword),
		})
		if (screenShare) {
			const data = await ctx.model.Screen.findOne({
				screenId: screenShare.screenId,
				isDelete: false,
			})
			this.success({
				data: {
					screenGuide: [],
					screenId,
					screenName: data.screenName,
					screenType: data.screenType,
					screenVersion: data.screenVersion,
					screenLayoutMode: data.screenLayoutMode,
					screenMainScene: data.screenMainScene,
					screenWidth: data.screenWidth,
					screenHeight: data.screenHeight,
					screenBackGroundColor: data.screenBackGroundColor,
					screenBackGroundImage: data.screenBackGroundImage,
					screenPlatform: data.screenPlatform,
					screenScene: data.screenScene,
					screenWidgets: data.screenWidgets,
					screenShareType: screenShare.screenShareType,
					screenShareTime: screenShare.screenShareTime,
				},
			})
		} else {
			this.error({ msg: '密码错误或查询不到此大屏' })
		}
	}
}
