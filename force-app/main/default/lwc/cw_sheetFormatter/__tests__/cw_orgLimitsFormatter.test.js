import { OrgLimitsFormatter } from '../formatters/orgLimitsFormatter.js';

describe('org-limits-formatter', () => {
	afterEach(() => {
        jest.restoreAllMocks();
    });

    it('format - given orglimits calls OrgLimitsFormatter.format', () => {
        // Arrange
		const tableData = [
			["Org Health","","",""],
			["Limit","% Used","Remaining","Maximum"],
			["ActiveScratchOrgs", 0.5, 5, 10],
			["AnalyticsExternalDataSizeMB", 0, 40960, 40960],
		];
        const orgLimitsFormatter = new OrgLimitsFormatter();

        // Act
        const body = orgLimitsFormatter.format(tableData);

        // Assert
        expect(body.requests.length).toBe(8);

		expect(body.requests[0].addSheet).toBeDefined();
		expect(body.requests[0].addSheet.properties.sheetId).toBe(111);
		expect(body.requests[0].addSheet.properties.title).toBe('Org Limits');
		expect(body.requests[0].addSheet.properties.gridProperties.rowCount).toBe(4);
		expect(body.requests[0].addSheet.properties.gridProperties.columnCount).toBe(5);

		expect(body.requests[1].mergeCells).toBeDefined();
		expect(body.requests[1].mergeCells.range.sheetId).toBe(111);
		expect(body.requests[1].mergeCells.range.startRowIndex).toBe(0);
		expect(body.requests[1].mergeCells.range.endRowIndex).toBe(1);
		expect(body.requests[1].mergeCells.range.startColumnIndex).toBe(0);
		expect(body.requests[1].mergeCells.range.endColumnIndex).toBe(4);

		expect(body.requests[2].updateSheetProperties).toBeDefined();
		expect(body.requests[2].updateSheetProperties.fields).toBe('gridProperties.columnCount');
		expect(body.requests[2].updateSheetProperties.properties.sheetId).toBe(111);
		expect(body.requests[2].updateSheetProperties.properties.gridProperties.columnCount).toBe(4);

		expect(body.requests[3].updateCells).toBeDefined();
		expect(body.requests[3].updateCells.fields).toBe('*');
		expect(body.requests[3].updateCells.start.sheetId).toBe(111);
		expect(body.requests[3].updateCells.start.rowIndex).toBe(0);
		expect(body.requests[3].updateCells.start.columnIndex).toBe(0);
		expect(body.requests[3].updateCells.rows.length).toBe(4);
		expect(body.requests[3].updateCells.rows[0].values.length).toBe(4);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredValue.stringValue).toBe('Limit');
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.textFormat.bold).toBe(true);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.red).toBe(0.953);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.green).toBe(0.953);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.blue).toBe(0.953);
		expect(body.requests[3].updateCells.rows[2].values[0].userEnteredValue.stringValue).toBe('ActiveScratchOrgs');
		expect(body.requests[3].updateCells.rows[2].values[1].userEnteredValue.numberValue).toBe(0.5);
		expect(body.requests[3].updateCells.rows[2].values[1].userEnteredFormat.numberFormat.type).toBe('PERCENT');
		expect(body.requests[3].updateCells.rows[2].values[2].userEnteredValue.numberValue).toBe(5);
		expect(body.requests[3].updateCells.rows[2].values[3].userEnteredValue.numberValue).toBe(10);
		expect(body.requests[3].updateCells.rows[3].values[0].userEnteredValue.stringValue).toBe('AnalyticsExternalDataSizeMB');
		expect(body.requests[3].updateCells.rows[3].values[1].userEnteredValue.numberValue).toBe(0);
		expect(body.requests[3].updateCells.rows[3].values[1].userEnteredFormat.numberFormat.type).toBe('PERCENT');
		expect(body.requests[3].updateCells.rows[3].values[2].userEnteredValue.numberValue).toBe(40960);
		expect(body.requests[3].updateCells.rows[3].values[3].userEnteredValue.numberValue).toBe(40960);
    });
});