const ALL_OBJECTS_ID = 111;
const COLUMN_WIDTHS = [250, 250, 150, 75, 75, 125, 125, 300, 125];

class AllObjectsFormatter {
	generateSpreadsheet() {
		console.log('generateSpreadsheet allobjects');
		return {
			properties: {
				title: 'CW 2.0',
			},
			sheets: [
				{
					properties: {
						title: 'All Objects',
						sheetId: ALL_OBJECTS_ID
					},
					merges: [
						{
							sheetId: ALL_OBJECTS_ID,
							startRowIndex: 0,
							endRowIndex: 1,
							startColumnIndex: 5,
							endColumnIndex: 7
						}
					],
				}
			],
		};
	}
	
	format(tableData) {
		let body = {
			requests: [
				this._buildTableDimensionsRequest(tableData),
				this._buildTableDataRequest(tableData)
			]
		};
		body.requests.push(...this._buildColumnRequests());
		return body;
	}

	_buildTableDimensionsRequest(tableData) {
		return {
			updateSheetProperties: {
				fields: 'gridProperties.rowCount,gridProperties.columnCount',
				properties: {
					sheetId: ALL_OBJECTS_ID, 
					gridProperties: {
						rowCount: tableData.length,
						columnCount: tableData[0].length,
					}
				}
			},
		};
	}

	_buildTableDataRequest(tableData) {
		let request = {
			updateCells: {
				rows: [],
				fields: '*',
				start: {
					sheetId: ALL_OBJECTS_ID,
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
		if(i < 2) { // table header
			row = {
				values: tr.map((td) => {
					return {
						userEnteredValue: { stringValue: td },
						userEnteredFormat: {
							textFormat: {
								bold: true
							},
							backgroundColor: { red: 0.953, green: 0.953, blue: 0.953 },
						}
					};
				})
			}
		}
		else {
			row = {
				values: tr.map((td) => {
					return {
						userEnteredValue: { stringValue: td }
					};
				})
			}
		}
		return row;
	}

	_buildColumnRequests() {
		return COLUMN_WIDTHS.map((width, index) => ({
			updateDimensionProperties: {
				range: {
					sheetId: ALL_OBJECTS_ID,
					dimension: "COLUMNS",
					startIndex: index,
					endIndex: index + 1
				},
				properties: {
					pixelSize: width
				},
				fields: "pixelSize"
			}
		}));
	}
}

export {
	AllObjectsFormatter
}