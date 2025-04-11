import { DataProcessor } from 'c/cw_dataProcessor';
import { ObjectsProcessor } from '.././processors/objectsProcessor.js';

describe('data-processor', () => {
    
    it('processor - given allobjects calls ObjectProcessor.buildTable', () => {
        // Arrange
        const type = 'allobjects';
        const spy = jest.spyOn(ObjectsProcessor.prototype, 'buildTable').mockResolvedValue([]);

        // Act
        const table = DataProcessor.process(type);

        // Assert
        expect(spy).toHaveBeenCalled();
    });
});