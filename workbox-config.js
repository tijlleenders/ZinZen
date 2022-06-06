module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{svg,md,json,ts,jpg,css,js,woff,woff2,jpeg,png,html,webmanifest,ico,scss,tsx,lock}'
	],
	swDest: '/dest/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};