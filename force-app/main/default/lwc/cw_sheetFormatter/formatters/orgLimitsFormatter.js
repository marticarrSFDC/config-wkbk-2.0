const ORG_LIMITS_ID = 111;
const COLUMN_WIDTHS = [350, 60, 125, 125];

class OrgLimitsFormatter {
	format(tableData) {
		let body = {
			requests: [
				this._buildAddSheetRequest(tableData),
				this._buildMergeRequest(),
				this._buildUpdatePropertiesRequest(tableData),
				this._buildTableDataRequest(tableData)
			]
		};
		body.requests.push(...this._buildColumnRequests());
		return body;
	}

	_buildAddSheetRequest(tableData) {
		return {
			addSheet: {
				properties: {
					sheetId: ORG_LIMITS_ID,
					title: 'Org Limits',
					gridProperties: {
						rowCount: tableData.length,
						columnCount: tableData[0].length + 1, // add 1 for merge request
					}
				}
			},
		};
	}

	_buildMergeRequest() {
		return {
			mergeCells: {
				range: {
					sheetId: ORG_LIMITS_ID,
					startRowIndex: 0,
					endRowIndex: 1,
					startColumnIndex: 0,
					endColumnIndex: 4
				},
				mergeType: "MERGE_ALL"
			}
		}
	}

	_buildUpdatePropertiesRequest(tableData) {
		return {
			updateSheetProperties: {
			properties: {
				sheetId: ORG_LIMITS_ID,
				gridProperties: {
					columnCount: tableData[0].length
				}
			},
			fields: "gridProperties.columnCount"
			}
		}
	}

	_buildTableDataRequest(tableData) {
		let request = {
			updateCells: {
				rows: [],
				fields: '*',
				start: {
					sheetId: ORG_LIMITS_ID,
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
		if(i === 0) { // table header
			row = {
				values: tr.map((td) => {
					return {
						userEnteredValue: { stringValue: td },
						userEnteredFormat: {
							textFormat: {
								bold: true
							},
							backgroundColor: { red: 0.953, green: 0.953, blue: 0.953 },
							horizontalAlignment: "CENTER"
						}
					};
				})
			}
		}
		else if(i === 1) { // table header
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
				values: tr.map((td, index) => {
					if(index === 0) { // limit label
						return {
							userEnteredValue: { stringValue: td }
						};
					} else if(index === 1) { // limit percent used
						return {
							userEnteredValue: { numberValue: td },
							userEnteredFormat: {
								numberFormat: {
									type: "PERCENT"
								}
							}
						}
					}
					return {
						userEnteredValue: { numberValue: td }
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
					sheetId: ORG_LIMITS_ID,
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
	OrgLimitsFormatter
}