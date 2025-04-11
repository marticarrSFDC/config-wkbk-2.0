import { SpreadsheetGenerator } from 'c/cw_spreadsheetGenerator';
import { DataProcessor } from 'c/cw_dataProcessor';
import { SheetFormatter } from 'c/cw_sheetFormatter';

import createGoogleSpreadsheet from '@salesforce/apex/CW_GoogleSheetsService.createGoogleSpreadsheet';
import populateSheetCallout from '@salesforce/apex/CW_GoogleSheetsService.populateSheetCallout';

jest.mock('@salesforce/apex/CW_GoogleSheetsService.createGoogleSpreadsheet', () => {
    return {
        default: jest.fn()
    };
    }, { virtual: true });

jest.mock('@salesforce/apex/CW_GoogleSheetsService.populateSheetCallout', () => {
    return {
        default: jest.fn()
    };
    }, { virtual: true });

describe('spreadsheet-generator', () => {
    async function flushPromises() {
    return Promise.resolve();
    }

    it('createSpreadsheet: success - given sheetName, generates sheet request body and calls createGoogleSpreadsheet then populateSheetCallout', async () => {
        // Arrange
        const generator = new SpreadsheetGenerator();
        const processSpy = jest.spyOn(DataProcessor, 'process').mockResolvedValue([]);
        const generateSpreadsheetSpy = jest.spyOn(SheetFormatter, 'generateSpreadsheet').mockResolvedValue({});
        const formatSpy = jest.spyOn(SheetFormatter, 'format').mockResolvedValue([]);

        createGoogleSpreadsheet.mockResolvedValue(JSON.stringify({spreadsheetId: '111'}));
        populateSheetCallout.mockResolvedValue(JSON.stringify({}));

        // Act
        generator.createSpreadsheet(['allobjects']);
        await flushPromises();

        // Assert
        expect(generateSpreadsheetSpy).toHaveBeenCalledWith('allobjects');
        expect(createGoogleSpreadsheet).toHaveBeenCalledWith({jsonString: JSON.stringify({})});
        expect(processSpy).toHaveBeenCalledWith('allobjects');
        expect(formatSpy).toHaveBeenCalledWith('allobjects', []);
        expect(populateSheetCallout).toHaveBeenCalledWith({spreadsheetId: '111', sheetName: encodeURIComponent('All Objects'), jsonString: JSON.stringify({})});
    });
});