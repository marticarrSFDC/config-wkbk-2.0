import { DataProcessor } from 'c/cw_dataProcessor';
import { SheetFormatter } from 'c/cw_sheetFormatter';

import createGoogleSpreadsheet from '@salesforce/apex/CW_GoogleSheetsService.createGoogleSpreadsheet';
import populateSheetCallout from '@salesforce/apex/CW_GoogleSheetsService.populateSheetCallout';

const ALL_OBJECTS = 'allobjects';

class SpreadsheetGenerator {
	_spreadsheetId;

	createSpreadsheet(sheetNames) {
		console.log('createSpreadsheet');
		const spreadsheet = SheetFormatter.generateSpreadsheet(ALL_OBJECTS);
		createGoogleSpreadsheet({jsonString: JSON.stringify(spreadsheet)})
		.then(r => {
			let result = JSON.parse(r);
			console.log(r);
			this._spreadsheetId = result.spreadsheetId;
			console.log(result.spreadsheetUrl);

			sheetNames.forEach(name => {
				switch (name) {
					case ALL_OBJECTS:
						this._populateAllObjectSheet();
						break;
					default:
						console.warn('No handler for sheet name:', name);
				}
			});
		})
		.catch(error => {
			console.error('Error creating Google Sheet:', JSON.stringify(error));
		});
	}

	async _populateAllObjectSheet() {
		const tableData = await DataProcessor.process(ALL_OBJECTS);
		const sheet = SheetFormatter.format(ALL_OBJECTS, tableData);
		populateSheetCallout({spreadsheetId: this._spreadsheetId, sheetName: encodeURIComponent('All Objects'), jsonString: JSON.stringify(sheet)})
		.then(r => {
			let result = JSON.parse(r);
			console.log(result);
		})
		.catch(error => {
			console.error(error.body.message);
		});
	}
}

export {
	SpreadsheetGenerator
}