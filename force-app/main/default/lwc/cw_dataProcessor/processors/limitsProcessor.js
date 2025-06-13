import { BaseProcessor } from "./baseProcessor";
import getOrgLimits from "@salesforce/apex/CW_ToolingApiService.getOrgLimits";

class LimitsProcessor extends BaseProcessor {
	get HEADER_1() {
		return ['Org Health', '', '', ''];
	}

	get HEADER_2() {
		return ['Limit', '% Used', 'Remaining', 'Maximum'];
	}

	_populateOrgLimitsSheet() {
		return this._populateSheet([getOrgLimits()]);
	}

	async buildTable() {
		const [limits] = await this._populateOrgLimitsSheet();
	
		let data = [this.HEADER_1, this.HEADER_2];
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