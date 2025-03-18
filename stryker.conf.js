module.exports = {
	mutate: ['force-app/main/default/lwc/**/*.js',
	'!force-app/main/default/lwc/**/__tests__/*.*',
	'!force-app/main/default/lwc/**/__tests__/**/*.*',
	], // Adjust this path to match your source files
	testRunner: 'mocha',
	testRunnerNodeArgs: ["--loader", "esm"],
	mochaOptions: {
	  	spec: ['force-app/main/default/lwc/**/__tests__/*.*',
	'force-app/main/default/lwc/**/__tests__/**/*.*'], // Adjust this path to match your test files
		timeout: 10000, // Prevents tests from timing out
		require: ["esm"]
	},
	reporters: ['clear-text', 'progress', 'html'],
	coverageAnalysis: 'perTest', // Set to "perTest" if you want Stryker to optimize mutations
	thresholds: {
		high: 100, // Desired mutation score
		low: 90,  // Acceptable threshold
		break: 80 // Fail if below this score
	}
  };  