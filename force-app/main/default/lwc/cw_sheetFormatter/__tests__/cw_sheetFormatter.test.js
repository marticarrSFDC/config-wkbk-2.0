import { SheetFormatter } from 'c/cw_sheetFormatter';
import { AllObjectsFormatter } from '.././formatters/allObjectsFormatter.js';

describe('sheet-formatter', () => {

    it('generateSpreadsheet - given allobjects calls AllObjectsFormatter.generateSpreadsheet', () => {
        // Arrange
        const type = 'allobjects';
        const spy = jest.spyOn(AllObjectsFormatter.prototype, 'generateSpreadsheet').mockResolvedValue({});

        // Act
        const sheet = SheetFormatter.generateSpreadsheet(type);

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('format - given allobjects calls AllObjectsFormatter.format', () => {
        // Arrange
        const type = 'allobjects';
        const spy = jest.spyOn(AllObjectsFormatter.prototype, 'format').mockResolvedValue({});

        // Act
        const sheet = SheetFormatter.format(type, []);

        // Assert
        expect(spy).toHaveBeenCalledWith([]);
    });
});