module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{svg,md,json,ts,jpg,js,css,woff,woff2,jpeg,png,html,webmanifest,ico,scss,tsx,lock}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};