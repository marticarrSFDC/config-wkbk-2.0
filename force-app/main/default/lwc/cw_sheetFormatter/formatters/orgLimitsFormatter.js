import { BaseFormatter } from './baseFormatter.js';

const SHEET_CONFIG = {
	sheetId: 111,
	title: 'Org Limits',
	columnWidths: [350, 60, 125, 125],
	mergeRanges: [
		{ startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 }
	]
};

class OrgLimitsFormatter extends BaseFormatter {
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
					return this._buildHeaderCell(td)
				})
			}
		}
		else {
			row = {
				values: tr.map((td, index) => {
					if(index === 0) { // limit label
						return this._buildStringCell(td);
					} else if(index === 1) { // limit percent used
						return this._buildPercentCell(td);
					}
					return this._buildNumberCell(td);
				})
			}
		}
		return row;
	}
}

export {
	OrgLimitsFormatter
}