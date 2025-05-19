import { BaseProcessor } from "./baseProcessor";
import getOrgLimits from "@salesforce/apex/CW_ToolingApiService.getOrgLimits";

const HEADER_1 = ['Org Health', '', '', ''];
const HEADER_2 = ['Limit', '% Used', 'Remaining', 'Maximum'];

class LimitsProcessor extends BaseProcessor {
	_populateOrgLimitsSheet() {
		return this._populateSheet([getOrgLimits()]);
	}

	async buildTable() {
		const [limits] = await this._populateOrgLimitsSheet();
	
		let data = [HEADER_1, HEADER_2];
		for(const limit in limits) {
			if (Object.hasOwn(limits, limit)) {
				const name = limit;
				const percent = limits[limit].Max ? (limits[limit].Max - limits[limit].Remaining)/limits[limit].Max : 0;
				const remaining = limits[limit].Remaining;
				const max = limits[limit].Max;
	
				data.push([name, percent, remaining, max]);
			}
		}
		return data;
	}
}

export {
	LimitsProcessor
}