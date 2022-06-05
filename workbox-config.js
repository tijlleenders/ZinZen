module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,ico,svg,md,json,js,html,txt,ts,scss,tsx,jpg,jpeg,lock}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};