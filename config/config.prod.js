module.exports = () => {
	const config = {}

	config.mongoose = {
		url: 'mongodb://test1:test1@127.0.0.1/cakev',
		options: {
			useUnifiedTopology: true,
		},
	}

	return config
}
