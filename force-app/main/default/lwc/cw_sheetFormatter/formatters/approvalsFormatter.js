import { BaseFormatter } from './baseFormatter.js';

const SHEET_CONFIG = {
	sheetId: 222,
	title: 'Approval Processes',
	columnWidths: [175, 250, 75, 450],
	mergeRanges: [
		{ startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 }
	]
};

class ApprovalsFormatter extends BaseFormatter {
	format(tableData) {
		let body = {
			requests: []
		};

		body.requests.push(this._buildAddSheetRequest(SHEET_CONFIG, tableData));
		body.requests.push(...this._buildMergeRequests(SHEET_CONFIG));
		body.requests.push(this._buildUpdatePropertiesRequest(SHEET_CONFIG, tableData));
		body.requests.push(this._buildTableDataRequest(tableData));
		body.requests.push(...this._buildColumnRequests(SHEET_CONFIG));
		return body;
	}

	_buildTableDataRequest(tableData) {
		let request = {
			updateCells: {
				rows: [],
				fields: '*',
				start: {
					sheetId: SHEET_CONFIG.sheetId,
					rowIndex: 0,
					columnIndex: 0
				}
			}	
		}

		tableData.forEach((tr, i) => {
			request.updateCells.rows.push(this._buildTableRow(tr, i));
		});
		return request;
	}

	_buildTableRow(tr, i) {
		let row;
		if(i <= 1) { // table header
			row = {
				values: tr.map((td) => {
					return this._buildHeaderCell(td);
				})
			}
		} else {
			row = {
				values: tr.map((td, index) => {
					if(index === 2) { // order
						return this._buildNumberCell(td);
					}
					return this._buildStringCell(td);
				})
			}
		}
		
		return row;
	}
}

export {
	ApprovalsFormatter
}