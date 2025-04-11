import { AllObjectsFormatter } from './formatters/allObjectsFormatter.js';

class SheetFormatter {
	static generateSpreadsheet(type) {
		console.log('generateSpreadsheet');
		const formatter = this._getFormatter(type);
		return formatter.generateSpreadsheet();
	}
	
	static format(type, tableData) {
		console.log('format');
		const formatter = this._getFormatter(type);
		return formatter.format(tableData);
	}

	static _getFormatter(type) {
		switch (type) {
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