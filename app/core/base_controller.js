const { Controller } = require('egg')
const crypto = require('crypto')
const encryptCode = 'cakev'

module.exports = class extends Controller {
	/**
	 * @description 1.0.0 --->100000
	 * 每一位限两位数
	 */
	versionToNum(version) {
		let num = version.split('.')
		num = num.map(item => {
			if (Number(item) >= 99) item = '99'
			if (Number(item) < 10) {
				item = '0' + item
			}
			return item
		})
		return Number(num.join(''))
	}

	/**
	 * @description 平台用户 设置 时效为30天
	 */
	set user(value) {
		this.ctx.cookies.set(encryptCode, value, {
			encrypt: true,
			maxAge: 1000 * 60 * 60 * 24 * 30,
		})
	}

	/**
	 * @description 平台用户 获取
	 */
	get user() {
		return this.ctx.cookies.get(encryptCode, {
			encrypt: true,
		})
	}

	/**
	 * @description 参数汇总及过滤
	 */
	get params() {
		const params = Object.assign({}, this.ctx.query, this.ctx.request.body)
		const result = {}
		for (const key in params) {
			if (typeof params[key] === 'string') {
				result[key] = params[key]
			} else if (params[key]) {
				result[key] = params[key]
			}
		}
		return result
	}

	/**
	 * @description 正常返回
	 */
	get success() {
		return (options = {}) => {
			const { msg = '请求成功', data = '', obj, code = 200 } = options
			let result = {
				code,
				data,
				msg,
				success: true,
			}
			if (typeof obj === 'object') {
				result = Object.assign(result, obj)
			}
			this.ctx.body = result
		}
	}

	/**
	 * @description 错误返回
	 */
	get error() {
		return (err, options = {}) => {
			const { msg = '请求失败', data = '', obj, code = 500 } = options
			let result = {
				code,
				data,
				msg,
				success: false,
			}
			if (typeof obj === 'object') {
				result = Object.assign(result, obj)
			}
			this.ctx.body = result
		}
	}

	get encrypt() {
		return str => {
			if (str) {
				const cipher = crypto.createCipher('aes192', encryptCode)
				let enc = cipher.update(str, 'utf8', 'hex')
				enc += cipher.final('hex')
				return enc
			}
			return ''
		}
	}

	get decrypt() {
		return str => {
			if (str) {
				const decipher = crypto.createDecipher('aes192', encryptCode)
				let dec = decipher.update(str, 'hex', 'utf8')
				dec += decipher.final('utf8')
				return dec
			}
			return ''
		}
	}
}
