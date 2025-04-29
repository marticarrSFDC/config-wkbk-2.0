import { AllObjectsFormatter } from '../formatters/allObjectsFormatter.js';

describe('all-objects-formatter', () => {
	afterEach(() => {
        jest.restoreAllMocks();
    });

    it('format - given allobjects calls AllObjectsFormatter.format', () => {
        // Arrange
		const tableData = [
			[ '', '', '', '', '', 'Organization-Wide Defaults', '', '', '' ],
			[ 'Object Label', 'API Name', 'Type', 'Key Prefix', 'In Use?', 'Internal', 'External', 'Description', 'Deployment Status' ],
			[ 'Account', 'Account', 'Standard', '001', '', 'ReadWrite', 'Private', '', '' ],
			[ 'Account Account Relationship', 'AccountAccountRelation', 'Standard', '0zo', '', '', 'Private', 'Private', '' ]
		];	
        const allObjectsFormatter = new AllObjectsFormatter();

        // Act
        const body = allObjectsFormatter.format(tableData);

        // Assert
        expect(body.requests.length).toBe(12);

		expect(body.requests[0].addSheet).toBeDefined();
		expect(body.requests[0].addSheet.properties.sheetId).toBe(222);
		expect(body.requests[0].addSheet.properties.title).toBe('All Objects');
		expect(body.requests[0].addSheet.properties.gridProperties.rowCount).toBe(4);
		expect(body.requests[0].addSheet.properties.gridProperties.columnCount).toBe(9);

		expect(body.requests[1].mergeCells).toBeDefined();
		expect(body.requests[1].mergeCells.range.sheetId).toBe(222);
		expect(body.requests[1].mergeCells.range.startRowIndex).toBe(0);
		expect(body.requests[1].mergeCells.range.endRowIndex).toBe(1);
		expect(body.requests[1].mergeCells.range.startColumnIndex).toBe(5);
		expect(body.requests[1].mergeCells.range.endColumnIndex).toBe(7);

		expect(body.requests[2].updateCells).toBeDefined();
		expect(body.requests[2].updateCells.fields).toBe('*');
		expect(body.requests[2].updateCells.start.sheetId).toBe(222);
		expect(body.requests[2].updateCells.start.rowIndex).toBe(0);
		expect(body.requests[2].updateCells.start.columnIndex).toBe(0);
		expect(body.requests[2].updateCells.rows.length).toBe(4);
		expect(body.requests[2].updateCells.rows[0].values.length).toBe(9);
		expect(body.requests[2].updateCells.rows[1].values[0].userEnteredValue.stringValue).toBe('Object Label');
		expect(body.requests[2].updateCells.rows[1].values[0].userEnteredFormat.textFormat.bold).toBe(true);
		expect(body.requests[2].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.red).toBe(0.953);
		expect(body.requests[2].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.green).toBe(0.953);
		expect(body.requests[2].updateCells.rows[1].values[0].userEnteredFormat.backgroundColor.blue).toBe(0.953);
		expect(body.requests[2].updateCells.rows[2].values[0].userEnteredValue.stringValue).toBe('Account');
		
		expect(body.requests[3].updateDimensionProperties).toBeDefined();
		expect(body.requests[3].updateDimensionProperties.range.sheetId).toBe(222);
		expect(body.requests[3].updateDimensionProperties.range.dimension).toBe('COLUMNS');
		expect(body.requests[3].updateDimensionProperties.range.startIndex).toBe(0);
		expect(body.requests[3].updateDimensionProperties.range.endIndex).toBe(1);
		expect(body.requests[3].updateDimensionProperties.fields).toBe('pixelSize');
		expect(body.requests[3].updateDimensionProperties.properties.pixelSize).toBe(250);
		expect(body.requests[4].updateDimensionProperties.properties.pixelSize).toBe(250);
		expect(body.requests[5].updateDimensionProperties.properties.pixelSize).toBe(150);
		expect(body.requests[6].updateDimensionProperties.properties.pixelSize).toBe(75);
		expect(body.requests[7].updateDimensionProperties.properties.pixelSize).toBe(75);
		expect(body.requests[8].updateDimensionProperties.properties.pixelSize).toBe(125);
		expect(body.requests[9].updateDimensionProperties.properties.pixelSize).toBe(125);
		expect(body.requests[10].updateDimensionProperties.properties.pixelSize).toBe(300);
		expect(body.requests[11].updateDimensionProperties.properties.pixelSize).toBe(125);
    });
});