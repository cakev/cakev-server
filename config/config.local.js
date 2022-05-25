module.exports = () => {
	const config = {}
	const mongodbUrl = JSON.parse(process.argv[2]).mongodbUrl
	config.mongoose = {
		url: mongodbUrl ? mongodbUrl : `mongodb://cakev:cakev@127.0.0.1:12770/cakev`,
		options: {
			useUnifiedTopology: true,
		},
	}

	return config
}
