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

    afterEach(() => {
        jest.clearAllMocks();      // clears call history
        jest.resetAllMocks();      // resets .mockResolvedValue, .mockRejectedValue, etc.
    });

    it('createSpreadsheet - org health and invalid: success - given sheetNames, generates sheet request body and calls createGoogleSpreadsheet then populateSheetCallout', async () => {
        // Arrange
        const generator = new SpreadsheetGenerator();
        const processSpy = jest.spyOn(DataProcessor, 'process').mockResolvedValue([]);
        const generateSpreadsheetSpy = jest.spyOn(SheetFormatter, 'generateSpreadsheet').mockResolvedValue({});
        const formatSpy = jest.spyOn(SheetFormatter, 'format').mockResolvedValue([]);
        const consoleSpy = jest.spyOn(console, 'warn');

        createGoogleSpreadsheet.mockResolvedValue(JSON.stringify({spreadsheetId: '1111'}));
        populateSheetCallout.mockResolvedValue(JSON.stringify({}));

        // Act
        generator.createSpreadsheet(['limits', 'invalid']);
        await flushPromises();

        // Assert
        expect(generateSpreadsheetSpy).toHaveBeenCalledTimes(1);
        expect(createGoogleSpreadsheet).toHaveBeenCalledWith({jsonString: JSON.stringify({})});
        expect(processSpy).toHaveBeenNthCalledWith(1, 'limits');
        expect(formatSpy).toHaveBeenNthCalledWith(1, 'limits', []);
        expect(consoleSpy).toHaveBeenCalledWith('No handler for sheet name:', 'invalid');
        expect(populateSheetCallout).toHaveBeenNthCalledWith(1, {spreadsheetId: '1111', sheetName: encodeURIComponent('Org Limits'), jsonString: JSON.stringify({})});
    });

    it('createSpreadsheet - declarative: success - given sheetNames, generates sheet request body and calls createGoogleSpreadsheet then populateSheetCallout', async () => {
        // Arrange
        const generator = new SpreadsheetGenerator();
        const processSpy = jest.spyOn(DataProcessor, 'process').mockResolvedValue([]);
        const generateSpreadsheetSpy = jest.spyOn(SheetFormatter, 'generateSpreadsheet').mockResolvedValue({});
        const formatSpy = jest.spyOn(SheetFormatter, 'format').mockResolvedValue([]);
        const consoleSpy = jest.spyOn(console, 'warn');

        createGoogleSpreadsheet.mockResolvedValue(JSON.stringify({spreadsheetId: '1111'}));
        populateSheetCallout.mockResolvedValue(JSON.stringify({}));

        // Act
        generator.createSpreadsheet(['approvals']);
        await flushPromises();

        // Assert
        expect(generateSpreadsheetSpy).toHaveBeenCalledTimes(1);
        expect(createGoogleSpreadsheet).toHaveBeenCalledWith({jsonString: JSON.stringify({})});
        expect(processSpy).toHaveBeenNthCalledWith(1, 'approvals')
        expect(formatSpy).toHaveBeenNthCalledWith(1, 'approvals', []);
        expect(populateSheetCallout).toHaveBeenNthCalledWith(1, {spreadsheetId: '1111', sheetName: encodeURIComponent('Approval Processes'), jsonString: JSON.stringify({})});
    });

    it('createSpreadsheet - objects: success - given sheetNames, generates sheet request body and calls createGoogleSpreadsheet then populateSheetCallout', async () => {
        // Arrange
        const generator = new SpreadsheetGenerator();
        const processSpy = jest.spyOn(DataProcessor, 'process').mockResolvedValue([]);
        const generateSpreadsheetSpy = jest.spyOn(SheetFormatter, 'generateSpreadsheet').mockResolvedValue({});
        const formatSpy = jest.spyOn(SheetFormatter, 'format').mockResolvedValue([]);

        createGoogleSpreadsheet.mockResolvedValue(JSON.stringify({spreadsheetId: '1111'}));
        populateSheetCallout.mockResolvedValue(JSON.stringify({}));

        // Act
        generator.createSpreadsheet(['allobjects']);
        await flushPromises();

        // Assert
        expect(generateSpreadsheetSpy).toHaveBeenCalledTimes(1);
        expect(createGoogleSpreadsheet).toHaveBeenCalledWith({jsonString: JSON.stringify({})});
        expect(processSpy).toHaveBeenNthCalledWith(1, 'allobjects');
        expect(formatSpy).toHaveBeenNthCalledWith(1, 'allobjects', []);
        expect(populateSheetCallout).toHaveBeenNthCalledWith(1, {spreadsheetId: '1111', sheetName: encodeURIComponent('All Objects'), jsonString: JSON.stringify({})});
    });

    it('createSpreadsheet: createGoogleSpreadsheet failure - console error', async () => {
        // Arrange
        const generator = new SpreadsheetGenerator();
        const processSpy = jest.spyOn(DataProcessor, 'process').mockResolvedValue([]);
        const generateSpreadsheetSpy = jest.spyOn(SheetFormatter, 'generateSpreadsheet').mockResolvedValue({});
        const formatSpy = jest.spyOn(SheetFormatter, 'format').mockResolvedValue([]);
        const consoleSpy = jest.spyOn(console, 'error');

        createGoogleSpreadsheet.mockRejectedValue('error');
        populateSheetCallout.mockResolvedValue(JSON.stringify({}));

        // Act
        generator.createSpreadsheet(['allobjects']);
        await flushPromises();

        // Assert
        expect(generateSpreadsheetSpy).toHaveBeenCalled();
        expect(processSpy).not.toHaveBeenCalled();
        expect(formatSpy).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Error creating Google Sheet:', 'error');
        expect(populateSheetCallout).not.toHaveBeenCalled();
    });

    it('createSpreadsheet - populateSheetCallout failure - console error', async () => {
        // Arrange
        const generator = new SpreadsheetGenerator();
        const processSpy = jest.spyOn(DataProcessor, 'process').mockResolvedValue([]);
        const generateSpreadsheetSpy = jest.spyOn(SheetFormatter, 'generateSpreadsheet').mockResolvedValue({});
        const formatSpy = jest.spyOn(SheetFormatter, 'format').mockResolvedValue([]);
        const consoleSpy = jest.spyOn(console, 'error');

        createGoogleSpreadsheet.mockResolvedValue(JSON.stringify({spreadsheetId: '111'}));
        populateSheetCallout.mockRejectedValue('error');

        // Act
        generator.createSpreadsheet(['limits']);
        await flushPromises();
        await flushPromises();

        // Assert
        expect(generateSpreadsheetSpy).toHaveBeenCalled();
        expect(createGoogleSpreadsheet).toHaveBeenCalledWith({jsonString: JSON.stringify({})});
        expect(processSpy).toHaveBeenCalledWith('limits');
        expect(formatSpy).toHaveBeenCalledWith('limits', []);
        expect(consoleSpy).toHaveBeenCalledWith('Error populating Google Sheet: ', 'error');
    });
});