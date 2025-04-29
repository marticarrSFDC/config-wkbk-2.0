import getOrgLimits from "@salesforce/apex/CW_ToolingApiService.getOrgLimits";

const HEADER_1 = ['Org Health', '', '', ''];
const HEADER_2 = ['Limit', '% Used', 'Remaining', 'Maximum'];

class LimitsProcessor {
	_populateOrgLimitsSheet() {
		return Promise.allSettled([getOrgLimits()])
			.then(results => {
				const [limits] = results;
				if (limits.status === 'fulfilled') {
					return JSON.parse(limits.value);
				}
				
				throw new Error('Error retrieving metadata: ' + limits.reason);
			});
	}

	async buildTable() {
		const metadata = await this._populateOrgLimitsSheet();
		console.log(JSON.stringify(metadata));
	
		let data = [HEADER_1, HEADER_2];
		for(const limit in metadata) {
			if (Object.hasOwn(metadata, limit)) {
				const name = limit;
				const percent = metadata[limit].Max ? (metadata[limit].Max - metadata[limit].Remaining)/metadata[limit].Max : 0;
				const remaining = metadata[limit].Remaining;
				const max = metadata[limit].Max;
	
				data.push([name, percent, remaining, max]);
			}
		}
		return data;
	}
}

export {
	LimitsProcessor
}