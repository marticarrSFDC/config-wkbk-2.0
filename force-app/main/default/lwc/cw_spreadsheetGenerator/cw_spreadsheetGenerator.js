import { DataProcessor } from 'c/cw_dataProcessor';
import { SheetFormatter } from 'c/cw_sheetFormatter';

import createGoogleSpreadsheet from '@salesforce/apex/CW_GoogleSheetsService.createGoogleSpreadsheet';
import populateSheetCallout from '@salesforce/apex/CW_GoogleSheetsService.populateSheetCallout';

const ALL_OBJECTS = 'allobjects';
const ORG_LIMITS = 'limits';

class SpreadsheetGenerator {
	_spreadsheetId;

	createSpreadsheet(sheetNames) {
		const spreadsheet = SheetFormatter.generateSpreadsheet();
		createGoogleSpreadsheet({jsonString: JSON.stringify(spreadsheet)})
		.then(r => {
			let result = JSON.parse(r);
			this._spreadsheetId = result.spreadsheetId;
			console.log(result.spreadsheetUrl);

			sheetNames.forEach(name => {
				console.log('sheet name:', name);
				switch (name) {
					case ORG_LIMITS:
						this._populateOrgLimitsSheet();
						break;
					case ALL_OBJECTS:
						this._populateAllObjectSheet();
						break;
					default:
						console.warn('No handler for sheet name:', name);
				}
			});
		})
		.catch(error => {
			console.error('Error creating Google Sheet:', error);
		});
	}

	async _populateOrgLimitsSheet() {
		console.log('pop org limits sheet');
		const tableData = await DataProcessor.process(ORG_LIMITS);
		const sheet = SheetFormatter.format(ORG_LIMITS, tableData);
		populateSheetCallout({spreadsheetId: this._spreadsheetId, sheetName: encodeURIComponent('Org Limits'), jsonString: JSON.stringify(sheet)})
		.then(r => {
			let result = JSON.parse(r);
			console.log(result);
		})
		.catch(error => {
			console.error('Error populating Google Sheet: ', error);
		});
	}
	
	async _populateAllObjectSheet() {
		const tableData = await DataProcessor.process(ALL_OBJECTS);
		const sheet = SheetFormatter.format(ALL_OBJECTS, tableData);
		populateSheetCallout({spreadsheetId: this._spreadsheetId, sheetName: encodeURIComponent('All Objects'), jsonString: JSON.stringify(sheet)})
		.then(r => {
			let result = JSON.parse(r);
			console.log(JSON.stringify(result));
		})
		.catch(error => {
			console.error('Error populating Google Sheet: ', error);
		});
	}
}

export {
	SpreadsheetGenerator
}