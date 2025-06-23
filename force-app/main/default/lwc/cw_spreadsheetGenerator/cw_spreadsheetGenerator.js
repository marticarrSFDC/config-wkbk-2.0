import { DataProcessor } from 'c/cw_dataProcessor';
import { SheetFormatter } from 'c/cw_sheetFormatter';

import createGoogleSpreadsheet from '@salesforce/apex/CW_GoogleSheetsService.createGoogleSpreadsheet';
import populateSheetCallout from '@salesforce/apex/CW_GoogleSheetsService.populateSheetCallout';

const ORG_LIMITS = 'limits';
const APPROVAL_PROCESSES = 'approvals';
const ALL_OBJECTS = 'allobjects';


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
				switch (name) {
					case ORG_LIMITS:
						this._populateOrgLimitsSheet();
						break;
					case APPROVAL_PROCESSES:
						this._populateApprovalProcessesSheet();
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
		const tableData = await DataProcessor.process(ORG_LIMITS);
		const sheet = SheetFormatter.format(ORG_LIMITS, tableData);
		await this._populateSheetCallout('Org Limits', sheet);
	}

	async _populateApprovalProcessesSheet() {
		const tableData = await DataProcessor.process(APPROVAL_PROCESSES);
		const sheet = SheetFormatter.format(APPROVAL_PROCESSES, tableData);
		await this._populateSheetCallout('Approval Processes', sheet);
	}
	
	async _populateAllObjectSheet() {
		const tableData = await DataProcessor.process(ALL_OBJECTS);
		const sheet = SheetFormatter.format(ALL_OBJECTS, tableData);
		await this._populateSheetCallout('All Objects', sheet);
	}

	async _populateSheetCallout(sheetName, sheet) {
		populateSheetCallout({spreadsheetId: this._spreadsheetId, sheetName: encodeURIComponent(sheetName), jsonString: JSON.stringify(sheet)})
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