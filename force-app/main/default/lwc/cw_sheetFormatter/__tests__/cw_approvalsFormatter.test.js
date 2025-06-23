import { ApprovalsFormatter } from '../formatters/approvalsFormatter.js';

describe('approvals-formatter', () => {
	afterEach(() => {
        jest.restoreAllMocks();
    });

    it('format - given approvals calls ApprovalsFormatter.format', () => {
        // Arrange
		const tableData = [
			[
			  "Approval Processes",
			  "",
			  "",
			  ""
			],
			[
			  "Object Name",
			  "Name",
			  "Order",
			  "Description"
			],
			[
			  "Knowledge__kav",
			  "Knowledge Approval",
			  1,
			  "What: Approval Process for Knowledge Articles."
			],
			[
			  "RCG_IDO_RE_Potential_Site__c",
			  "Potential Site Approval",
			  1,
			  null
			]
		];
        const approvalsFormatter = new ApprovalsFormatter();

        // Act
        const body = approvalsFormatter.format(tableData);

        // Assert
        expect(body.requests.length).toBe(8);

		expect(body.requests[0].addSheet).toBeDefined();
		expect(body.requests[0].addSheet.properties.sheetId).toBe(222);
		expect(body.requests[0].addSheet.properties.title).toBe('Approval Processes');
		expect(body.requests[0].addSheet.properties.gridProperties.rowCount).toBe(4);
		expect(body.requests[0].addSheet.properties.gridProperties.columnCount).toBe(5);

		expect(body.requests[1].mergeCells).toBeDefined();
		expect(body.requests[1].mergeCells.range.sheetId).toBe(222);
		expect(body.requests[1].mergeCells.range.startRowIndex).toBe(0);
		expect(body.requests[1].mergeCells.range.endRowIndex).toBe(1);
		expect(body.requests[1].mergeCells.range.startColumnIndex).toBe(0);
		expect(body.requests[1].mergeCells.range.endColumnIndex).toBe(4);

		expect(body.requests[2].updateSheetProperties).toBeDefined();
		expect(body.requests[2].updateSheetProperties.fields).toBe('gridProperties.columnCount');
		expect(body.requests[2].updateSheetProperties.properties.sheetId).toBe(222);
		expect(body.requests[2].updateSheetProperties.properties.gridProperties.columnCount).toBe(4);

		expect(body.requests[3].updateCells).toBeDefined();
		expect(body.requests[3].updateCells.fields).toBe('*');
		expect(body.requests[3].updateCells.start.sheetId).toBe(222);
		expect(body.requests[3].updateCells.start.rowIndex).toBe(0);
		expect(body.requests[3].updateCells.start.columnIndex).toBe(0);
		expect(body.requests[3].updateCells.rows.length).toBe(4);
		expect(body.requests[3].updateCells.rows[0].values.length).toBe(4);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredValue.stringValue).toBe('Object Name');
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.textFormat.bold).toBe(true);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.red).toBe(0.953);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.green).toBe(0.953);
		expect(body.requests[3].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.blue).toBe(0.953);
		expect(body.requests[3].updateCells.rows[2].values[0].userEnteredValue.stringValue).toBe('Knowledge__kav');
		expect(body.requests[3].updateCells.rows[2].values[1].userEnteredValue.stringValue).toBe('Knowledge Approval');
		expect(body.requests[3].updateCells.rows[2].values[2].userEnteredValue.numberValue).toBe(1);
		expect(body.requests[3].updateCells.rows[2].values[3].userEnteredValue.stringValue).toBe('What: Approval Process for Knowledge Articles.');
		expect(body.requests[3].updateCells.rows[3].values[0].userEnteredValue.stringValue).toBe('RCG_IDO_RE_Potential_Site__c');
		expect(body.requests[3].updateCells.rows[3].values[1].userEnteredValue.stringValue).toBe('Potential Site Approval');
		expect(body.requests[3].updateCells.rows[3].values[2].userEnteredValue.numberValue).toBe(1);
		expect(body.requests[3].updateCells.rows[3].values[3].userEnteredValue.stringValue).toBe('');
    });
});