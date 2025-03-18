module.exports = {
	mutate: ['src/**/*.js'], // Adjust this path to match your source files
	testRunner: 'mocha',
	mochaOptions: {
	  spec: ['test/**/*.spec.js'], // Adjust this path to match your test files
	},
	reporters: ['clear-text', 'progress', 'html'],
	coverageAnalysis: 'off', // Set to "perTest" if you want Stryker to optimize mutations
	thresholds: {
		high: 100, // Desired mutation score
		low: 90,  // Acceptable threshold
		break: 80 // Fail if below this score
	}
  };  