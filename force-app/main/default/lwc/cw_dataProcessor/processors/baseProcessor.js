class BaseProcessor {
	static _populateSheet(callouts) {
		return Promise.allSettled(callouts)
			.then(results => {
				let data = [];
				results.forEach(result => {
					if (result.status === 'fulfilled') {
						data.push(JSON.parse(result.value));
					} else {
						throw new Error(`Error retrieving metadata: ${result.reason}`);
					}
				});	
				return data;			
			});
	}
}

export {
	BaseProcessor
}