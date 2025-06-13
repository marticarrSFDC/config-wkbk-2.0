class BaseFormatter {
	_buildAddSheetRequest(sheetConfig, tableData) {
		return {
			addSheet: {
				properties: {
					sheetId: sheetConfig.sheetId,
					title: sheetConfig.title,
					gridProperties: {
						rowCount: tableData.length,
						columnCount: tableData[0].length + 1, // add 1 for merge requests
					}
				}
			},
		};
	}

	_buildMergeRequests(sheetConfig) {
		return sheetConfig.mergeRanges.map((mergeRange) => ({
			mergeCells: {
				range: {
					sheetId: sheetConfig.sheetId,
					startRowIndex: mergeRange.startRowIndex,
					endRowIndex: mergeRange.endRowIndex,
					startColumnIndex: mergeRange.startColumnIndex,
					endColumnIndex: mergeRange.endColumnIndex
				},
				mergeType: "MERGE_ALL"
			}
		}));
	}

	_buildUpdatePropertiesRequest(sheetConfig, tableData) {
		return {
			updateSheetProperties: {
			properties: {
				sheetId: sheetConfig.sheetId,
				gridProperties: {
					columnCount: tableData[0].length
				}
			},
			fields: "gridProperties.columnCount"
			}
		}
	}

	_buildHeaderCell(value) {
		return {
			userEnteredValue: { stringValue: value },
			userEnteredFormat: {
				textFormat: {
					bold: true
				},
				backgroundColor: { red: 0.953, green: 0.953, blue: 0.953 },
				horizontalAlignment: "CENTER"
			}
		};
	}

	_buildStringCell(value) {
		return {
			userEnteredValue: { stringValue: value ? value : "" }
		};
	}

	_buildPercentCell(value) {
		return {
			userEnteredValue: { numberValue: value },
			userEnteredFormat: {
				numberFormat: {
					type: "PERCENT"
				}
			}
		}
	}

	_buildNumberCell(value) {
		return {
			userEnteredValue: { numberValue: value }
		};
	}

	_buildColumnRequests(sheetConfig) {
		return sheetConfig.columnWidths.map((width, index) => ({
			updateDimensionProperties: {
				range: {
					sheetId: sheetConfig.sheetId,
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
	BaseFormatter
}