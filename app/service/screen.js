const Service = require('egg').Service

module.exports = class extends Service {
	formatResult(data) {
		const result = JSON.parse(JSON.stringify(data))
		return result.map(item=>{
			delete item.screenFilter
			delete item.screenWidgets
			delete item.screenWidgetsLays
			delete item.screenScene
			delete item.isDelete
			delete item.__v
			delete item._id
			return item
		})
	}
}
