import { ObjectsProcessor } from '.././processors/objectsProcessor.js';

import getSObjects from "@salesforce/apex/CW_ToolingApiService.getSObjects";
import query from "@salesforce/apex/CW_ToolingApiService.query";

const SOBJECTS_MOCK = require('./data/sobjects.json');
const ENTITY_MOCK = require('./data/entities.json');

jest.mock(
	'@salesforce/apex/CW_ToolingApiService.getSObjects',
	() => ({
		__esModule: true,
		default: jest.fn()
	}),
	{ virtual: true }
);

jest.mock(
	'@salesforce/apex/CW_ToolingApiService.query',
	() => ({
		__esModule: true,
		default: jest.fn()
	}),
	{ virtual: true }
);

describe('object-processor', () => {
	afterEach(() => {
        jest.clearAllMocks();      // clears call history
        jest.resetAllMocks();      // resets .mockResolvedValue, .mockRejectedValue, etc.
    });

	it('constructor', () => {
		// Act
        const processor = new ObjectsProcessor();

		// Assert
        expect(processor).toBeInstanceOf(ObjectsProcessor);
		expect(processor.HEADER_1).toEqual(['', '', '', '', '', 'Organization-Wide Defaults', '', '', '']);
		expect(processor.HEADER_2).toEqual(['Object Label', 'API Name', 'Type', 'Key Prefix', 'In Use?', 'Internal', 'External', 'Description', 'Deployment Status']);
    });
	
	it('buildTable - process successful responses', async () => {
		// Arrange
		const processor = new ObjectsProcessor();
		getSObjects.mockResolvedValue(JSON.stringify(SOBJECTS_MOCK));
		query.mockResolvedValue(JSON.stringify(ENTITY_MOCK));

		// Act
		const table = await processor.buildTable();

		// Assert
		expect(getSObjects).toHaveBeenCalled();
		expect(query).toHaveBeenCalledWith({"query": "SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true"});
		expect(table).not.toBeNull();
		expect(table.length).toBe(5);
		expect(table[0].length).toBe(9);
		expect(table[0]).toEqual(['', '', '', '', '', 'Organization-Wide Defaults', '', '', '']);
		expect(table[1]).toEqual(['Object Label', 'API Name', 'Type', 'Key Prefix', 'In Use?', 'Internal', 'External', 'Description', 'Deployment Status']);
		expect(table[2]).toEqual(['Account', 'Account', 'Standard', '0Pp', '', 'ReadWrite', 'Private', '', '']);
		expect(table[3]).toEqual(['AgentWork__c', 'AgentWork__c', 'Custom', 'e03', '', 'ReadWrite', 'ReadWrite', 'This object is used for creating fake demo data for analytics - use the Standard Agent Work object for any functionality you want to update/work.', 'Deployed']);
		expect(table[4]).toEqual(['Criteria', 'FSL__Criteria__c', 'Custom Setting', '0Ap', '', 'ReadWrite', 'Private', '', 'Deployed']);
	});

	it('buildTable - getSObjects failure', async () => {
		// Arrange
		const processor = new ObjectsProcessor();
		getSObjects.mockRejectedValue('error');
		query.mockResolvedValue(JSON.stringify(ENTITY_MOCK));

		// Act
		let table = null;
		try {
			table = await processor.buildTable();
		} catch (e) {
			// Assert
			expect(getSObjects).toHaveBeenCalled();
			expect(query).toHaveBeenCalledWith({"query": "SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true"});
			expect(table).toBeNull();
			expect(e.message).toBe('Error retrieving metadata: error');
		}
	});

	it('buildTable - query failure', async () => {
		// Arrange
		const processor = new ObjectsProcessor();
		getSObjects.mockResolvedValue(JSON.stringify(SOBJECTS_MOCK));
		query.mockRejectedValue('error');

		// Act
		let table = null;
		try {
			table = await processor.buildTable();
		} catch (e) {
			// Assert
			expect(getSObjects).toHaveBeenCalled();
			expect(query).toHaveBeenCalledWith({"query": "SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true"});
			expect(table).toBeNull();
			expect(e.message).toBe('Error retrieving metadata: error');
		}
	});
});