import { ObjectsProcessor } from './processors/objectsProcessor.js';

class DataProcessor {
	static async process(type) {
		const processor = this._getProcessor(type);
		const table = await processor.buildTable();
		return table;
	}

	static _getProcessor(type) {
		switch (type) {
			case 'allobjects':
				return new ObjectsProcessor();
			default:
				throw new Error(`No processor found for type: ${type}`);
		}
	}
}

export {
	DataProcessor
}