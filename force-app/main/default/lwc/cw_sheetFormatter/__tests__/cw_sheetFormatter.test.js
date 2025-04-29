import { SheetFormatter } from 'c/cw_sheetFormatter';
import { OrgLimitsFormatter } from '.././formatters/orgLimitsFormatter.js';
import { AllObjectsFormatter } from '.././formatters/allObjectsFormatter.js';

describe('sheet-formatter', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('generateSpreadsheet - calls SheetFormatter.generateSpreadsheet', () => {
        // Arrange
        const type = 'allobjects';
        const spy = jest.spyOn(AllObjectsFormatter.prototype, 'generateSpreadsheet').mockReturnValue({});

        // Act
        const sheet = SheetFormatter.generateSpreadsheet(type);

        // Assert
        expect(spy).toHaveBeenCalled();
        expect(sheet).toEqual({});
    });

    it('generateSpreadsheet - given invalid throws error', () => {
        // Arrange
        const type = 'invalid';

        // Act
        try {
            SheetFormatter.generateSpreadsheet(type);
            expect(true).toBe(false);
        } catch (e) {
            // Assert
            expect(e.message).toBe('No formatter found for type: invalid');
        }
    });

    it('format - given limits calls OrgLimitsFormatter.format', () => {
        // Arrange
        const type = 'limits';
        const spy = jest.spyOn(OrgLimitsFormatter.prototype, 'format').mockReturnValue({});

        // Act
        const sheet = SheetFormatter.format(type, []);

        // Assert
        expect(spy).toHaveBeenCalledWith([]);
        expect(sheet).toEqual({});
    });
    
    it('format - given allobjects calls AllObjectsFormatter.format', () => {
        // Arrange
        const type = 'allobjects';
        const spy = jest.spyOn(AllObjectsFormatter.prototype, 'format').mockReturnValue({});

        // Act
        const sheet = SheetFormatter.format(type, []);

        // Assert
        expect(spy).toHaveBeenCalledWith([]);
        expect(sheet).toEqual({});
    });

    it('format - given invalid throws error', () => {
        // Arrange
        const type = 'invalid';

        // Act
        try {
            SheetFormatter.format(type);
            expect(true).toBe(false);
        } catch (e) {
            // Assert
            expect(e.message).toBe('No formatter found for type: invalid');
        }
    });
});