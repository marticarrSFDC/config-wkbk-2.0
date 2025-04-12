import { DataProcessor } from 'c/cw_dataProcessor';
import { ObjectsProcessor } from '.././processors/objectsProcessor.js';

describe('data-processor', () => {
    
    it('processor - given allobjects calls ObjectProcessor.buildTable', async () => {
        // Arrange
        const type = 'allobjects';
        const spy = jest.spyOn(ObjectsProcessor.prototype, 'buildTable').mockResolvedValue([]);

        // Act
        await DataProcessor.process(type);

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('processor - given invalid throws error', async () => {
        // Arrange
        const type = 'invalid';

        // Act
        try {
            await DataProcessor.process(type);
            expect(true).toBe(false);
        } catch (e) {
            // Assert
            expect(e.message).toBe('No processor found for type: invalid');
        }
    });
});