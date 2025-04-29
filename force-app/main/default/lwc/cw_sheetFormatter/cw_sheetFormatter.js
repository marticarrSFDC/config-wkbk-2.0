import { OrgLimitsFormatter } from './formatters/orgLimitsFormatter.js';
import { AllObjectsFormatter } from './formatters/allObjectsFormatter.js';

class SheetFormatter {
	static generateSpreadsheet() {
		return {
			properties: {
				title: 'CW 2.0',
			}
		};
	}
	
	static format(type, tableData) {
		const formatter = this._getFormatter(type);
		return formatter.format(tableData);
	}

	static _getFormatter(type) {
		switch (type) {
			case 'limits':
				return new OrgLimitsFormatter();
			case 'allobjects':
				return new AllObjectsFormatter();
			default:
				throw new Error(`No formatter found for type: ${type}`);
		}
	}
}

export {
	SheetFormatter
}