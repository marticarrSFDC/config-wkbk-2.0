import { LimitsProcessor } from './processors/limitsProcessor.js';
import { ObjectsProcessor } from './processors/objectsProcessor.js';

class DataProcessor {
	static async process(type) {
		const processor = this._getProcessor(type);
		const table = await processor.buildTable();
		return table;
	}

	static _getProcessor(type) {
		console.log('get processor for type:', type);
		switch (type) {
			case 'limits':
				return new LimitsProcessor();
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